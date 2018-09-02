var steemjs  = require("steemjs");
var global   = require("global");
var contents = require("contents");
var users    = require("users");
var api      = require("api");
//var safety   = require("safety");

var __disallowed_tags = []; //safety.get_disallowed_tags();
var __discussion_pool = null;

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    if (location == 0) {
        __discussion_pool = __create_discussion_pool();
    }

    __get_discussions_in_pool(__discussion_pool, length, [], function(discussions) {
        var data = [];

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
            var datum = {
                "id":"S_BLOG_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("256x512") || "",
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "votes-count":content.data["net_votes"].toString(),
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "payout-done":content.is_payout_done() ? "yes" : "no",
                "payout-declined":content.is_payout_declined() ? "yes" : "no",
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            };

            datum = Object.assign(datum, __template_data_for_content(content));

            if (content.is_allowed(__disallowed_tags)) {
               data.push(datum);
            }
        });

        if (discussions.length > 0) {
            __last_discussion = discussions[discussions.length - 1];
        }

        handler(data);
    });        
}

function open_discussion(data) {
    api.open_discussion({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_user(data) {
    api.show_user({
        "username":data["username"]
    });
}

function show_votes(data) {
    api.show_votes({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_replies(data) {
    api.show_replies({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_tag(data) {
    api.show_tag({
        "tag":data["tag"]
    });
}

function prompt_remove_group() {
    controller.action("prompt", {
        "title":"알림",
        "message":"이 그룹을 삭제하시겠습니까?",
        "button-1":"삭제하기;script;script=remove_group",
        "cancel-label":"취소"
    });
}

function remove_group() {
    controller.action("script", {
        "script":"remove_group",
        "subview":"V_HOME",
        "group":$data["id"]
    });
    controller.action("page-back");
}

function __get_discussions_in_pool(pool, length, discussions, handler) {
    while (true) {
        var discussion = __pop_discussion_in_pool(pool);

        if (!discussion) {
            __fill_discussion_pool(pool, length, function(response) {
                if (response) {
                    __get_discussions_in_pool(pool, length, discussions, handler);
                } else {
                    handler(discussions);
                }
            });

            return;
        }

        discussions.push(discussion);

        if (discussions.length == length) {
            handler(discussions);

            return;
        }        
    }
}

function __get_discussions_by_blog(username, start_author, start_permlink, length, discussions, handler) {
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(response) {
        if (start_author && response.length > 0) {
            response = response.splice(1);
        }

        response.forEach(function(discussion) {
            if (discussion["author"] === username) {
                if (discussions.length < length) {
                   discussions.push(discussion);
                }
            }
        });

        if (discussions.length == 0 && response.length > 0) {
            start_author   = response[response.length - 1]["author"];
            start_permlink = response[response.length - 1]["permlink"];

            __get_discussions_by_blog(username, start_author, start_permlink, length, discussions, handler);

            return;
        }

        handler(discussions);
    });
}

function __create_discussion_pool() {
    var pool = {};

    $data["members"].split(",").forEach(function(member) {
        pool[member] = [];
    });

    return pool;
}

function __fill_discussion_pool(pool, length, handler) {
    var members  = [];
    var promises = [];

    for (var member in pool) {
        if (pool[member].length == 0 || pool[member].length == 1) {
            var start_author   = (pool[member].length == 1) ? pool[member][0]["author"]   : null;
            var start_permlink = (pool[member].length == 1) ? pool[member][0]["permlink"] : null;

            promises.push(new Promise(function(resolve, reject) {
                __get_discussions_by_blog(member, start_author, start_permlink, length, [], function(discussions) {
                    resolve(discussions);
                }, function(reason) {
                    reject(reason);
                });
            }));
            members.push(member);
        }
    }

    if (promises) {
        Promise.all(promises).then(function(response) {
            var members_to_delete = [];

            for (var i = 0; i < members.length; i++) {
                if (response[i].length > 0) {
                    pool[members[i]] = pool[members[i]].concat(response[i]);
                } else {
                    members_to_delete.push(members[i]);
                }
            }

            members_to_delete.forEach(function(member) {
                delete pool[member];
            });

            handler(response);
        }, function(reason) {
            handler();
        });
    }
}

function __pop_discussion_in_pool(pool) {
    var discussion = null;
    var last_member = null;

    for (var member in pool) {
        if (pool[member].length > 1) { 
            if (!discussion || discussion["created"] < pool[member][0]["created"]) {
                if (discussion) {
                    pool[last_member].unshift(discussion);
                }

                discussion = pool[member].shift();
                last_member = member;
            }
        } else {
            return null;
        }
    }

    return discussion;
}

function __reload_showcase_header() {
    var showcase = view.object("showcase.blog");

    showcase.action("reload-header");
}

function __template_data_for_content(content) {
    if ((content.meta["image"] || []).length == 0) {
        return {
            "template":"text"
        }
    }

    return {};
}

function __discussion_data_for_value(value) {
    var data = [];

    [ "author", "permlink", "userpic-url" ].forEach(function(key) {
        data[key] = value[key];
    });

    Object.keys(value).forEach(function(key) {
        if (key.startsWith("template") || key.startsWith("background")) {
            data[key] = value[key];
        }
    });

    return data;
}

