function show_menu() {
    controller.catalog().submit("showcase", "auxiliary", "S_GROUP.MENU", {
        "has-own-sbml":"yes"
    });
    controller.action("popup", { "display-unit":"S_GROUP.MENU" })
}
