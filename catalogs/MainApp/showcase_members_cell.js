function remove() {
    owner.action("script", {
        "script":"remove_member",
        "member":$data["username"]
    });
}
