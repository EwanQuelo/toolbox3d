// Variables globales
let scene, camera, renderer, cubeGroup, controls;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedCube = null;
let infoBox = null;

// Initialisation de la scène
function init() {
    // Scène
    scene = new THREE.Scene();

    // Caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;

    // Rendu
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lumière
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Charger les textures
    const textureLoader = new THREE.TextureLoader();
    const textures = [
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/weather.jpg'), // 18
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/calculatrice.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
        textureLoader.load('./img/redsquare.png'),
    ];

    // Créer le groupe de cubes
    createCubeGroup(textures);

    // Ajouter les contrôles d'orbite
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Pour un effet de ralentissement
    controls.dampingFactor = 0.25;

    // Ajouter la boîte d'information
    createInfoBox();

    // Événements
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('click', onDocumentMouseClick, false);

    // Lancer l'animation
    animate();
}

// Redimensionner le rendu lors du redimensionnement de la fenêtre
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Création du groupe de 27 cubes avec un espace entre eux
function createCubeGroup(textures) {
    cubeGroup = new THREE.Group();

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Définir les textes spécifiques pour chaque cube
    const texts = [
        "Face 1 - Texte personnalisé 1", "Face 2 - Texte personnalisé 2", "Face 3 - Texte personnalisé 3",
        "Face 4 - Texte personnalisé 4", "Face 5 - Texte personnalisé 5", "Face 6 - Texte personnalisé 6",
        "Face 7 - Texte personnalisé 7", "Face 8 - Texte personnalisé 8", "Face 9 - Texte personnalisé 9",
        "Face 10 - Texte personnalisé 10", "Face 11 - Texte personnalisé 11", "Face 12 - Texte personnalisé 12",
        "Face 13 - Texte personnalisé 13", "Face 14 - Texte personnalisé 14", "Face 15 - Texte personnalisé 15",
        "Face 16 - Texte personnalisé 16", "Face 17 - Texte personnalisé 17", "Météo",
        "Face 19 - Texte personnalisé 19", "Face 20 - Texte personnalisé 20", "Face 21 - Texte personnalisé 21",
        "Face 22 - Texte personnalisé 22", "Face 23 - Texte personnalisé 23", "Calculatrice",
        "Face 25 - Texte personnalisé 25", "Face 26 - Texte personnalisé 26", "Face 27 - Texte personnalisé 27"
    ];

    // Définir les URLs spécifiques pour chaque cube
    const urls = [
        "https://example.com/1", "https://example.com/2", "https://example.com/3",
        "https://example.com/4", "https://example.com/5", "https://example.com/6",
        "https://example.com/7", "https://example.com/8", "https://example.com/9",
        "https://example.com/10", "https://example.com/11", "https://example.com/12",
        "https://example.com/13", "https://example.com/14", "https://example.com/15",
        "https://example.com/16", "https://example.com/17", "https://ewanquelo.github.io/easy-weather/",
        "https://example.com/19", "https://example.com/20", "https://example.com/21",
        "https://example.com/22", "https://example.com/23", "https://ewanquelo.github.io/calculatrice/",
        "https://example.com/25", "https://example.com/26", "https://example.com/27"
    ];

    const spacing = 1.3;  // Espace entre les cubes

    // Créer 27 cubes
    for (let i = 0; i < 27; i++) {
        const cubeMaterial = new THREE.MeshBasicMaterial({ map: textures[i] });

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        const x = i % 3 - 1;
        const y = Math.floor(i / 3) % 3 - 1;
        const z = Math.floor(i / 9) - 1;

        cube.position.set(x * spacing, y * spacing, z * spacing);
        cube.userData = { info: texts[i], url: urls[i] };  // Stocker les informations personnalisées pour chaque cube

        // Ajouter les bordures noires
        const edges = new THREE.EdgesGeometry(cubeGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));

        // Ajouter les bordures et le cube au groupe
        const cubeContainer = new THREE.Group();
        cubeContainer.add(cube);
        cubeContainer.add(line);
        cubeGroup.add(cubeContainer);
    }

    scene.add(cubeGroup);
}

// Création de la boîte d'information
function createInfoBox() {
    infoBox = document.createElement('div');
    infoBox.style.position = 'absolute';
    infoBox.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
    infoBox.style.color = 'white';
    infoBox.style.padding = '10px';
    infoBox.style.borderRadius = '25px';
    infoBox.style.display = 'none';
    infoBox.style.zIndex = '1000';
    infoBox.style.transitionDuration = '0.3s';
    document.body.appendChild(infoBox);
}

// Gestion du mouvement de la souris
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubeGroup.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.parent !== selectedCube) {
            selectedCube = intersectedObject.parent;
            showInfoBox(event.clientX, event.clientY, selectedCube.children[0].userData.info);
        }
    } else {
        hideInfoBox();
        selectedCube = null;
    }
}

// Gestion des clics de la souris
function onDocumentMouseClick(event) {
    event.preventDefault();

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubeGroup.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.parent.children[0].userData.url) {
            window.location.href = intersectedObject.parent.children[0].userData.url;
        }
    }
}

// Afficher la boîte d'information
function showInfoBox(x, y, info) {
    infoBox.style.left = `${x + 10}px`;
    infoBox.style.top = `${y + 10}px`;
    infoBox.innerHTML = info;
    infoBox.style.display = 'block';
}

// Masquer la boîte d'information
function hideInfoBox() {
    infoBox.style.display = 'none';
}

// Animation
function animate() {
    requestAnimationFrame(animate);

    controls.update();  // Met à jour les contrôles

    renderer.render(scene, camera);
}

// Initialiser la scène
init();
