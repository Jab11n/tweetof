document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("Token")) {
        document.getElementById("reply-box").style.display = "none";
    }

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

    document.getElementById("post-retweets").children[1].innerText =
        postinfo.reposts;
    document.getElementById("post-favorites").children[1].innerText =
        postinfo.loves;
    document.getElementById("post-comments").children[1].innerText =
        postinfo.comments;

    document.getElementById("post-time").innerText = new Date(
        postinfo.time
    ).toLocaleString();

    document.getElementById(
        "reply-box-text"
    ).placeholder = `Reply to @${postinfo.poster.name}...`;

    const me = await (
        await fetch("https://api.wasteof.money/session", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Token"),
            },
        })
    ).json();

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
                let replyObj = replies.comments[i];
                let replyElement = document.createElement("div");
                replyElement.className = "comment";
                replyElement.style.paddingLeft = `24px`;
                replyElement.style.marginLeft = `24px`;
                replyElement.style.borderRight = "none";

                let rInner = document.createElement("div");
                rInner.className = "c-inner";
                replyElement.appendChild(rInner);

                let replyPfp = document.createElement("img");
                replyPfp.src = `https://api.wasteof.money/users/${replyObj.poster.name}/picture`;
                rInner.appendChild(replyPfp);

                let rThings = document.createElement("div");
                rThings.className = "comment-things";
                rInner.appendChild(rThings);

                let rAuthor = document.createElement("div");
                rAuthor.className = "c-author";
                rThings.appendChild(rAuthor);

                let rPosterName = document.createElement("a");
                rPosterName.href = `/users/${replyObj.poster.name}`;
                rPosterName.innerText = `@${replyObj.poster.name}`;
                rAuthor.appendChild(rPosterName);

                let rPostTime = document.createElement("p");
                rPostTime.innerText = new Date(replyObj.time).toLocaleString();
                rAuthor.appendChild(rPostTime);

                let rContent = document.createElement("div");
                rContent.className = "comment-text";
                rContent.innerHTML = `<p>${replyObj.content}</p>`;
                rThings.appendChild(rContent);

                let rActions = document.createElement("div");
                rActions.className = "post-actions";
                rThings.appendChild(rActions);

                let rReply = document.createElement("div");
                rReply.className = "post-action action-reply";
                rReply.innerHTML = `<i class="fa-solid fa-reply"></i>`;
                let rMore = document.createElement("div");
                rMore.className = "post-action action-more";
                rMore.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
                rActions.appendChild(rReply);
                rActions.appendChild(rMore);

                commentElement.appendChild(replyElement);
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
