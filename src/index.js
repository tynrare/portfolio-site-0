import App from "./scripts/app.js";

function main() {
  window.app = App.instance;
  App.instance.init().run();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
