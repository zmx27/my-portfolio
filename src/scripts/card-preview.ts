const supportsHoverPreview =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsHoverPreview) {
  const cards = document.querySelectorAll<HTMLElement>("[data-video-preview]");

  cards.forEach((card) => {
    const img = card.querySelector<HTMLImageElement>("img");
    const video = card.querySelector<HTMLVideoElement>("video");
    if (!img || !video) return;

    let hoverTimer: number | undefined;

    card.addEventListener("mouseenter", () => {
      hoverTimer = window.setTimeout(() => {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }
        video.play().catch(() => {});
        video.classList.remove("hidden");
        img.classList.add("hidden");
      }, 250);
    });

    card.addEventListener("mouseleave", () => {
      window.clearTimeout(hoverTimer);
      video.pause();
      video.currentTime = 0;
      video.classList.add("hidden");
      img.classList.remove("hidden");
    });
  });
}
