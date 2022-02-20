import WebglWrapper from "./WebglWrapper";
import frag from './dust-0/shader.frag';
import vert from './dust-0/shader.vert';

class App {
  constructor() {
    active = true;
  }

  run() {
    App.instance = new App();
    this.loop(0);
  }

  init() {
    this.webgl = new WebglWrapper();
    this.webgl.init(frag, vert);

    window.addEventListener("resize", () => {
      this.webgl.resize();
    });
  }

  loop(timestamp) {
    this.webgl.update(timestamp);

    if (this.active) {
      requestAnimationFrame(() => this.loop());
    }
  }
}

/**
 * Entry point
 */
function main() {
  App.run();
}

main();
