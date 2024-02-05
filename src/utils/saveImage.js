import "../lib/gif.js";

export function saveImage(scene) {
  scene.game.renderer.snapshot((image) => {
    const link = document.createElement("a");
    link.setAttribute("download", "img.png");
    link.setAttribute("href", image.src);
    link.click();
  });
}

export function saveGif(scene, length = 1000) {
  const frameRate = 60;

  const gifLibrary = new GIF({
    worskers: 2,
    quality: 10,
    workerScript: "/src/lib/gif.worker.js",
  });

  const makeFrame = () => {
    scene.game.renderer.snapshot((image) => {
      gifLibrary.addFrame(image, { delay: length / frameRate });
    });
  };

  let frameInterval = setInterval(makeFrame, length / frameRate);
  setTimeout(() => {
    clearInterval(frameInterval);
    gifLibrary.render();
  }, length);

  gifLibrary.on("finished", (blob) => {
    window.open(URL.createObjectURL(blob));
  });
}
