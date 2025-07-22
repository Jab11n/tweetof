if (localStorage.getItem("Token")) {
    window.location.pathname = "/home";
}

document.addEventListener("DOMContentLoaded", function () {
    const logInBtn = document.getElementById("front-login-button");
    logInBtn.addEventListener("click", async function () {
        const username = document.getElementById("front-uname-input").value;
        const password = document.getElementById("front-pass-input").value;

        if (username && password) {
            try {
                const resp = await fetch("https://api.wasteof.money/session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });

                const data = await resp.json();

                if (resp.ok) {
                    localStorage.setItem("Token", data.token);
                    localStorage.setItem("Username", username);
                    window.location.pathname = "/home";
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
    });
    const loginHow = document.getElementById("login-how");
    loginHow.addEventListener("click", () => {
        if (loginHow.className == "login-how-closed") {
            loginHow.className = "login-how-open";
            loginHow.innerHTML = `<span>How this works&ensp;<i class="fa-solid fa-caret-up"></i></span><br>Tweetof interacts directly with the wasteof.money API to provide you the same content as what you would see on wasteof.money but from a different site and interface (this one :P). No user data is stored on Tweetof servers, and everything is processed on wasteof.money's servers. Wasteof.money's terms of use and privacy policy apply.`;
        } else {
            loginHow.className = "login-how-closed";
            loginHow.innerHTML = `<span>How this works&ensp;<i class="fa-solid fa-caret-down"></i></span>`;
        }
    });
});
