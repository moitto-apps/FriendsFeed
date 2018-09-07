API = (function() {
    return {
        __handlers:{}
    };
})();

API.open_discussion = function(params, handler) {
    API.__request_call("open_discussion", {
        "author":params["author"],
        "permlink":params["permlink"]
    }, handler);
}

API.show_user = function(params, handler) {
    API.__request_call("show_user", {
        "username":params["username"]
    }, handler);
}

API.show_votes = function(params, handler) {
    API.__request_call("show_votes", {
        "author":params["author"],
        "permlink":params["permlink"]
    }, handler);
}

API.show_replies = function(params, handler) {
    API.__request_call("show_replies", {
        "author":params["author"],
        "permlink":params["permlink"]
    }, handler);
}

API.show_tag = function(params, handler) {
    API.__request_call("show_tag", {
        "tag":params["tag"]
    }, handler);
}

API.vote = function(params, handler) {
    API.__request_call("vote", {
        "author":params["author"],
        "permlink":params["permlink"],
        "weight":params["weight"] || ""
    }, handler);
}

API.reblog = function(params, handler) {
    API.__request_call("reblog", {
        "author":params["author"],
        "permlink":params["permlink"]
    }, handler);
}

API.comment = function(params, handler) {
    API.__request_call("comment", {
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"] || "",
        "body":params["body"] || ""
    }, handler);
}

API.delete_comment = function(params, handler) {
    API.__request_call("delete_comment", {
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"]
    }, handler);
}

API.follow = function(params, handler) {
    API.__request_call("follow", {
        "following":params["following"]
    }, handler);
}

API.unfollow = function(params, handler) {
    API.__request_call("unfollow", {
        "following":params["following"]
    }, handler);
}

API.mute = function(params, handler) {
    API.__request_call("mute", {
        "following":params["following"]
    }, handler);
}

API.unmute = function(params, handler) {
    API.__request_call("unmute", {
        "following":params["following"]
    }, handler);
}

API.transfer = function(params, handler) {
    API.__request_call("transfer", {
        "to":params["to"], 
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW",
        "amount-type":params["amount-type"] || (params["coin"] || "SBD"),
        "amount":params["amount"] || ""
    }, handler);
}

API.delegate = function(params, handler) {
    API.__request_call("delegate", {
        "to":params["to"], 
        "coin":params["coin"] || "SP", 
        "amount":params["amount"] || ""
    }, handler);
}

API.undelegate = function(params, handler) {
    API.__request_call("undelegate", {
        "from":params["from"],
        "coin":params["coin"] || "SP"
    }, handler);
}

API.power_up = function(params, handler) {
    API.__request_call("power_up", {
        "coin":params["coin"] || "STEEM", 
        "amount":params["amount"] || ""
    }, handler);
}

API.power_down = function(params, handler) {
    API.__request_call("power_down", {
        "coin":params["coin"] || "SP", 
        "amount":params["amount"] || ""
    }, handler);
}

API.redeem_rewards = function(params, handler) {
    API.__request_call("redeem_rewards", {
        /* nothing */
    }, handler);
}

API.start_quest = function(params, handler) {
    API.__request_call("start_quest", {
        "author":params["author"],
        "permlink":params["permlink"]
    }, handler);
}

API.finish_quest = function(params, handler) {
    API.__request_call("finish_quest", {
        "author":params["author"],
        "permlink":params["permlink"],
        "comment":params["comment"]
    }, handler);
}

API.on_complete = function(params) {
    var handler = API.__handlers[params["request-id"] || ""];

    if (handler) {
        handler(params);
    }

    delete API.__handlers["request-id"];
}

API.__request_call = function(script, params, handler) {
    if ($data["APPID"] !== $data["HOST_APPID"]) {
        var request_id = new Date().toISOString().replace(/[.:\-]/g, "").toLowerCase();

        controller.action("script", Object.assign({
            "script":"api." + script,
            "app":"__MAIN__",
            "routes-to-topmost":"no",
            "request-id":request_id,
            "return-script":handler ? "API.on_complete" : "",
            "return-subview":$data["SUBVIEW"] || "__MAIN__"
        }, params));

        if (handler) {
            API.__handlers[request_id] = handler;
        }

        return;
    }

    controller.action("toast", { "message":"모이또에서 실행해주세요." });
}

__MODULE__ = API;
