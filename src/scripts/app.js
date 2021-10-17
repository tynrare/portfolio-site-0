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
        document.querySelectorAll("#tyn_gallery_clips .clips_row")
      );
    }

    {
      this.screenshotSlides = new RollingSlidesEffectManager();
      const elements = [];
      for (let i = 1; i <= 11; i++) {
        elements.push(makePicElement(i));
      }

      this.screenshotSlides.init(
        elements,
        document.querySelectorAll("#tyn_gallery_screenshots .screenshots_row")
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
  el.classList.add("clip_root");
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

  return el;
}

function makePicElement(index) {
  const name = ("000" + index).slice(-4);
  const el = document.createElement("div");
  el.classList.add("pic_root");
  el.innerHTML = `
					<img src='res/clips/${name}.m4v'></img>
				`;

  return el;
}
