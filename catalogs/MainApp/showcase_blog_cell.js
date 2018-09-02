function show_user() {
    owner.action("script", {
        "script":"show_user",
        "username":$data["author"]
    });
}

function show_votes() {
    owner.action("script", {
        "script":"show_votes",
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
}

function show_replies() {
    owner.action("script", {
        "script":"show_replies",
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
}

function show_tag() {
    owner.action("script", {
        "script":"show_tag",
        "tag":$data["main-tag"]
    });
}
