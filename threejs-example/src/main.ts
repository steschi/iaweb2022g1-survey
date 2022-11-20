import * as THREE from "three";
//@ts-ignore
import WebGPU from "three/addons/capabilities/WebGPU";
//@ts-ignore
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer";

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());

  throw new Error("No WebGPU support");
}

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: WebGPURenderer;
let cube: THREE.Mesh;
let rotate = false;
let move = false;
let mouse_pos: THREE.Vector3;
let mouse_pos_raw: THREE.Vector3;
let selectedObject;
let raycaster: THREE.Raycaster;
let hover_over_col = 0xffffff;
let hover_original_col: THREE.Color[] = [];
let lines: THREE.Line[] = [];

//init function and call to init because else it will always initialize those things
init();
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(150, 100, -50);
  camera.position.set(0, 0, -50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new WebGPURenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let move_x_axis = 25;

  //Create Lines
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const points = [];
  points.push(new THREE.Vector3(-50 + move_x_axis, 10, 0));
  points.push(new THREE.Vector3(-40 + move_x_axis, -10, 0));
  points.push(new THREE.Vector3(-10 + move_x_axis, -10, 0));
  points.push(new THREE.Vector3(-10 + move_x_axis, -50, 0));

  const material1 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const points1 = [];
  points1.push(new THREE.Vector3(-20 + move_x_axis, 10, 0));
  points1.push(new THREE.Vector3(-50 + move_x_axis, -20));
  points1.push(new THREE.Vector3(-20 + move_x_axis, -20));
  points1.push(new THREE.Vector3(-20 + move_x_axis, 10, 0));

  const material2 = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const points2 = [];
  points2.push(new THREE.Vector3(-40 + move_x_axis, 10, 0));
  points2.push(new THREE.Vector3(-40 + move_x_axis, -30));
  points2.push(new THREE.Vector3(-5 + move_x_axis, -30));
  points2.push(new THREE.Vector3(-5 + move_x_axis, 10));
  points2.push(new THREE.Vector3(-40 + move_x_axis, 10, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  const line = new THREE.Line(geometry, material);
  const line1 = new THREE.Line(geometry1, material1);
  const line2 = new THREE.Line(geometry2, material2);

  //Save lines in array for color setting
  lines.push(line);
  lines.push(line1);
  lines.push(line2);
  hover_original_col.push(line.material.color);
  hover_original_col.push(line1.material.color);
  hover_original_col.push(line2.material.color);

  //Add lines to scene
  scene.add(line);
  scene.add(line1);
  scene.add(line2);

  //Set to zero vectors
  mouse_pos = new THREE.Vector3();
  mouse_pos_raw = new THREE.Vector3();
  raycaster = new THREE.Raycaster();

  //Add EventListener
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseClick);
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  if (move) {
    moveObject();
  }

  if (rotate) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

function onMouseClick() {
  raycaster.setFromCamera(mouse_pos_raw, camera);
  let intersects = raycaster.intersectObjects(scene.children, true); //array
  if (intersects.length > 0) {
    selectedObject = intersects[0];
    move = move == false ? true : false;
  }
}

function onObjectHover() {
  raycaster.setFromCamera(mouse_pos_raw, camera);
  let intersects = raycaster.intersectObjects(scene.children, true); //array
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.color.set(hover_over_col);
    }
  } else {
    for (let i = 0; i < lines.length; i++) {
      lines[i].material.color = new THREE.Color(hover_original_col[i]);
    }
  }
}

function moveObject() {
  cube.position.x = mouse_pos.x;
  cube.position.y = mouse_pos.y;
}

function onMouseMove(event) {
  var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3();
  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );
  //for the object hit function
  mouse_pos_raw.x = vec.x;
  mouse_pos_raw.y = vec.y;
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  var distance = -camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  mouse_pos.x = pos.x;
  mouse_pos.y = pos.y;
  onObjectHover();
}

function onWindowResize() {
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//with set animation loop in init alsow working but fever fps
animate();
