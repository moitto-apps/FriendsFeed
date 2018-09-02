var api   = require("api");
var users = require("users"); 

function add_group() {
    controller.action("popup", {
        "display-unit":"S_GROUP_NEW"
    });
}

function remove_group(data) {
    controller.catalog().remove("showcase", "groups", data["group"]);

    __reload_groups_showcase();
}

function reload_groups() {
    __reload_groups_showcase();
}

function __reload_groups_showcase() {
    var showcase = view.object("showcase.groups");

    showcase.action("reload");
}
