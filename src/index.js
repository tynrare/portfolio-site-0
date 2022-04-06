import frag from "./glsl/shader.frag";
import vert from "./glsl/shader.vert";
import WebglWrapper from "./WebglWrapper.js";

/**
 * Entry point
 */
function main() {
  const webgl = new WebglWrapper();
  const canvas = document.querySelector('canvas#main');
  webgl.init(canvas, vert, frag);
  webgl.run();
}

main();