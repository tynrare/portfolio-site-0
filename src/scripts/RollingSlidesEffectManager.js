export default class RollingSlidesEffectManager {
  constructor() {
    this.slides = [];
    this.unusedSlides = [];
    this.containers = [];

    this.animSpeed = 2;
		this.active = false;
  }

  pause() {
    this.active = false;
  }

  play() {
    this.active = true;
  }

  init(slides, containers) {
    containers.forEach((e) => {
      this.registerContainer(e);
    });
    slides.forEach((e) => {
      this.registerSlide(e);
    });
    this.play();

    window.app.ticker.events.on("frame_tick", () => {
      if (!this.active) {
        return;
      }

      for (let i = 0; i < this.containers.length; i++) {
        const container = this.containers[i];
        if (!isInViewport(container)) {
          continue;
        }
        container._rollinEffectPos =
          (container._rollinEffectPos || 0) + this.animSpeed + i;
        if (container.classList.contains("move_left")) {
          container.style.left = -container._rollinEffectPos + "px";
          const posright = container.offsetLeft + container.clientWidth;
          const parentposright =
            container.parentNode.offsetLeft + container.parentNode.clientWidth;
          if (posright < parentposright) {
            const newel = this.unusedSlides.shift();
            if (newel) {
              container.appendChild(newel);
            }
          }
          if (
            Math.abs(container._rollinEffectPos) >
            container.firstChild.clientWidth
          ) {
            container._rollinEffectPos -= container.firstChild.clientWidth;
            this.unusedSlides.push(container.firstChild);
            container.removeChild(container.firstChild);
            container.style.left = container._rollinEffectPos + "px";
          }
        } else if (container.classList.contains("move_right")) {
          //..
        }
      }
    });
  }

  registerSlide(el) {
    el.addEventListener("mouseover", () => {
      this.pause();
    });
    el.addEventListener("mouseout", () => {
      this.play();
    });

    this.slides.push(el);
    for (const i in this.containers) {
      const container = this.containers[i];
      if (container.clientWidth < container.parentNode.clientWidth) {
        container.appendChild(el);
        return;
      }
    }

    this.unusedSlides.push(el);
  }

  registerContainer(el) {
    this.containers.push(el);
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    //rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    // && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
