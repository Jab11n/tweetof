document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("Token")) {
        document.getElementById("reply-box").style.display = "none";
    }

    let me = await (
        await fetch("https://api.wasteof.money/session", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Token"),
            },
        })
    ).json();

    let post_id = window.location.pathname.split("/posts/")[1];
    async function getPostData(post_id) {
        const response = await fetch(
            `https://api.wasteof.money/posts/${post_id}`
        );
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

    async function likePost() {
        let res = await (
            await fetch(`https://api.wasteof.money/posts/${post_id}/loves`, {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("Token"),
                },
            })
        ).json();
        if (response.ok == true) {
            document.getElementById(
                "post-top"
            ).children[2].children[2].className =
                "post-action action-like action-like-true";
        } else {
            document.getElementById(
                "post-top"
            ).children[2].children[2].className = "post-action action-like";
        }
    }

    const postinfo = await getPostData(post_id);

    document.getElementById(
        "author"
    ).children[0].src = `https://api.wasteof.money/users/${postinfo.poster.name}/picture`;
    document.getElementById(
        "author"
    ).children[1].href = `/users/${postinfo.poster.name}`;
    document.getElementById(
        "author"
    ).children[1].innerText = `@${postinfo.poster.name}`;

    document.getElementById("post-content").innerHTML = postinfo.content;

    let loved = await (
        await fetch(
            `https://api.wasteof.money/posts/${post_id}/loves/${me.user.name}`,
            {
                headers: {
                    Authorization: localStorage.getItem("Token"),
                },
            }
        )
    ).json();

    document.getElementById("post-retweets").children[1].innerText =
        postinfo.reposts;
    document.getElementById("post-favorites").children[1].innerText =
        postinfo.loves;
    if (loved) {
        document.getElementById("post-top").children[2].children[2].className =
            "post-action action-like action-like-true";
    }
    document.getElementById("post-favorites").addEventListener("click", () => {
        likePost();
    });
    document.getElementById("post-comments").children[1].innerText =
        postinfo.comments;

    document.getElementById("post-time").innerText = new Date(
        postinfo.time
    ).toLocaleString();

    document.getElementById(
        "reply-box-text"
    ).placeholder = `Reply to @${postinfo.poster.name}...`;

    document.getElementById(
        "reply-box-pfp"
    ).src = `https://api.wasteof.money/users/${me.user.name}/picture`;

    async function fetchComments(post_id) {
        const response = await fetch(`
            https://api.wasteof.money/posts/${post_id}/comments`);
        return await response.json();
    }

    const postComments = await fetchComments(post_id);

    async function loadComment(comment) {
        if (!comment) {
            return;
        }
        let commentElement = document.createElement("div");
        commentElement.className = "comment";
        let cInner = document.createElement("div");
        cInner.className = "c-inner";
        commentElement.appendChild(cInner);
        let cAuthorPicture = document.createElement("img");
        cAuthorPicture.src = `https://api.wasteof.money/users/${comment.poster.name}/picture`;
        cInner.appendChild(cAuthorPicture);
        let cThings = document.createElement("div");
        cThings.className = "comment-things";
        cInner.appendChild(cThings);
        let cAuthor = document.createElement("div");
        cAuthor.className = "c-author";
        cThings.appendChild(cAuthor);
        let cPosterName = document.createElement("a");
        cPosterName.href = `/users/${comment.poster.name}`;
        cPosterName.innerText = `@${comment.poster.name}`;
        cAuthor.appendChild(cPosterName);
        let cPostTime = document.createElement("p");
        cPostTime.innerText = new Date(comment.time).toLocaleString();
        cAuthor.appendChild(cPostTime);
        let cContent = document.createElement("div");
        cContent.className = "comment-text";
        cThings.appendChild(cContent);
        cContent.innerHTML = `<p>${comment.content}</p>`;
        let cActions = document.createElement("div");
        cActions.className = "post-actions";
        cThings.appendChild(cActions);
        let cReply = document.createElement("div");
        cReply.className = "post-action action-reply";
        cReply.innerHTML = `<i class="fa-solid fa-reply"></i>`;
        let cMore = document.createElement("div");
        cMore.className = "post-action action-more";
        cMore.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
        cActions.appendChild(cReply);
        cActions.appendChild(cMore);

        if (comment.hasReplies) {
            let replies = await (
                await fetch(
                    `https://api.wasteof.money/comments/${comment._id}/replies`
                )
            ).json();
            for (let i = 0; i < replies.comments.length; i++) {
                const replyElem = await loadComment(replies.comments[i]);
                replyElem.style.paddingRight = "0px";
                replyElem.style.marginLeft = "16px";
                replyElem.style.paddingLeft = "16px";
                replyElem.style.borderRight = "none";
                commentElement.appendChild(replyElem);
            }
        }

        return commentElement;
    }

    if (postinfo.comments > 0) {
        Promise.all(
            postComments.comments.map((comment) => loadComment(comment))
        )
            .then((elems) => {
                const postContainer = document.getElementById("comments");
                for (const e of elems) {
                    postContainer.appendChild(e);
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }
});
