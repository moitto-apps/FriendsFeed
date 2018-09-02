var users = require("users");

function create(form) {
    var identifier = "S_GROUPS_" + new Date().toISOString().replace(/[.:\-]/g, "").toUpperCase();
    var members = document.value("GROUP_MEMBERS");

    controller.catalog().submit("showcase", "groups", identifier, {
        "id":identifier,
        "title":form["title"],
        "members-count":members.length.toString(),
        "members-count-1":(Math.max(members.length, 1) - 1).toString(),
        "members":members.join(","),
        "first-member":members ? members[0] : "",
        "userpic-url":members ? users.create(members[0]).get_userpic_url() : "",
        "has-own-title":"yes"
    });
}
