document.addEventListener("DOMContentLoaded", () => {
    let images = [
        "/static/bgs/1.jpg",
        "/static/bgs/2.jpg",
        "/static/bgs/3.jpg",
        "/static/bgs/4.jpg",
        "/static/bgs/5.jpg",
    ];
    let nextimage = 1;
    let showing = 1;
    const bg1 = document.getElementById("bg-fade-first");
    const bg2 = document.getElementById("bg-fade-second");
    bg1.style.backgroundImage = `url("${images[0]}")`;
    bg1.style.opacity = 1;
    bg2.style.opacity = 0;

    function doSlideshow() {
        const nextBg = showing === 1 ? bg2 : bg1;
        const prevBg = showing === 1 ? bg1 : bg2;
        nextBg.style.backgroundImage = `url("${images[nextimage]}")`;
        nextBg.style.opacity = 1;
        prevBg.style.opacity = 0;
        showing = showing === 1 ? 2 : 1;
        nextimage = (nextimage + 1) % images.length;

        setTimeout(doSlideshow, 6000);
    }

    setTimeout(doSlideshow, 6000);
});
