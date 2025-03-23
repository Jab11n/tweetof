document.addEventListener("DOMContentLoaded", function () {
    const logInBtn = document.getElementById("front-login-button");
    logInBtn.addEventListener("click", async function () {
        const username = document.getElementById("front-uname-input").value;
        const password = document.getElementById("front-pass-input").value;

        if (username && password) {
            try {
                const resp = await fetch("/api/login", {
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
                    alert("Login Successful.");
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
    });
});
