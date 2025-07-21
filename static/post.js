document.addEventListener("DOMContentLoaded", async () => {
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
});
