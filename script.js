// Basis 3D-ontwerptool met Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 400);
const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

// Raycaster voor muisinteractie
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Vloer als basis
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Objecten en selectie
let objects = [];
let selectedObject = null;
let outlineMesh = null;
let particles = []; // Voor explosie-effect

// Camera positie
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Functies om objecten toe te voegen
function addWall() {
    const wallGeometry = new THREE.BoxGeometry(5, 3, 0.2);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(Math.random() * 4 - 2, 1.5, Math.random() * 4 - 2);
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

// Kleur wijzigen
function changeColor() {
    if (selectedObject) {
        const color = document.getElementById('color-picker').value;
        selectedObject.material.color.set(color);
    }
}

// Opslaan van ontwerp
function saveDesign() {
    const design = objects.map(obj => ({
        type: obj.geometry.type,
        position: obj.position.toArray(),
        color: obj.material.color.getHex()
    }));
    localStorage.setItem('savedDesign', JSON.stringify(design));
    alert('Ontwerp opgeslagen in de browser!');
}

// Selectie en omlijning
function selectObject(object) {
    if (selectedObject) {
        scene.remove(outlineMesh);
    }
    selectedObject = object;
    if (object) {
        const outlineGeometry = new THREE.EdgesGeometry(object.geometry);
        const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
        outlineMesh = new THREE.LineSegments(outlineGeometry, outlineMaterial);
        outlineMesh.position.copy(object.position);
        outlineMesh.rotation.copy(object.rotation);
        outlineMesh.scale.copy(object.scale);
        scene.add(outlineMesh);
        
        const type = object.geometry.type === 'BoxGeometry' ? 
            (object.scale.x === 5 ? 'Muur' : object.scale.y === 2 ? 'Deur' : 'Stoel') : 'Onbekend';
        document.getElementById('selected-object').textContent = type;
        document.getElementById('color-picker').value = '#' + object.material.color.getHexString();
    } else {
        document.getElementById('selected-object').textContent = 'Geen';
    }
}

// Explode Mesh
function explodeMesh() {
    objects.forEach(object => {
        const position = object.position.clone();
        const color = object.material.color.clone();
        scene.remove(object);

        // Maak kleine deeltjes
        for (let i = 0; i < 10; i++) {
            const particleGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5,
                (Math.random() - 0.5) * 5
            );
            particle.life = 2; // Seconden dat het blijft bestaan
            scene.add(particle);
            particles.push(particle);
        }
    });
    objects = []; // Verwijder alle originele objecten
    selectObject(null); // Deselecteer
}

// Reset scène
function resetScene() {
    objects.forEach(obj => scene.remove(obj));
    particles.forEach(p => scene.remove(p));
    if (outlineMesh) scene.remove(outlineMesh);
    objects = [];
    particles = [];
    selectedObject = null;
    document.getElementById('selected-object').textContent = 'Geen';
}

// Muisinteractie
let isDragging = false;

container.addEventListener('mousedown', (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        selectObject(intersects[0].object);
        isDragging = true;
    } else {
        selectObject(null);
    }
});

container.addEventListener('mousemove', (event) => {
    if (isDragging && selectedObject) {
        mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(floor);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            selectedObject.position.set(point.x, selectedObject.position.y, point.z);
            outlineMesh.position.copy(selectedObject.position);
        }
    }
});

container.addEventListener('mouseup', () => {
    isDragging = false;
});

// Animatie met zwaartekracht voor explosie
function animate() {
    requestAnimationFrame(animate);

    // Update particles
    particles.forEach((particle, index) => {
        particle.velocity.y -= 0.1; // Zwaartekracht
        particle.position.add(particle.velocity);
        particle.life -= 1 / 60; // 60 FPS
        if (particle.life <= 0) {
            scene.remove(particle);
            particles.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}
animate();
