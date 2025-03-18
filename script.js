// Basis 3D-ontwerptool met Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 400);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Start met een vloer als basis
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Array om objecten op te slaan
let objects = [];

// Camera positie
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Functies om objecten toe te voegen
function addWall() {
    const wallGeometry = new THREE.BoxGeometry(5, 3, 0.2);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(Math.random() * 4 - 2, 1.5, Math.random() * 4 - 2); // Willekeurige positie
    scene.add(wall);
    objects.push(wall);
}

function addDoor() {
    const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
    const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(Math.random() * 4 - 2, 1, Math.random() * 4 - 2);
    scene.add(door);
    objects.push(door);
}

function addFurniture() {
    const chairGeometry = new THREE.BoxGeometry(1, 1, 1);
    const chairMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const chair = new THREE.Mesh(chairGeometry, chairMaterial);
    chair.position.set(Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2);
    scene.add(chair);
    objects.push(chair);
}

// Simpele opslagfunctie (lokaal in de browser)
function saveDesign() {
    const design = objects.map(obj => ({
        type: obj.geometry.type,
        position: obj.position.toArray(),
        color: obj.material.color.getHex()
    }));
    localStorage.setItem('savedDesign', JSON.stringify(design));
    alert('Ontwerp opgeslagen in de browser!');
}

// Animatie
function animate() {
    requestAnimationFrame(animate);
    objects.forEach(obj => {
        obj.rotation.y += 0.01; // Subtiele rotatie voor dynamiek
    });
    renderer.render(scene, camera);
}
animate();
