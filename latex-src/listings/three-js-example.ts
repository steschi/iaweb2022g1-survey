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