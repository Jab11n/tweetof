document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("navbar").innerHTML = await (
        await fetch("/static/global/elements/navbar.html")
    ).text();
    if (localStorage.getItem("Token")) {
        const un = localStorage.getItem("Username");
        document.getElementById("nav-login").style.display = "none";
        document.getElementById(
            "nav-user"
        ).src = `https://api.wasteof.money/users/${un}/picture`;
        document.getElementById("nav-user").style.display = "block";
        document.getElementById("nav-compose").style.display = "flex";

        document.getElementById("nav-go-home").href = "/home";
    } else {
        document.getElementById("nav-login").style.display = "block";
    }
    if (
        window.location.pathname == "/" ||
        window.location.pathname == "/home"
    ) {
        document.getElementById("nav-go-home").className =
            document.getElementById("nav-go-home").className + " nav-loc-cur";
    }
});
