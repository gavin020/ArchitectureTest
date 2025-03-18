// Basis 3D-ontwerptool met Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 400);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Voeg een eenvoudige kubus toe als model
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Positioneer de camera
camera.position.z = 5;

// Animatie om de kubus te roteren
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
