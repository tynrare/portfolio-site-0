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
      const clips = [
        "slots-clip-0",
        "slots-clip-1",
        "slots-clip-2",
        "slots-clip-3",
        "slots-clip-4",
        "slots-clip-5",
        "bacto-clip-0",
        "bacto-clip-1",
        "bacto-clip-2",
        "bacto-clip-3",
        "demo-clip-0",
        "demo-clip-1",
        "demo-clip-2",
        "demo-clip-3",
        "demo-clip-4",
        "demo-clip-5",
        "demo-clip-6",
        "demo-clip-7",
        "demo-clip-8",
        "demo-clip-9",
        "demo-clip-10",
        "demo-clip-11",
        "demo-clip-12",
      ];
      clips.forEach((name) => {
        const el = document.createElement("div");
        el.classList.add("clip_root");
        el.innerHTML = `
				<video preload="metadata" muted>
					<source src='res/clips/${name}.m4v'>
				</video>
				`;
        elements.push(el);

        const video = el.querySelector("video");
        el.addEventListener("mouseover", () => {
					this.clipsSlides.pause();
          video.play();
        });
        el.addEventListener("mouseout", () => {
					this.clipsSlides.play();
          video.pause();
        });
      });

      this.clipsSlides.init(
        elements,
        document.querySelectorAll("#tyn_gallery_clips .clips_row")
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
