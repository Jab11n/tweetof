document.addEventListener("DOMContentLoaded", async () => {
    let postsPage = 1;

    let username = window.location.pathname.split("/")[2];

    document.getElementById("posts-nav").href = `/users/${username}`;
    document.getElementById("posts-count").href = `/users/${username}`;
    document.getElementById("following").href = `/users/${username}/following`;
    document.getElementById("followers").href = `/users/${username}/followers`;

    async function loadTopUsers() {
        const topusers = await (
            await fetch("https://api.wasteof.money/explore/users/top")
        ).json();
        const shuffledUsers = [...topusers].sort(() => 0.5 - Math.random());
        const whoToFollow = shuffledUsers.slice(0, 3);
        for (let i = 0; i < whoToFollow.length; i++) {
            let topUser1 = document.createElement("div");
            topUser1.className = "follow-user";
            let topUser1a = document.createElement("a");
            topUser1a.className = "follow-user-h";
            topUser1a.href = `/users/${whoToFollow[i].name}`;

            topUser1.appendChild(topUser1a);

            topUser1a.innerHTML = `<img src="https://api.wasteof.money/users/${whoToFollow[i].name}/picture" /><p>@${whoToFollow[i].name}</p>`;
            let topUser1b = document.createElement("button");
            topUser1b.className = "follow-user-btn";
            topUser1b.innerHTML = `<i class="fa-solid fa-user-plus"></i>&ensp;Follow`;
            topUser1.appendChild(topUser1b);

            document.getElementById("follow-users").appendChild(topUser1);
        }
    }

    async function fetchUserData(username) {
        let response = await fetch(
            `https://api.wasteof.money/users/${username}`
        );
        if (!response.ok) {
            console.error(
                "Error while fetching user data: ",
                response.statusText
            );
            if (response.status === 404) {
                window.location.pathname = "/404";
            } else {
                alert(
                    "an error occurred. " +
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

    function loadUserData(userData) {
        document.getElementById("user-stat-post-count").innerText =
            userData.stats.posts;
        document.getElementById("user-stat-following-count").innerText =
            userData.stats.following;
        document.getElementById("user-stat-follower-count").innerText =
            userData.stats.followers;
        document.getElementById("name").innerText = "@" + userData.name;

        // those little badges by usernames
        if (userData.verified) {
            document.getElementById("name").innerHTML +=
                "&nbsp;<i class='fa-solid fa-circle-check verified'></i>";
        }
        if (userData.permissions.admin) {
            document.getElementById("name").innerHTML +=
                "&nbsp;<i class='fa-solid fa-shield-halved'></i>";
        }
        if (userData.permissions.banned) {
            document.getElementById("name").innerHTML +=
                "&nbsp;<i class='fa-solid fa-ban'></i>";
        }
        if (userData.beta) {
            document.getElementById("name").innerHTML +=
                "&nbsp;<i class='fa-solid fa-flask'></i>";
        }
        if (userData.name === "-gr") {
            document.getElementById("name").innerHTML +=
                "&nbsp;<i class='fa-brands fa-twitter'></i>";
        }

        document.getElementById("userid").innerText = userData.id;
        document.getElementById("bio").innerText = userData.bio;
        const userJoin = new Date(userData.history.joined);
        const userJoinMonth = userJoin.toLocaleString("default", {
            month: "long",
        });
        const userJoinYear = userJoin.getFullYear();
        document.getElementById("user-join").innerHTML +=
            userJoinMonth + " " + userJoinYear;
        document.getElementById("user-color").innerHTML +=
            userData.color.charAt(0).toUpperCase() + userData.color.slice(1);
        if (userData.online) {
            document.getElementById("user-online").innerHTML =
                "<i class='fa-solid fa-circle'></i>&ensp;Online";
        } else {
            document.getElementById("user-online").innerHTML =
                "<i class='fa-solid fa-circle-half-stroke'></i>&ensp;Offline";
        }
        if (localStorage.getItem("Token")) {
            let tweetToUser = document.createElement("button");
            tweetToUser.id = "tweet-to-user";
            tweetToUser.innerHTML = `<i class="fa-solid fa-feather-pointed"></i>&ensp;Tweet to @${userData.name}`;
            document.getElementById("user").appendChild(tweetToUser);
        } else {
            document.getElementById("login-user").style.display = "flex";
            document.getElementById("loginuser-name").innerText = userData.name;
        }
    }

    async function fetchUserWall() {
        const response = await fetch(
            `https://api.wasteof.money/users/${username}/wall`
        );
        return await response.json();
    }

    let userData = await fetchUserData(username);
    loadUserData(userData);

    const userWall = await fetchUserWall();
});
