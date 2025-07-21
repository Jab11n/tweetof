document.addEventListener("DOMContentLoaded", async () => {
    const me_resp = await fetch("https://api.wasteof.money/session", {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("Token"),
        },
    });
    const me = await me_resp.json();

    const user_resp = await fetch(
        `https://api.wasteof.money/users/${me.user.name}`
    );
    const user_info = await user_resp.json();

    async function fetchHomePosts() {
        const response = await fetch(
            `https://api.wasteof.money/users/${me.user.name}/following/posts`
        );
        return await response.json();
    }

    let homePosts = await fetchHomePosts();

    if (homePosts) {
        for (let i = 0; i < homePosts.posts.length; i++) {
            let post = homePosts.posts[i];
            if (post) {
                let postElement = document.createElement("div");
                postElement.className = "post-compact";

                if (post.repost && post.content == "") {
                    let retweetElement = document.createElement("div");
                    retweetElement.className = "retweet";
                    retweetElement.innerHTML = `<i class="fa-solid fa-repeat"></i>&ensp;${post.poster.name} reposted`;
                    postElement.appendChild(retweetElement);
                }
                let postInnerElement = document.createElement("div");
                postInnerElement.className = "post-inner1";

                let postPfp = document.createElement("img");
                postPfp.className = "post-pfp";
                postPfp.src =
                    "https://api.wasteof.money/users/" +
                    post.poster.name +
                    "/picture";
                postInnerElement.appendChild(postPfp);

                let postContent = document.createElement("div");
                postContent.className = "post-content";

                let posterInfo = document.createElement("div");
                posterInfo.className = "poster-info";
                posterInfo.innerHTML = `
                    <a class="poster-name" href="/users/${post.poster.name}">@${
                    post.poster.name
                }</a>
                    <p class="post-time">${new Date(
                        post.time
                    ).toLocaleString()}</p>
                `;
                postContent.appendChild(posterInfo);

                let postText = document.createElement("div");
                postText.className = "post-text";
                postText.innerHTML = post.content;
                postContent.appendChild(postText);

                if (post.repost) {
                    let res = await fetch(
                        `https://api.wasteof.money/posts/${post.repost._id}`,
                        {
                            method: "GET",
                        }
                    );
                    let repostInfo = await res.json();
                    if (res.ok) {
                        let retweetContent = document.createElement("div");
                        retweetContent.className = "retweetcontent";
                        let retweetContentContainer =
                            document.createElement("div");
                        retweetContentContainer.className = "post-inner1";
                        let retweetAuthorPicture =
                            document.createElement("img");
                        retweetAuthorPicture.className = "post-pfp";
                        retweetAuthorPicture.src =
                            "https://api.wasteof.money/users/" +
                            repostInfo.poster.name +
                            "/picture";
                        let retweetContentContent =
                            document.createElement("div");
                        retweetContentContent.className = "post-content";
                        let retweetPosterInfo = document.createElement("div");
                        retweetPosterInfo.className = "poster-info";
                        let retweetAuthorName = document.createElement("a");
                        retweetAuthorName.className = "poster-name";
                        retweetAuthorName.href =
                            "/users/" + repostInfo.poster.name;
                        retweetAuthorName.innerText = repostInfo.poster.name;
                        let retweetPostTime = document.createElement("p");
                        retweetPostTime.className = "post-time";
                        retweetPostTime.innerText = new Date(
                            repostInfo.time
                        ).toLocaleString();
                        let repostText = document.createElement("div");
                        repostText.className = "post-text";
                        repostText.innerHTML = repostInfo.content;

                        retweetContent.appendChild(retweetContentContainer);
                        retweetContentContainer.appendChild(
                            retweetAuthorPicture
                        );
                        retweetContentContainer.appendChild(
                            retweetContentContent
                        );
                        retweetContentContent.appendChild(retweetPosterInfo);
                        retweetPosterInfo.appendChild(retweetAuthorName);
                        retweetPosterInfo.appendChild(retweetPostTime);
                        retweetContentContent.appendChild(repostText);

                        postContent.appendChild(retweetContent);

                        retweetContent.addEventListener("click", (e) => {
                            e.stopPropagation();
                            window.location.href = `/posts/${repostInfo._id}`;
                        });
                    }
                } else if (post.repost === null) {
                    let retweetContent = document.createElement("div");
                    retweetContent.className = "retweetcontent";
                    retweetContent.innerText =
                        "The post that was reposted has been deleted.";
                    postContent.appendChild(retweetContent);
                }

                postInnerElement.appendChild(postContent);
                postElement.appendChild(postInnerElement);

                let postActions = document.createElement("div");
                postActions.className = "post-actions";
                let postActionsInsert;
                if (localStorage.getItem("Token")) {
                    let res = await fetch(
                        `https://api.wasteof.money/posts/${
                            post._id
                        }/loves/${localStorage.getItem("Username")}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: localStorage.getItem("Token"),
                            },
                        }
                    );
                    let resData = await res.json();
                    if (res.ok && resData.loved === "true") {
                        postActionsInsert = `
                                <a class="post-action action-like action-like-true" href="#">
                                <i class="fa-solid fa-star"></i>
                                <span class="like-count">${post.loves}</span>
                                </a>
                            `;
                    } else {
                        postActionsInsert = `
                                <a class="post-action action-like" href="#">
                                <i class="fa-solid fa-star"></i>
                                <span class="like-count">${post.loves}</span>
                                </a>
                            `;
                    }
                } else {
                    postActionsInsert = `
                                <a class="post-action action-like" href="#">
                        <i class="fa-solid fa-star"></i>
                        <span class="like-count">${post.loves}</span>
                    </a>`;
                }
                postActions.innerHTML = `
                    <a class="post-action action-reply" href="#">
                        <i class="fa-solid fa-reply"></i>
                        <span class="comment-count">${post.comments}</span>
                    </a>
                    <a class="post-action action-repost" href="#">
                        <i class="fa-solid fa-repeat"></i>
                        <span class="repost-count">${post.reposts}</span>
                    </a>
                    ${postActionsInsert}
                `;
                postElement.appendChild(postActions);

                document.getElementById("posts").appendChild(postElement);

                postElement.addEventListener("click", () => {
                    window.location.href = `/posts/${post._id}`;
                });
            }
        }
    }

    document.getElementById(
        "you-banner"
    ).src = `https://api.wasteof.money/users/${me.user.name}/banner`;
    document.getElementById(
        "you-pfp"
    ).src = `https://api.wasteof.money/users/${me.user.name}/picture`;
    document.getElementById(
        "tweet-box-pfp"
    ).src = `https://api.wasteof.money/users/${me.user.name}/picture`;
    document.getElementById("home-username").innerText = `@${me.user.name}`;
    document.getElementById("home-posts").children[1].innerText =
        user_info.stats.posts;
    document.getElementById("home-followers").children[1].innerText =
        user_info.stats.followers;
    document.getElementById("home-following").children[1].innerText =
        user_info.stats.following;
});
