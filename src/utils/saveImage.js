export default function saveImage(scene) {
  scene.game.renderer.snapshot((image) => {
    const link = document.createElement("a");
    link.setAttribute("download", "img.png");
    link.setAttribute("href", image.src);
    link.click();
  });
}
