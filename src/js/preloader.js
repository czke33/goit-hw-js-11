const preloader = document.querySelector('.preloader');

const fadeEffect = () => {
  setInterval(() => {
    if (!preloader.style.opacity) {
      preloader.style.opacity = 1;
    }
    if (preloader.style.opacity > 0) {
      preloader.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      preloader.remove();
    }
  }, 200);
};

export { fadeEffect };
