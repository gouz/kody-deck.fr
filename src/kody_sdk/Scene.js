import {
  Engine as BabylonEngine,
  Scene as BabylonScene,
  Color3 as BabylonColor3,
  ArcRotateCamera as BabylonArcRotateCamera,
  Vector3 as BabylonVector3,
  HemisphericLight as BabylonHemisphericLight,
  AxesViewer as BabylonAxesViewer,
} from "babylonjs";

export default class Scene {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    const engine = new BabylonEngine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    const scene = new BabylonScene(engine);
    scene.clearColor = BabylonColor3.FromHexString("#9fc9dc");

    const camera = new BabylonArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new BabylonVector3(0, 0, -250),
      scene
    );
    camera.setTarget(BabylonVector3.Zero());
    camera.attachControl(canvas, false);
    new BabylonHemisphericLight("light", new BabylonVector3(2, 3, 3), scene);
    new BabylonHemisphericLight("light", new BabylonVector3(2, 3, -3), scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
    new BabylonAxesViewer(scene, 15);

    return scene;
  }
}
