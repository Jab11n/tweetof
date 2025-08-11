/* im gonna use this as the editor as soon as i can figure out how to make it work... haha

import { Editor } from "https://esm.sh/@tiptap/core";
import StarterKit from "https://esm.sh/@tiptap/starter-kit";

const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
        document.getElementById("output").value = editor.getHTML();
    },
});
*/

document.addEventListener("DOMContentLoaded", () => {
    let submitBtn = document.getElementById("tweet-box-send");
    let tweetBox = document.getElementById("tweet-box-compose");
    submitBtn.addEventListener("click", async () => {
        let res = await fetch("https://api.wasteof.money/posts", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("Token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post: `<p>${tweetBox.value}</p>`,
            }),
        });
        if (res.ok) {
            let data = await res.json();
            window.location.pathname = `/posts/${data.id}`;
        }
    });
});
