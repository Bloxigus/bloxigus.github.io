/// <reference types="three" />
let camera, scene, renderer, mesh, material;
let size = 0.125
let updates = []
/**
 * @type {[string, THREE.Mesh, boolean, number[], THREE.Vector3][]}
 */
let arms = []
/**
 * @type {[string, THREE.Mesh, boolean, number[], THREE.Vector3][]}
 */
let legs = []
/**
 * @type {[string, THREE.Mesh, boolean, THREE.Vector3]}
 */
let cape = []
let updateCape = () => {}
let posMult = 10
let yIncrease = -40
let sizeMult = 10
let directionalLight, ambientLight
let filter = THREE.NearestFilter;
init();
setupCanvasDrawing();
let startTime = Date.now()
let timeStamp = 0
animate();

function toradians(degrees) {
    return (degrees / 180) * Math.PI
}

function getDataFromSubset(x = 0, y = 0, sizex = 0, sizey = 0, reverse = false, isCape = false, mirror = false) {
    let from = AxolotlSkinGenerator.arrayBuffer;
    if (isCape) {
        from = AxolotlSkinGenerator.capeBuffer
    }
    const data = new Uint8Array(4 * sizex * sizey);
    if (!mirror) {
        for (let xp = 0; xp < sizex; xp++) {
            if (reverse) {
                for (let yp = sizey - 1; yp > -1; yp--) {
                    const stride = ((yp) * sizex + xp) * 4;
                    const strideOnTexture = ((y + yp) * 64 + (x + xp)) * 4
                    data[stride] = from[strideOnTexture];
                    data[stride + 1] = from[strideOnTexture + 1];
                    data[stride + 2] = from[strideOnTexture + 2];
                    data[stride + 3] = from[strideOnTexture + 3];
                }
            } else {
                for (let yp = 1; yp < sizey + 1; yp++) {
                    const stride = ((sizey - yp) * sizex + xp) * 4;
                    const strideOriginal = ((y + yp + -1) * 64 + (x + xp)) * 4
                    data[stride] = from[strideOriginal];
                    data[stride + 1] = from[strideOriginal + 1];
                    data[stride + 2] = from[strideOriginal + 2];
                    data[stride + 3] = from[strideOriginal + 3];
                }
            }

        }
    } else {
        for (let xp = sizex; xp > -1; xp--) {
            if (reverse) {
                for (let yp = sizey - 1; yp > -1; yp--) {
                    const stride = ((yp) * sizex + (sizex - xp - 1)) * 4;
                    const strideOnTexture = ((y + yp) * 64 + (x + xp)) * 4
                    data[stride] = from[strideOnTexture];
                    data[stride + 1] = from[strideOnTexture + 1];
                    data[stride + 2] = from[strideOnTexture + 2];
                    data[stride + 3] = from[strideOnTexture + 3];
                }
            } else {
                for (let yp = 1; yp < sizey + 1; yp++) {
                    const stride = ((sizey - yp) * sizex + (sizex - xp)) * 4;
                    const strideOriginal = ((y + yp + -1) * 64 + (x + xp)) * 4
                    data[stride] = from[strideOriginal];
                    data[stride + 1] = from[strideOriginal + 1];
                    data[stride + 2] = from[strideOriginal + 2];
                    data[stride + 3] = from[strideOriginal + 3];
                }
            }
        }
    }
    return data;
}

function init() {
    camera = new THREE.PerspectiveCamera(50, 0.5, 1, 2000);
    camera.position.z = 450;
    scene = new THREE.Scene();
    for (let cube in cubes) {
        let cube3 = cubes[cube]
        if (cube3.hidden) continue
        let materials = [new THREE.MeshLambertMaterial(), new THREE.MeshLambertMaterial(), new THREE.MeshLambertMaterial(), new THREE.MeshLambertMaterial(), new THREE.MeshLambertMaterial(), new THREE.MeshLambertMaterial()];
        updates.push((_changeSlim = false) => {
            let cube2 = (slim ? cubesSlim : cubes)[cube]
            if (!!materials[0].map) {
                materials[0].map.dispose()
                materials[1].map.dispose()
                materials[2].map.dispose()
                materials[3].map.dispose()
                materials[4].map.dispose()
                materials[5].map.dispose()
            }
            materials[0].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.right[0], cube2.uv.right[1], cube2.size[2], cube2.size[1]), cube2.size[2], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[1].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.left[0], cube2.uv.left[1], cube2.size[2], cube2.size[1]), cube2.size[2], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[2].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.top[0], cube2.uv.top[1], cube2.size[0], cube2.size[2]), cube2.size[0], cube2.size[2], undefined, undefined, undefined, undefined, undefined, filter);
            materials[3].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.bottom[0], cube2.uv.bottom[1], cube2.size[0], cube2.size[2], true), cube2.size[0], cube2.size[2], undefined, undefined, undefined, undefined, undefined, filter);
            materials[4].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.front[0], cube2.uv.front[1], cube2.size[0], cube2.size[1]), cube2.size[0], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[5].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.back[0], cube2.uv.back[1], cube2.size[0], cube2.size[1]), cube2.size[0], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[0].map.needsUpdate = true;
            materials[1].map.needsUpdate = true;
            materials[2].map.needsUpdate = true;
            materials[3].map.needsUpdate = true;
            materials[4].map.needsUpdate = true;
            materials[5].map.needsUpdate = true;
        });
        mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeMult * (cube3.size[0] + cube3.inflate), sizeMult * (cube3.size[1] + cube3.inflate), sizeMult * (cube3.size[2] + cube3.inflate)), materials);
        mesh.position.set(posMult * cube3.offset[0], posMult * cube3.offset[1] + yIncrease, posMult * cube3.offset[2])
        if (cube.includes("Arm")) arms.push([cube, mesh, false, cube3.offset.map(a => a * posMult), mesh.position.clone()]);
        if (cube.includes("Leg")) legs.push([cube, mesh, false, cube3.offset.map(a => a * posMult), mesh.position.clone()]);

        scene.add(mesh);
    }
    for (let cube in outerLayerCubes) {
        let cube3 = outerLayerCubes[cube]
        if (cube3.hidden) continue
        let opts = {
            transparent: true,
            opacity: 1,
            alphaTest: Number.EPSILON,
            side: 2,
            depthWrite: true,
            depthTest: true
        }
        let materials = [new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts)];
        updates.push((_changeSlim = false) => {
            let cube2 = (slim ? outerLayerCubesSlim : outerLayerCubes)[cube]
            if (!!materials[0].map) {
                materials[0].map.dispose()
                materials[1].map.dispose()
                materials[2].map.dispose()
                materials[3].map.dispose()
                materials[4].map.dispose()
                materials[5].map.dispose()
            }

            materials[0].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.right[0], cube2.uv.right[1], cube2.size[2], cube2.size[1]), cube2.size[2], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[1].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.left[0], cube2.uv.left[1], cube2.size[2], cube2.size[1]), cube2.size[2], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[2].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.top[0], cube2.uv.top[1], cube2.size[0], cube2.size[2]), cube2.size[0], cube2.size[2], undefined, undefined, undefined, undefined, undefined, filter);
            materials[3].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.bottom[0], cube2.uv.bottom[1], cube2.size[0], cube2.size[2], true), cube2.size[0], cube2.size[2], undefined, undefined, undefined, undefined, undefined, filter);
            materials[4].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.front[0], cube2.uv.front[1], cube2.size[0], cube2.size[1]), cube2.size[0], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[5].map = new THREE.DataTexture(getDataFromSubset(cube2.uv.back[0], cube2.uv.back[1], cube2.size[0], cube2.size[1]), cube2.size[0], cube2.size[1], undefined, undefined, undefined, undefined, undefined, filter);
            materials[0].map.needsUpdate = true;
            materials[1].map.needsUpdate = true;
            materials[2].map.needsUpdate = true;
            materials[3].map.needsUpdate = true;
            materials[4].map.needsUpdate = true;
            materials[5].map.needsUpdate = true;
        });
        mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeMult * (cube3.size[0] + cube3.inflate), sizeMult * (cube3.size[1] + cube3.inflate), sizeMult * (cube3.size[2] + cube3.inflate)), materials);
        mesh.position.set(posMult * cube3.offset[0], posMult * cube3.offset[1] + yIncrease, posMult * cube3.offset[2])
        if (cube.includes("Arm")) arms.push([cube, mesh, true, cube3.offset.map(a => a * posMult), mesh.position.clone()]);
        if (cube.includes("Leg")) legs.push([cube, mesh, true, cube3.offset.map(a => a * posMult), mesh.position.clone()])
        scene.add(mesh);
    } {
        let opts = {
            transparent: true,
            opacity: 1,
            alphaTest: Number.EPSILON,
            side: 2,
            depthWrite: true,
            depthTest: true
        }
        let capeMaterials = [new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts), new THREE.MeshLambertMaterial(opts)];

        let xcoords = [
            0, 1, 1, 11, 12, 11
        ]
        let ycoords = [
            1, 0, 1, 0, 1, 1
        ]
        let xsizes = [
            1, 10, 10, 10, 10, 1
        ]
        let ysizes = [
            16, 1, 16, 1, 16, 16
        ]
        let fixmap = [
            5, 0, 3, 1, 2, 4
        ]
        updateCape = () => {
            capeMaterials.map((a, i) => {
                let pixelData = getDataFromSubset(
                    xcoords[fixmap[i]],
                    ycoords[fixmap[i]],
                    xsizes[fixmap[i]],
                    ysizes[fixmap[i]],
                    true, true, fixmap[i] == 4 || fixmap[i] == 2)
                if (!!a.map) {
                    a.map.image.data.set(pixelData)
                } else {
                    a.map = new THREE.DataTexture(pixelData, xsizes[fixmap[i]], ysizes[fixmap[i]], undefined, undefined, undefined, undefined, undefined, filter)
                }
                a.map.needsUpdate = true
            })
        }
        updateCape()
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(10 * sizeMult, 16 * sizeMult, 1 * sizeMult), capeMaterials)
        let a = Math.PI + Math.PI / 10
        mesh.position.set(
            0,
            8 * sizeMult + 8 * sizeMult * Math.cos(a) - 0.5 * sizeMult * Math.sin(a),
            -2 * sizeMult + 8 * sizeMult * Math.sin(a) + 0.5 * sizeMult * Math.cos(a)
        )
        cape = ["Cape", mesh, false, mesh.position.clone()]
        mesh.rotateX(a)
        scene.add(mesh)
    }
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 0, 450);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.position.set(0, 0, 500);
    ambientLight.castShadow = true;
    scene.add(ambientLight);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasSize / 2, canvasSize);
    document.body.before(canvas, renderer.domElement);
    renderer.domElement.style.float = "left"
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.rotateSpeed = 1;
    window.addEventListener('resize', onWindowResize);
}

function setSlim(_setSlim = false) {
    slim = _setSlim;
    for (let arm of arms) {
        arm[1].geometry.dispose()
        if (!arm[2]) arm[1].geometry = new THREE.BoxGeometry((slim ? 30 : 40), 120, 40)
        else arm[1].geometry = new THREE.BoxGeometry((slim ? 35 : 45), 125, 45)
        if (slim) {
            arm[1].position.set(posMult * cubesSlim[arm[0]].offset[0], posMult * cubesSlim[arm[0]].offset[1] + yIncrease, posMult * cubesSlim[arm[0]].offset[2])
        } else {
            arm[1].position.set(posMult * cubes[arm[0]].offset[0], posMult * cubes[arm[0]].offset[1] + yIncrease, posMult * cubes[arm[0]].offset[2])
        }
        arm[4].set(arm[1].position.x, arm[1].position.y, arm[1].position.z)
    }
}

function setupCanvasDrawing(_setSlim = false) {
    arrayBuffersSizes = 0
    updates.forEach(a => a(_setSlim))
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

function animate() {
    timeStamp += Date.now() - startTime
    startTime = Date.now()
    directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z)
    let angles = Math.sin(toradians(timeStamp / 5));
    ////////////////////////////////// EXTERNAL
    if (!animateCheck.checked) angles = 0;
    //////////////////////////////////
    ambientLight.position.set(camera.position.x, camera.position.y, camera.position.z)
    for (let index = 0; index < arms.length; index++) {
        let arm = arms[index]
        let type = 1
        if (index % 2 == 1) type = -1
        arm[1].rotation.set(type * toradians(18) * angles, 0, 0)
        arm[1].position.set(arm[4].x, arm[4].y + 40 - 40 * Math.cos(arm[1].rotation.x), arm[4].z + -40 * Math.sin(arm[1].rotation.x))
    }
    for (let index = 0; index < legs.length; index++) {
        let leg = legs[index];
        let type = 1
        if (index % 2 == 0) type = -1
        leg[1].rotation.set(type * toradians(20) * angles, 0, 0)
        leg[1].position.set(leg[4].x, leg[4].y + 50 - 50 * Math.cos(leg[1].rotation.x), leg[4].z + -50 * Math.sin(leg[1].rotation.x))
    }
    capeAnimation: {
        ////////////////////////////////// EXTERNAL
        if (!animateCheck.checked) timeStamp = 0;
        //////////////////////////////////
        let mesh = cape[1]
        let capeAngle = toradians(18) - Math.sin(toradians(timeStamp / 20)) * toradians(6)
        let a = Math.PI + capeAngle
        mesh.rotation.x = a
        mesh.position.set(
            0,
            8 * sizeMult + 8 * sizeMult * Math.cos(a) - 0.5 * sizeMult * Math.sin(a),
            -2 * sizeMult + 8 * sizeMult * Math.sin(a) + 0.5 * sizeMult * Math.cos(a)
        )
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
onAppLoaded()