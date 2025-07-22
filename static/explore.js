document.addEventListener("DOMContentLoaded", async () => {
    async function getTopUsers() {
        const topUsers = await (
            await fetch("https://api.wasteof.money/explore/users/top")
        ).json();
        for (i = 0; i < topUsers.length; i++) {
            let topUserCard = document.createElement("a");
            topUserCard.className = "top-user";
            topUserCard.href = `/users/${topUsers[i].name}`;
            let topUserBanner = document.createElement("img");
            topUserBanner.className = "top-user-banner";
            topUserBanner.src = `https://api.wasteof.money/users/${topUsers[i].name}/banner`;
            let topUserPfp = document.createElement("img");
            topUserPfp.className = "top-user-pfp";
            topUserPfp.src = `https://api.wasteof.money/users/${topUsers[i].name}/picture`;
            let topUserName = document.createElement("h2");
            topUserName.innerText = `@${topUsers[i].name}`;
            let followUserBtn = document.createElement("button");
            followUserBtn.className = "follow-user-btn";
            followUserBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i
                                        >&ensp;Follow`;
            followUserBtn.addEventListener("click", () => {
                followUser(topUsers[i].name);
            });
            topUserCard.appendChild(topUserBanner);
            topUserCard.appendChild(topUserPfp);
            topUserCard.appendChild(topUserName);
            topUserCard.appendChild(followUserBtn);
            document.getElementById("top-user-row").appendChild(topUserCard);
        }
    }

    async function followUser(username) {
        //
    }

    async function getTopPosts(timeframe) {
        let trendingPosts = await (
            await fetch(
                `https://api.wasteof.money/explore/posts/trending?timeframe=${
                    document.getElementById("trending-time").value
                }`
            )
        ).json();
    }

    getTopUsers();
    getTopPosts();
});
