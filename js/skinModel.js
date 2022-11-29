let { BoxBufferGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    TextureLoader } = THREE;
let camera, scene, renderer, mesh, material;
const drawStartPos = new THREE.Vector2();
let allMaterials = []
let size = 0.125
let outerIncrease = 0
let meshes = []
let updates = []
let arms = []
let posMult = 10
let yIncrease = -40
let sizeMult = 10
let directionalLight, ambientLight
let meshType = "MeshLambertMaterial"
init();
setupCanvasDrawing();
animate();
function init() {
    camera = new THREE.PerspectiveCamera(50, 0.5, 1, 2000);
    camera.position.z = 450;
    scene = new THREE.Scene();
    for (let cube in cubes) {
        let cube3 = cubes[cube]
        if (cube3.hidden) continue
        let materials = [new THREE[meshType](), new THREE[meshType](), new THREE[meshType](), new THREE[meshType](), new THREE[meshType](), new THREE[meshType]()];
        allMaterials.push(materials)
        updates.push(() => {
            let cube2 = (slim ? cubesSlim : cubes)[cube]
            sizeX = cube2.uv.right[2]
            sizeY = cube2.uv.right[3]
            sizeU = cube2.uv.right[0]
            sizeV = cube2.uv.right[1] + 1
            materials[0].map = new THREE.CanvasTexture(canvas)
            materials[0].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[0].map.repeat.set(sizeX, sizeY)
            materials[0].map.magFilter = 1003
            sizeX = cube2.uv.left[2]
            sizeY = cube2.uv.left[3]
            sizeU = cube2.uv.left[0]
            sizeV = cube2.uv.left[1] + 1
            materials[1].map = new THREE.CanvasTexture(canvas)
            materials[1].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[1].map.repeat.set(sizeX, sizeY)
            materials[1].map.magFilter = 1003
            sizeX = cube2.uv.top[2]
            sizeY = cube2.uv.top[3]
            sizeU = cube2.uv.top[0]
            sizeV = cube2.uv.top[1] + 1
            materials[2].map = new THREE.CanvasTexture(canvas)
            materials[2].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[2].map.repeat.set(sizeX, sizeY)
            materials[2].map.magFilter = 1003
            sizeX = cube2.uv.bottom[2]
            sizeY = cube2.uv.bottom[3]
            sizeU = cube2.uv.bottom[0]
            sizeV = cube2.uv.bottom[1] + 1
            var texture = new THREE.CanvasTexture(canvas);
            texture.repeat.y = -1;
            texture.wrapT = THREE.RepeatWrapping;
            materials[3].map = texture;
            materials[3].map.offset.set(sizeU * sizeX, 1 + sizeV * sizeY)
            materials[3].map.repeat.set(sizeX, -sizeY)
            materials[3].map.magFilter = 1003
            sizeX = cube2.uv.front[2]
            sizeY = cube2.uv.front[3]
            sizeU = cube2.uv.front[0]
            sizeV = cube2.uv.front[1] + 1
            materials[4].map = new THREE.CanvasTexture(canvas)
            materials[4].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[4].map.repeat.set(sizeX, sizeY)
            materials[4].map.magFilter = 1003
            sizeX = cube2.uv.back[2]
            sizeY = cube2.uv.back[3]
            sizeU = cube2.uv.back[0]
            sizeV = cube2.uv.back[1] + 1
            materials[5].map = new THREE.CanvasTexture(canvas)
            materials[5].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[5].map.repeat.set(sizeX, sizeY)
            materials[5].map.magFilter = 1003
        });
        mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeMult * cube3.size[0], sizeMult * cube3.size[1], sizeMult * cube3.size[2]), materials);
        mesh.position.set(posMult * cube3.offset[0], posMult * cube3.offset[1] + yIncrease, posMult * cube3.offset[2])
        meshes.push(mesh)
        if (cube.includes("Arm")) arms.push([cube, mesh, false, cube3.offset.map(a => a * posMult)]);
        scene.add(mesh);
    }
    for (let cube in outerLayerCubes) {
        let cube3 = outerLayerCubes[cube]
        if (cube3.hidden) continue
        var opts = { transparent: true, opacity: 1, alphaTest: Number.EPSILON, side: 2, depthWrite: true }
        let materials = [new THREE[meshType](opts), new THREE[meshType](opts), new THREE[meshType](opts), new THREE[meshType](opts), new THREE[meshType](opts), new THREE[meshType](opts)];
        allMaterials.push(materials)
        updates.push(() => {
            let cube2 = (slim ? outerLayerCubesSlim : outerLayerCubes)[cube]
            sizeX = cube2.uv.right[2] + 0
            sizeY = cube2.uv.right[3] + 0
            sizeU = cube2.uv.right[0] - 0
            sizeV = cube2.uv.right[1] + 1 - 0
            materials[0].map = new THREE.CanvasTexture(canvas)
            materials[0].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[0].map.repeat.set(sizeX, sizeY)
            materials[0].map.magFilter = 1003
            sizeX = cube2.uv.left[2] + 0
            sizeY = cube2.uv.left[3] + 0
            sizeU = cube2.uv.left[0] - 0
            sizeV = cube2.uv.left[1] + 1 - 0
            materials[1].map = new THREE.CanvasTexture(canvas)
            materials[1].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[1].map.repeat.set(sizeX, sizeY)
            materials[1].map.magFilter = 1003
            sizeX = cube2.uv.top[2] + 0
            sizeY = cube2.uv.top[3] + 0
            sizeU = cube2.uv.top[0] - 0
            sizeV = cube2.uv.top[1] + 1 - 0
            materials[2].map = new THREE.CanvasTexture(canvas)
            materials[2].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[2].map.repeat.set(sizeX, sizeY)
            materials[2].map.magFilter = 1003
            sizeX = cube2.uv.bottom[2] + 0
            sizeY = cube2.uv.bottom[3] + 0
            sizeU = cube2.uv.bottom[0] - 0
            sizeV = cube2.uv.bottom[1] + 1 - 0
            var texture = new THREE.CanvasTexture(canvas);
            texture.repeat.y = -1;
            texture.wrapT = THREE.RepeatWrapping;
            materials[3].map = texture;
            materials[3].map.offset.set(sizeU * sizeX, 1 + sizeV * sizeY)
            materials[3].map.repeat.set(sizeX, -sizeY)
            materials[3].map.magFilter = 1003
            sizeX = cube2.uv.front[2] + 0
            sizeY = cube2.uv.front[3] + 0
            sizeU = cube2.uv.front[0] - 0
            sizeV = cube2.uv.front[1] + 1 - 0
            materials[4].map = new THREE.CanvasTexture(canvas)
            materials[4].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[4].map.repeat.set(sizeX, sizeY)
            materials[4].map.magFilter = 1003
            sizeX = cube2.uv.back[2] + 0
            sizeY = cube2.uv.back[3] + 0
            sizeU = cube2.uv.back[0] - 0.
            sizeV = cube2.uv.back[1] + 1 - 0
            // materials[0].premultiplyAlpha = true;
            materials[5].map = new THREE.CanvasTexture(canvas)
            materials[5].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[5].map.repeat.set(sizeX, sizeY)
            materials[5].map.magFilter = 1003
        });
        mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeMult * (cube3.size[0] + outerIncrease), sizeMult * (cube3.size[1] + outerIncrease), sizeMult * (cube3.size[2] + outerIncrease)), materials);
        mesh.position.set(posMult * cube3.offset[0], posMult * cube3.offset[1] + yIncrease, posMult * cube3.offset[2])
        meshes.push(mesh)
        if (cube.includes("Arm")) arms.push([cube, mesh, true, cube3.offset.map(a => a * posMult)]);
        scene.add(mesh);
    }
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 0, 450);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.position.set(0, 0, 500);
    ambientLight.castShadow = true;
    scene.add(ambientLight);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true ,preserveDrawingBuffer :true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasSize / 2, canvasSize);
    document.body.before(canvas, renderer.domElement);
    renderer.domElement.style.float = "left"
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableDamping = false;
    controls.rotateSpeed = 1;
    window.addEventListener('resize', onWindowResize);
}
function setSlim(_slim) {
    slim = _slim;
    arms.forEach(v => {
        if (!v[2]) v[1].geometry = new THREE.BoxGeometry((slim ? 30 : 40), 120, 40)
        else v[1].geometry = new THREE.BoxGeometry((slim ? 35 : 45), 125, 45)
        if (slim) {
            v[1].position.set(posMult * cubesSlim[v[0]].offset[0], posMult * cubesSlim[v[0]].offset[1] + yIncrease, posMult * cubesSlim[v[0]].offset[2])
        } else {
            v[1].position.set(posMult * cubes[v[0]].offset[0], posMult * cubes[v[0]].offset[1] + yIncrease, posMult * cubes[v[0]].offset[2])
        }
    })
    setupCanvasDrawing()
}
function setupCanvasDrawing() {
    updates.forEach(a => a())
}
function onWindowResize() {
    let canvasSize = Math.min(window.innerHeight - 1, window.innerWidth - 1)
    if (window.innerHeight > window.innerWidth) {
        div.style.height = `auto`
        div.style.width = `${window.innerWidth - 1}px`
    } else {
        div.style.width = `calc(100% - ${(window.innerHeight - 1) / 2}px)`
        div.style.height = `${window.innerHeight - 1}px`
    }
    camera.aspect = 0.5;
    camera.updateProjectionMatrix();
    controls.update()
    renderer.setSize(canvasSize / 2, canvasSize);
}
var angle = 0
function animate() {
    requestAnimationFrame(animate);
    angle += 0.02
    directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z)
    ambientLight.position.set(camera.position.x, camera.position.y, camera.position.z)
    renderer.render(scene, camera);
}