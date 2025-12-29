document.addEventListener("DOMContentLoaded", () => {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const loader = document.getElementById("loader");
  const mainInterface = document.getElementById("main-interface");
  const body = document.body;

  let width = 0;
  // Speed of the loading bar (adjust if needed)
  const interval = setInterval(() => {
    // Random increment for "hacker" feel
    width += Math.floor(Math.random() * 5) + 1;

    if (width >= 100) {
      width = 100;
      clearInterval(interval);

      // Finish Load
      progressFill.style.width = "100%";
      progressText.innerText = "100% COMPLETE";

      setTimeout(() => {
        // Hide Loader
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";

        // Show Content
        mainInterface.classList.remove("hidden");
        body.style.overflow = "auto";
      }, 800);
    } else {
      progressFill.style.width = width + "%";
      progressText.innerText = width + "% COMPLETE";
    }
  }, 50); // Speed in ms
});
