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