import * as BABYLON from "babylonjs";

const showDebugLayer = false;

if (!navigator.gpu) {
  alert("WebGPU is not supported or is not enabled, see https://webgpu.io");
  throw new Error("no WebGPU found");
}

function createColorMaterial(name: string, color: BABYLON.Color3): BABYLON.Material {
  const material = new BABYLON.StandardMaterial(name);
  material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  material.emissiveColor = color;

  return material;
}

/** Create the scene with all shapes, camera, lights and materials */
function createScene() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(150, 100, -50));
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl();

  scene.addCamera(camera);

  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  const groundMaterial = createColorMaterial("ground", BABYLON.Color3.Gray());

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 });
  ground.material = groundMaterial;
  scene.addMesh(ground);

  const redMaterial = createColorMaterial("red", BABYLON.Color3.Blue());

  const redSphere = BABYLON.MeshBuilder.CreateBox("red", { width: 10, height: 10, depth: 10 });
  redSphere.material = redMaterial;
  redSphere.position.y = 10;
  redSphere.position.x = 0;
  redSphere.position.z = 0;

  scene.addMesh(redSphere);

  if (showDebugLayer) {
    scene.debugLayer.show({
      embedMode: true,
      overlay: true,
    });
  }

  return scene;
}
/** Add interactivity to the scene */
function addInteractivity(scene: BABYLON.Scene) {
  const { activeCamera } = scene;
  let startingPoint: BABYLON.Vector3 | null = null;
  let currentMesh: BABYLON.AbstractMesh | null = null;

  const getGroundPositionOfMouse = () => {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh.name === "ground");
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }

    return null;
  };

  const mouseDown = (mesh: BABYLON.AbstractMesh) => {
    currentMesh = mesh;
    startingPoint = getGroundPositionOfMouse();
    if (!startingPoint) return;
    activeCamera?.detachControl();
  };

  const mouseUp = () => {
    if (!startingPoint) return;

    activeCamera?.attachControl();
    startingPoint = null;
  };

  const mouseMove = () => {
    if (!startingPoint) return;

    const current = getGroundPositionOfMouse();
    if (!current) {
      return;
    }

    const diff = current.subtract(startingPoint);
    currentMesh?.position.addInPlace(diff);

    startingPoint = current;
  };

  scene.onPointerObservable.add((pointerInfo: BABYLON.PointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh?.name !== "ground") {
          mouseDown(pointerInfo.pickInfo!.pickedMesh!);
        }
        break;
      case BABYLON.PointerEventTypes.POINTERUP:
        mouseUp();
        break;
      case BABYLON.PointerEventTypes.POINTERMOVE:
        mouseMove();
        break;
    }
  });
}

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

const engine = new BABYLON.WebGPUEngine(canvas, { stencil: true });
await engine.initAsync();

const scene = createScene();

addInteractivity(scene);

engine.runRenderLoop(function () {
  let fpsElement = document.getElementById("fps");
  if (fpsElement) {
    fpsElement.innerHTML = `${engine.getFps().toFixed(0)}fps`;
  }
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
