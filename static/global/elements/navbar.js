document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("navbar").innerHTML = await (
        await fetch("/static/global/elements/navbar.html")
    ).text();

    async function logOut(token) {
        let response = await await fetch(`https://api.wasteof.money/session`, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("Token"),
            },
        });
        if (response.ok) {
            localStorage.removeItem("Token");
            localStorage.removeItem("Username");
            window.location.pathname = "/";
        }
    }

    if (localStorage.getItem("Token")) {
        const un = localStorage.getItem("Username");
        document.getElementById("nav-login").style.display = "none";
        document.getElementById(
            "nav-user"
        ).src = `https://api.wasteof.money/users/${un}/picture`;
        document.getElementById("nav-user").style.display = "block";
        document.getElementById("nav-compose").style.display = "flex";

        document.getElementById("nav-go-home").href = "/home";

        document.getElementById("nav-user").addEventListener("click", () => {
            if (
                document.getElementById("user-options").style.display == "none"
            ) {
                document.getElementById("user-options").style.display = "flex";
            } else {
                document.getElementById("user-options").style.display = "none";
            }
        });

        document.getElementById(
            "user-options"
        ).children[0].href = `/users/${un}`;
        document
            .getElementById("user-options")
            .children[2].addEventListener("click", () => {
                logOut();
            });
    } else {
        document.getElementById("nav-login").style.display = "block";
    }

    if (
        window.location.pathname == "/" ||
        window.location.pathname == "/home"
    ) {
        document.getElementById("nav-go-home").className =
            document.getElementById("nav-go-home").className + " nav-loc-cur";
    } else if (window.location.pathname == "/explore") {
        document.getElementById("nav-go-explore").className =
            document.getElementById("nav-go-explore").className +
            " nav-loc-cur";
    }
});
