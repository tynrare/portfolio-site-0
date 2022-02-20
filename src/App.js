import WebglWrapper from "./WebglWrapper";
import frag from './dust-0/shader.frag';
import vert from './dust-0/shader.vert';

/**
 * Unimplemented Webgl support
 */
export default class App {
  constructor() {
    this.active = true;
  }

  /**
   * @example
   * 
   * // To run app
   * App.run()
   */
  static run() {
    App.instance = new App().init();
    this.loop(0);
  }

  /**
   * @returns {App} this
   */
  init() {
    this.webgl = new WebglWrapper();
    this.webgl.init(frag, vert);

    window.addEventListener("resize", () => {
      this.webgl.resize();
    });

	return this;
  }

  /**
   * @param {number} timestamp current time
   */
  loop(timestamp) {
    this.webgl.update(timestamp);

    if (this.active) {
      requestAnimationFrame(() => this.loop());
    }
  }
}
