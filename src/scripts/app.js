import RollingSlidesEffectManager from "./RollingSlidesEffectManager.js";
import events from "../lib/events.js";
import Ticker from "../lib/Ticker.js";

export default class App {
  constructor() {
    this.events = events;
    this.ticker = new Ticker();
  }
  init() {
    this.initSlides();
    this.ticker.init().run();

    return this;
  }

  initSlides() {
    {
      this.clipsSlides = new RollingSlidesEffectManager();
      const elements = [];
      for (let i = 1; i <= 48; i++) {
        elements.push(makeClipElement(i));
      }

      this.clipsSlides.init(
        elements,
        document.querySelectorAll("#tyn_gallery_clips .content_row")
      );
    }

    {
      this.screenshotSlides = new RollingSlidesEffectManager();
      const elements = [];
      for (let i = 1; i <= 11; i++) {
        elements.push(makePicElement('screenshots', i));
      }

      this.screenshotSlides.init(
        elements,
        document.querySelectorAll("#tyn_gallery_screenshots .content_row")
      );
    }

    {
      this.artworkSlides = new RollingSlidesEffectManager();
      const elements = [];
      for (let i = 1; i <= 16; i++) {
        elements.push(makePicElement('artworks', i));
      }

      this.artworkSlides.init(
        elements,
        document.querySelectorAll("#tyn_gallery_artworks .content_row")
      );
    }
  }

  static get instance() {
    if (!App._instance) {
      App._instance = new App();
    }

    return App._instance;
  }

  run() {}
}

function makeClipElement(index) {
  const name = ("000" + index).slice(-4);
  const el = document.createElement("div");
  el.classList.add("content_root");
  el.innerHTML = `
				<video preload="metadata" muted>
					<source src='res/clips/${name}.m4v'>
				</video>
				`;

  const video = el.querySelector("video");
  el.addEventListener("mouseover", () => {
    video.play();
  });
  el.addEventListener("mouseout", () => {
    video.pause();
  });
  el.addEventListener("touchstart", () => {
    video.play();
  });
  el.addEventListener("touchend", () => {
    video.pause();
  });

  return el;
}

function makePicElement(path, index) {
  const name = ("000" + index).slice(-4);
  const el = document.createElement("div");
  el.classList.add("content_root");
  el.innerHTML = `
					<img src='res/${path}/${name}.jpg'></img>
				`;

  return el;
}
