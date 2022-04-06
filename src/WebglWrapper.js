import { lerp } from "./math";

export default class WebglWrapper {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.buffer = null;
    this.currentProgram = null;
    this.vertex_position = null;
    this.timeLocation = null;
    this.resolutionLocation = null;
    this.pointerLocation = null;
    this.parameters = {
      start_time: new Date().getTime(),
      time: 0,
      screenWidth: 0,
      screenHeight: 0,
      pointerX: 0,
      pointerY: 0,
      pointerZ: 0
    };
  }

  init(canvas, vertex, fragment) {
    this.canvas = canvas;

    // Initialise WebGL

    try {
      this.gl = canvas.getContext("experimental-webgl");
    } catch (error) {}

    if (!this.gl) {
      throw "cannot create webgl context";
    }

    // Create Vertex buffer (2 triangles)

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
      ]),
      this.gl.STATIC_DRAW
    );

    // Create Program

    this.currentProgram = this.createProgram(vertex, fragment);

    this.timeLocation = this.gl.getUniformLocation(this.currentProgram, "time");
    this.resolutionLocation = this.gl.getUniformLocation(this.currentProgram, "resolution");
    this.pointerLocation = this.gl.getUniformLocation(this.currentProgram, "pointer");
  }

  run() {
    this._loop();
    document.addEventListener('mousemove', (e) => {
      const x = this.parameters.pointerX;
      const y = this.parameters.pointerY;
      this.parameters.pointerX = lerp(x, e.clientX, 0.9);
      this.parameters.pointerY = lerp(y, window.innerHeight - e.clientY, 0.9);
    })
    document.addEventListener('mousedown', (e) => {
      this.parameters.pointerZ = 1;
    })
    document.addEventListener('mouseup', (e) => {
      this.parameters.pointerZ = 0;
    })
  }

  _loop() {
    this.resizeCanvas();
    this.render();
    requestAnimationFrame(() => this._loop());
  }

  createProgram(vertex, fragment) {
    var program = this.gl.createProgram();

    var vs = this.createShader(vertex, this.gl.VERTEX_SHADER);
    var fs = this.createShader(
      "#ifdef GL_ES\nprecision highp float;\n#endif\n\n" + fragment,
      this.gl.FRAGMENT_SHADER
    );

    if (vs == null || fs == null) return null;

    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);

    this.gl.deleteShader(vs);
    this.gl.deleteShader(fs);

    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      alert(
        "ERROR:\n" +
          "VALIDATE_STATUS: " +
          this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) +
          "\n" +
          "ERROR: " +
          this.gl.getError() +
          "\n\n" +
          "- Vertex Shader -\n" +
          vertex +
          "\n\n" +
          "- Fragment Shader -\n" +
          fragment
      );

      return null;
    }

    return program;
  }

  createShader(src, type) {
    var shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert(
        (type == this.gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") +
          " SHADER:\n" +
          this.gl.getShaderInfoLog(shader)
      );
      return null;
    }

    return shader;
  }

  resizeCanvas(event) {
    if (
      this.canvas.width != this.canvas.clientWidth ||
      this.canvas.height != this.canvas.clientHeight
    ) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      this.parameters.screenWidth = this.canvas.width;
      this.parameters.screenHeight = this.canvas.height;

      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  render() {
    if (!this.currentProgram) return;

    this.parameters.time = new Date().getTime() - this.parameters.start_time;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Load program into GPU

    this.gl.useProgram(this.currentProgram);

    // Set values to program variables

    this.gl.uniform1f(this.timeLocation, this.parameters.time / 1000);
    this.gl.uniform2f(
      this.resolutionLocation,
      this.parameters.screenWidth,
      this.parameters.screenHeight
    );
    this.gl.uniform3f(
      this.pointerLocation,
      this.parameters.pointerX,
      this.parameters.pointerY,
      this.parameters.pointerZ
    );

    // Render geometry

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.vertex_position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vertex_position);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.gl.disableVertexAttribArray(this.vertex_position);
  }
}
