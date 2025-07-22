if (!localStorage.getItem("Token")) {
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", async () => {
    let postsPage = 1;

    const me = await (
        await fetch("https://api.wasteof.money/session", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Token"),
            },
        })
    ).json();

    async function likePost(post_id) {
        let response = await (
            await fetch(`https://api.wasteof.money/posts/${post_id}/loves`, {
                headers: {
                    Authorization: localStorage.getItem("Token"),
                },
                method: "POST",
            })
        ).json();
        if (response.ok == "loved") {
            let postElement = document.getElementById(`POST_${post_id}`);
            postElement.children[1].children[2].className = `post-action action-like action-like-true`;
            postElement.children[1].children[2].children[1].innerText =
                response.new.loves; // this is definitely not efficient but who cares 😂
        } else {
            let postElement = document.getElementById(`POST_${post_id}`);
            postElement.children[1].children[2].className = `post-action action-like`;
            postElement.children[1].children[2].children[1].innerText =
                response.new.loves;
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

    fetch(`https://api.wasteof.money/users/${me.user.name}`)
        .then((e) => e.json())
        .then((user_info) => {
            document.getElementById("home-posts").children[1].innerText =
                user_info.stats.posts;
            document.getElementById("home-followers").children[1].innerText =
                user_info.stats.followers;
            document.getElementById("home-following").children[1].innerText =
                user_info.stats.following;
        });

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

    async function fetchHomePosts() {
        const response = await fetch(
            `https://api.wasteof.money/users/${me.user.name}/following/posts`
        );
        return await response.json();
    }

    let homePosts = await fetchHomePosts();

    async function loadPost(post) {
        if (!post) return;

        let postElement = document.createElement("div");
        postElement.className = "post-compact";
        postElement.id = `POST_${post._id}`;

        if (
            post.repost &&
            (post.content.trim() == '""' ||
                post.content.trim() == undefined ||
                post.content.trim() == "" ||
                post.content.trim() == "<p></p>")
        ) {
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
            "https://api.wasteof.money/users/" + post.poster.name + "/picture";
        postInnerElement.appendChild(postPfp);

        let postContent = document.createElement("div");
        postContent.className = "post-content";

        let posterInfo = document.createElement("div");
        posterInfo.className = "poster-info";
        posterInfo.innerHTML = `<a class="poster-name" href="/users/${
            post.poster.name
        }">@${post.poster.name}</a><p class="post-time">${new Date(
            post.time
        ).toLocaleString()}</p>`;
        postContent.appendChild(posterInfo);

        let postText = document.createElement("div");
        postText.className = "post-text";
        postText.innerHTML = post.content;
        if (
            post.content.trim() == '""' ||
            post.content.trim() == undefined ||
            post.content.trim() == "" ||
            post.content.trim() == "<p></p>"
        ) {
            postText.style.display = "none";
        }
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
                let retweetContentContainer = document.createElement("div");
                retweetContentContainer.className = "post-inner1";
                let retweetAuthorPicture = document.createElement("img");
                retweetAuthorPicture.className = "post-pfp";
                retweetAuthorPicture.src =
                    "https://api.wasteof.money/users/" +
                    repostInfo.poster.name +
                    "/picture";
                let retweetContentContent = document.createElement("div");
                retweetContentContent.className = "post-content";
                let retweetPosterInfo = document.createElement("div");
                retweetPosterInfo.className = "poster-info";
                let retweetAuthorName = document.createElement("a");
                retweetAuthorName.className = "poster-name";
                retweetAuthorName.href = "/users/" + repostInfo.poster.name;
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
                retweetContentContainer.appendChild(retweetAuthorPicture);
                retweetContentContainer.appendChild(retweetContentContent);
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
            let res = await (
                await fetch(
                    `https://api.wasteof.money/posts/${
                        post._id
                    }/loves/${localStorage.getItem("Username")}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: localStorage.getItem("Token"),
                        },
                    }
                )
            ).json();
            if (res) {
                postActionsInsert = `<a class="post-action action-like action-like-true">
<i class="fa-solid fa-star"></i>
<span class="like-count">${post.loves}</span>
</a>`;
            } else {
                postActionsInsert = `<a class="post-action action-like">
<i class="fa-solid fa-star"></i>
<span class="like-count">${post.loves}</span>
</a>`;
            }
        } else {
            postActionsInsert = `<a class="post-action action-like">
<i class="fa-solid fa-star"></i>
<span class="like-count">${post.loves}</span>
</a>`;
        }
        postActions.innerHTML = `<a class="post-action action-reply" href="#">
<i class="fa-solid fa-reply"></i>
<span class="comment-count">${post.comments}</span>
</a>
<a class="post-action action-repost" href="#">
<i class="fa-solid fa-repeat"></i>
<span class="repost-count">${post.reposts}</span>
</a>
${postActionsInsert}
                `;

        let likebtn = postActions.querySelector(".action-like");
        likebtn.addEventListener("click", () => {
            likePost(post._id);
        });
        postElement.appendChild(postActions);
        postActions.querySelectorAll(".post-action").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        });
        postElement.addEventListener("click", () => {
            window.location.href = `/posts/${post._id}`;
        });

        return postElement;
    }

    if (homePosts) {
        loadPosts(homePosts);
    } else {
        document.getElementById(
            "posts"
        ).innerHTML = `<p class="no-posts">There are no posts to display.</p>`;
    }

    async function loadPosts(postsToLoad) {
        Promise.all(postsToLoad.posts.map((post) => loadPost(post)))
            .then((elems) => {
                const postContainer = document.getElementById("posts");
                for (const e of elems) {
                    postContainer.appendChild(e);
                }

                createLoadButton();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    async function loadMorePosts() {
        postsPage++;
        let nextPage = await await fetch(
            `https://wasteof.money/users/${me.user.name}/following/posts?page=${postsPage}`,
            {
                headers: {
                    Authorization: localStorage.getItem("Token"),
                },
            }
        );
        loadPosts(nextPage);
    }

    function createLoadButton() {
        if (document.getElementById("home-see-more")) {
            document.removeChild(document.getElementById("home-see-more"));
        }
        let loadMoreBtn = document.createElement("buttton");
        loadMoreBtn.id = "home-see-more";
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.addEventListener("click", () => {
            loadMorePosts();
        });
        document.getElementById("posts").appendChild(loadMoreBtn);
    }
});
