import './main.css';
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
document.getElementById('renderer').appendChild(renderer.domElement);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, false);
const scene = new Scene();
camera.position.set(0, 0, 6);
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

const connectors = [
  { position: new Vector3(0, 0, 1) },
  { position: new Vector3(0, 0, -1), rotation: Math.PI * -1 },
  { position: new Vector3(1, 0, 0), rotation: Math.PI * 0.5 },
  { position: new Vector3(-1, 0, 0), rotation: Math.PI * -0.5 },
];

const materials = [
  new MeshBasicMaterial({ color: 0x999999 }),
  new MeshBasicMaterial({ color: 0x996699 }),
];

const csg = new Evaluator();
const base = new Brush(new BoxGeometry(2, 4, 2), materials[0]);
const connector = new Brush(new BoxGeometry(1.5, 1.5, 0.5), materials[1]);

let brush = base;
connectors.forEach(({ position, rotation }) => {
  connector.position.copy(position);
  connector.rotation.y = rotation || 0;
  connector.updateMatrixWorld();
  brush = csg.evaluate(brush, connector, SUBTRACTION);
});

const geometry = mergeVertices(brush.geometry);
geometry.computeBoundingSphere();

const mesh = new Mesh(geometry, materials);
scene.add(mesh);
