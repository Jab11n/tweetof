document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("navbar").innerHTML = await (
        await fetch("/static/global/elements/navbar.html")
    ).text();
    if (localStorage.getItem("Username")) {
    }
});
