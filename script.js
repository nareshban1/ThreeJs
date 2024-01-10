import {
  BoxGeometry,
  Camera,
  Clock,
  Color,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
let cursorPosition = {
  x: 0,
  y: 0,
};
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const loader = new GLTFLoader();

const gui = new dat.GUI();
gui.hide();

window.addEventListener("mousemove", (event) => {
  cursorPosition.x = event.clientX / window.innerWidth - 0.5;
  cursorPosition.y = -(event.clientY / window.innerHeight - 0.5);
});
//Scene
const scene = new Scene();

//Camera
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  20,
  100
);

//Mesh
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
  color: "red",
});

const mesh = new Mesh(geometry, material);
// scene.add(mesh);
// gui.add(mesh.position, "y");
// gui.add(mesh.position, "x");
// gui.add(mesh.position, "z");
camera.position.z = 50;
camera.position.y = 20;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
console.log(renderer.domElement);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// animating
const clock = new Clock();
// gsap.to(mesh.position, {
//   x: 2,
//   delay: 2,
//   duration: 2,
// });
//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
let catHouse;

const loadModel = () => {
  return loader.loadAsync("src/cat_house/scene.gltf", () => {
    console.log("LOADING");
  });
};
scene.background = new Color(0xbfe3ed);
const data = await loadModel();
if (data) scene.add(data.scene);
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  data.scene.rotation.y += 0.01;
  //   camera.position.x = Math.sin(cursorPosition.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursorPosition.x * Math.PI * 2) * 3;
  //   camera.position.y = cursorPosition.y * 5;
  //   camera.lookAt(mesh.position);
  controls.update();

  renderer.render(scene, camera);
};
if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
