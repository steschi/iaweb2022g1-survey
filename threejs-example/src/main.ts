import * as THREE from "three";
//@ts-ignore
import WebGPU from "three/addons/capabilities/WebGPU";
//@ts-ignore
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer";

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());

  throw new Error("No WebGPU support");
}

let scene, camera, renderer;
let cube;
var rotate = false;
var move = false;
var mouse_pos;
var mouse_pos_raw;
var selectedObject;
var raycaster;
var count = 0;

//init function and call to init because else it will always initialize those things
init();
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new WebGPURenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  mouse_pos = new THREE.Vector3();
  mouse_pos_raw = new THREE.Vector3();
  raycaster = new THREE.Raycaster();

  camera.position.z = 10;
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseClick);
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  //console.log(cube.position);
  //console.log(mouse_pos);
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
  //rotate = rotate == false ? true : false;
  raycaster.setFromCamera(mouse_pos_raw, camera);
  var intersects = raycaster.intersectObjects(scene.children, true); //array
  if (intersects.length > 0) {
    selectedObject = intersects[0];
    //console.log(count++ + ": " + selectedObject);
    move = move == false ? true : false;
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
  /*var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3(); // create once and reuse

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  var distance = -camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  cube.position.x = pos.x; //(event.clientX / window.innerWidth) * 2 - 1;
  cube.position.y = pos.y; //-(event.clientY / window.innerHeight) * 2 + 1;*/
}

function onWindowResize() {
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//with set animation loop in init alsow working but fever fps
animate();
