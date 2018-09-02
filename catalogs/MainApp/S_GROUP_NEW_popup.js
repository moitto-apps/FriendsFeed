var users = require("users");

var __members = [];

function feed_members(keyword, location, length, sortkey, sortorder, handler) {
    if (__members.length > 0) {
        var data = [];

        __members.forEach(function(member) {
            var user = users.create(member);

            data.push({
                "id":"S_MEMBER_" + member,
                "username":member,
                "userpic-url":user.get_userpic_url("small")
            });
        });

        handler(data);
    } else {
        handler([]);
    }
}

function add_member(data) {
    if (__members.length < 20) {
        if (__members.indexOf(data["member"]) < 0) {
            __members.push(data["member"]);

            __clear_member_textfield();
            __reload_members_showcase();
        } else {
            controller.action("alert", { "message":"이미 등록되어 있습니다." });
    
            __clear_member_textfield();
        }      
    } else {
        controller.action("alert", { "message":"20명을 초과헸습니다." });

        __clear_member_textfield();
    }
}

function remove_member(data) {
    var index = __members.indexOf(data["member"]);

    if (index >= 0) {
        __members.splice(index, 1);
    }

    __remove_member_in_showcase(index);
}

function done() {
    if (__members.length > 0) {
        var title = view.object("group.title").value();

        if (title) {
            __submit_new_group(title, __members);

            controller.action("toast", { "message":"새 그룹이 추가되었습니다." });
            host.action("script", {
                "script":"reload_groups",
                "close-popup":"yes"
            });
        } else {
            controller.action("alert", { "message":"그룹 이름을 지정해주세요." });

            __focus_group_title_textfield();
        }
    } else {
        controller.action("alert", { "message":"그룹에 스팀 계정을 추가해주세요." });

        __focus_member_textfield();
    }
}

function __submit_new_group(title, members) {
    var identifier = "S_GROUPS_" + new Date().toISOString().replace(/[.:\-]/g, "").toUpperCase();

    controller.catalog().submit("showcase", "groups", identifier, {
        "id":identifier,
        "title":title,
        "members-count":members.length.toString(),
        "members-count-1":(Math.max(members.length, 1) - 1).toString(),
        "members":members.join(","),
        "first-member":members ? members[0] : "",
        "userpic-url":members ? users.create(members[0]).get_userpic_url() : "",
        "has-own-title":"yes",
        "has-own-navibar":"yes"
    });
}

function __reload_members_showcase() {
    var showcase = view.object("showcase.members");

    showcase.action("reload");
}

function __remove_member_in_showcase(index) {
    var showcase = view.object("showcase.members");

    showcase.action("remove", { "number":(index + 1).toString() });    
}

function __clear_member_textfield() {
   var textfield = view.object("member");

    textfield.action("clear");
}

function __focus_group_title_textfield() {
   var textfield = view.object("group.title");

    textfield.action("focus");
}

function __focus_member_textfield() {
   var textfield = view.object("member");

    textfield.action("focus");
}

