document.querySelectorAll("#filters").forEach((slider) => {
  slider.addEventListener("wheel", (e) => {
    e.preventDefault(); // stop vertical scroll
    slider.scrollLeft += e.deltaY * 2; // wheel → horizontal
    ease = 0.08;
  });
});
