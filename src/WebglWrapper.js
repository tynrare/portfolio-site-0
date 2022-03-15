import GLea from "glea";

export default class WebglWrapper {
  init(fragment, vertex) {
    const glea = new GLea({
      shaders: [GLea.fragmentShader(fragment), GLea.vertexShader(vertex)],
      buffers: {
        // create a position attribute bound
        // to a buffer with 4 2D coordinates
        // this is what GLea provides by default if you omit buffers in the constructor
        position: GLea.buffer(2, [1, 1, -1, 1, 1, -1, -1, -1]),
      },
    }).create();

    this.glea = glea;

    return this;
  }

  update(time) {
    const { gl, width, height } = this.glea;
    this.glea.clear();
    this.glea.uniV("resolution", [width, height]);
    this.glea.uni("time", time * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  setup() {
    const { gl } = this.glea;
    window.addEventListener("resize", () => {
		this.glea.resize();
    });
    loop(0);
  }
}
