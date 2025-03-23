document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.startsWith("/users/")) {
        let username = window.location.pathname.split("/users/")[1];
        if (!username || username.trim() === "") {
            alert("Invalid username.");
            return;
        }

        async function fetchUserData(username) {
            const response = await fetch(`/api/users/${username}`);
            if (!response.ok) {
                console.error("Error fetching user data:", response.statusText);
                if (response.status === 404) {
                    window.location.href = "/404";
                    return null;
                } else {
                    alert(
                        "An error occurred. " +
                            response.statusText +
                            " (" +
                            response.status +
                            ")"
                    );
                    return null;
                }
            } else {
                return await response.json();
            }
        }

        const userData = await fetchUserData(username);

        if (userData) {
            console.log("User data:", userData);
            document.title = userData.name + " - Tweetof";
            document.getElementById("user-stat-post-count").innerText =
                userData.stats.posts;
            document.getElementById("user-stat-following-count").innerText =
                userData.stats.following;
            document.getElementById("user-stat-follower-count").innerText =
                userData.stats.followers;
            document.getElementById("name").innerText = "@" + userData.name;
            if (userData.verified) {
                document.getElementById("name").innerHTML =
                    document.getElementById("name").innerHTML +
                    "&nbsp;<i class='fa-solid fa-circle-check verified fa-sm'></i>";
            }
            if (userData.permissions.admin) {
                document.getElementById("name").innerHTML =
                    document.getElementById("name").innerHTML +
                    "&nbsp;<i class='fa-solid fa-shield-halved'></i>";
            }
            if (userData.permissions.banned) {
                document.getElementById("name").innerHTML =
                    document.getElementById("name").innerHTML +
                    "&nbsp;<i class='fa-solid fa-ban'></i>";
            }
            if (userData.name === "-gr") {
                document.getElementById("name").innerHTML =
                    document.getElementById("name").innerHTML +
                    "&nbsp;<i class='fa-brands fa-twitter'></i>";
            }
            document.getElementById("userid").innerText = userData.id;
            document.getElementById("bio").innerText = userData.bio;
            const userJoin = new Date(userData.history.joined);
            const userJoinMonth = userJoin.toLocaleString("default", {
                month: "long",
            });
            const userJoinYear = userJoin.getFullYear();
            document.getElementById("user-join").innerHTML =
                document.getElementById("user-join").innerHTML +
                userJoinMonth +
                " " +
                userJoinYear;
            document.getElementById("user-color").innerHTML =
                document.getElementById("user-color").innerHTML +
                userData.color.charAt(0).toUpperCase() +
                userData.color.slice(1);
            if (userData.online) {
                document.getElementById("user-online").innerHTML =
                    "<i class='fa-solid fa-circle'></i>&ensp;Online";
            } else {
                document.getElementById("user-online").innerHTML =
                    "<i class='fa-solid fa-circle-half-stroke'></i>&ensp;Offline";
            }
            document.getElementById("loginuser-name").innerText = userData.name;
        }

        document.getElementById("user-pfp").src =
            "https://api.wasteof.money/users/" + username + "/picture";
        document.getElementById("user-banner").src =
            "https://api.wasteof.money/users/" + username + "/banner";
    }
});
