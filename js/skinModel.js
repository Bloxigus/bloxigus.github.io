let { BoxBufferGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    TextureLoader } = THREE;
let camera, scene, renderer, mesh, material;
const drawStartPos = new THREE.Vector2();
let allMaterials = []
let cubes = {
    head: {
        size: [8, 8, 8],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [8 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [16 / 8, 0 / 8, 1 / 8, 1 / 8],
            top: [8 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [0 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [16 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [24 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8, 12, 4],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 20 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 16 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            top: [20 / 8, 16 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            left: [16 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [28 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [32 / 8, 20 / 12, 1 / (64 / 8), 1 / (64 / 12)],
        }
    },
    rightArm: {
        size: [4, 12, 4],
        offset: [6, 6, 0],
        hidden: false,
        uv: {
            front: [36 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [40 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [36 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [32 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [40 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [36 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftArm: {
        size: [4, 12, 4],
        offset: [-6, 6, 0],
        hidden: false,
        uv: {
            front: [44 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [48 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [44 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [40 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [48 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [52 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    rightLeg: {
        size: [4, 12, 4],
        offset: [2, -6, 0],
        hidden: false,
        uv: {
            front: [20 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [24 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [20 / 4, 52 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [16 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [24 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [28 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftLeg: {
        size: [4, 12, 4],
        offset: [-2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let outerLayerCubes = {
    head: {
        size: [8.5, 8.5, 8.5],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [40 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [48 / 8, 0 / 8, 1 / 8, 1 / 8],
            top: [40 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [32 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [48 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [56 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8.5, 12.5, 4.5],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 36 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 32 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            top: [20 / 8, 32 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            left: [16 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [28 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [32 / 8, 36 / 12, 1 / (64 / 8), 1 / (64 / 12)],
        }
    },
    rightArm: {
        size: [4.5, 12.5, 4.5],
        offset: [6, 6, 0],
        hidden: false,
        uv: {
            front: [52 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [56 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [52 / 4, 48 / 12, 1 / (64 / 4), 1 / (64 / 4)],
            left: [48 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [56 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [60 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftArm: {
        size: [4.5, 12.5, 4.5],
        offset: [-6, 6, 0],
        hidden: false,
        uv: {
            front: [44 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [48 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [44 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [40 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [48 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [52 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    rightLeg: {
        size: [4.5, 12.5, 4.5],
        offset: [2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftLeg: {
        size: [4.5, 12.5, 4.5],
        offset: [-2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let cubesSlim = {
    head: {
        size: [8, 8, 8],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [8 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [16 / 8, 0 / 8, 1 / 8, 1 / 8],
            top: [8 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [0 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [16 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [24 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8, 12, 4],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 20 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 16 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            top: [20 / 8, 16 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            left: [16 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [28 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [32 / 8, 20 / 12, 1 / (64 / 8), 1 / (64 / 12)],
        }
    },
    rightArm: {
        size: [3, 12, 4],
        offset: [5.5, 6, 0],
        hidden: false,
        uv: {
            front: [36 / 3, 52 / 12, 1 / (64 / 3), 1 / (64 / 12)],
            bottom: [39 / 3, 48 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            top: [36 / 3, 48 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            left: [32 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [39 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [35 / 3, 52 / 12, 1 / (64 / 3), 1 / (64 / 12)],
        }
    },
    leftArm: {
        size: [3, 12, 4],
        offset: [-5.5, 6, 0],
        hidden: false,
        uv: {
            front: [44 / 3, 20 / 12, 1 / (64 / 3), 1 / (64 / 12)],
            bottom: [47 / 3, 16 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            top: [44 / 3, 16 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            left: [40 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [47 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [51 / 3, 20 / 12, 1 / (64 / 3), 1 / (64 / 12)],
        }
    },
    rightLeg: {
        size: [4, 12, 4],
        offset: [2, -6, 0],
        hidden: false,
        uv: {
            front: [20 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [24 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [20 / 4, 52 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [16 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [24 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [28 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftLeg: {
        size: [4, 12, 4],
        offset: [-2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let outerLayerCubesSlim = {
    head: {
        size: [8.5, 8.5, 8.5],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [40 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [48 / 8, 0 / 8, 1 / 8, 1 / 8],
            top: [40 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [32 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [48 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [56 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8.5, 12.5, 4.5],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 36 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 32 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            top: [20 / 8, 32 / 4, 1 / (64 / 8), 1 / (64 / 4)],
            left: [16 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [28 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [32 / 8, 36 / 12, 1 / (64 / 8), 1 / (64 / 12)],
        }
    },
    rightArm: {
        size: [3.5, 12.5, 4.5],
        offset: [5.5, 6, 0],
        hidden: false,
        uv: {
            front: [52 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [55 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [52 / 4, 48 / 12, 1 / (64 / 4), 1 / (64 / 4)],
            left: [48 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [55 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [59 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftArm: {
        size: [3.5, 12.5, 4.5],
        offset: [-5.5, 6, 0],
        hidden: false,
        uv: {
            front: [44 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [47 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [44 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [40 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [47 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [51 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    rightLeg: {
        size: [4.5, 12.5, 4.5],
        offset: [2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    leftLeg: {
        size: [4.5, 12.5, 4.5],
        offset: [-2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let size = 0.125
let meshes = []
let updates = []
let arms = []


let posMult = 10
let yIncrease = -40
let sizeMult = 10


init();
setupCanvasDrawing();
animate();
function init() {
    camera = new THREE.PerspectiveCamera(50, 0.5, 1, 2000);
    camera.position.z = 500;
    scene = new THREE.Scene();
    for (let cube in cubes) {
        let cube3 = cubes[cube]
        if (cube3.hidden) continue
        let materials = [new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial()];
        allMaterials.push(materials)
        updates.push(() => {
            let cube2 = (slim?cubesSlim:cubes)[cube]
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
            materials[3].map = new THREE.CanvasTexture(canvas)
            materials[3].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[3].map.repeat.set(sizeX, sizeY)
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
        if (cube.includes("Arm")) arms.push([cube,mesh,false]);
        scene.add(mesh);
    }
    for (let cube in outerLayerCubes) {
        let cube3 = outerLayerCubes[cube]
        if (cube3.hidden) continue
        var opts = { transparent: true, opacity: 1 }
        let materials = [new THREE.MeshBasicMaterial(opts), new THREE.MeshBasicMaterial(opts), new THREE.MeshBasicMaterial(opts), new THREE.MeshBasicMaterial(opts), new THREE.MeshBasicMaterial(opts), new THREE.MeshBasicMaterial(opts)];
        allMaterials.push(materials)
        updates.push(() => {
            let cube2 = (slim?outerLayerCubesSlim:outerLayerCubes)[cube]
            sizeX = cube2.uv.right[2]
            sizeY = cube2.uv.right[3]
            sizeU = cube2.uv.right[0]
            sizeV = cube2.uv.right[1] + 1
            materials[0].transparant = true;
            materials[0].map = new THREE.CanvasTexture(canvas)
            materials[0].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[0].map.repeat.set(sizeX, sizeY)
            materials[0].map.magFilter = 1003
            sizeX = cube2.uv.left[2]
            sizeY = cube2.uv.left[3]
            sizeU = cube2.uv.left[0]
            sizeV = cube2.uv.left[1] + 1
            materials[1].transparant = true;
            materials[1].map = new THREE.CanvasTexture(canvas)
            materials[1].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[1].map.repeat.set(sizeX, sizeY)
            materials[1].map.magFilter = 1003
            sizeX = cube2.uv.top[2]
            sizeY = cube2.uv.top[3]
            sizeU = cube2.uv.top[0]
            sizeV = cube2.uv.top[1] + 1
            materials[2].transparant = true;
            materials[2].map = new THREE.CanvasTexture(canvas)
            materials[2].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[2].map.repeat.set(sizeX, sizeY)
            materials[2].map.magFilter = 1003
            sizeX = cube2.uv.bottom[2]
            sizeY = cube2.uv.bottom[3]
            sizeU = cube2.uv.bottom[0]
            sizeV = cube2.uv.bottom[1] + 1
            materials[3].transparant = true;
            materials[3].map = new THREE.CanvasTexture(canvas)
            materials[3].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[3].map.repeat.set(sizeX, sizeY)
            materials[3].map.magFilter = 1003
            sizeX = cube2.uv.front[2]
            sizeY = cube2.uv.front[3]
            sizeU = cube2.uv.front[0]
            sizeV = cube2.uv.front[1] + 1
            materials[4].transparant = true;
            materials[4].map = new THREE.CanvasTexture(canvas)
            materials[4].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[4].map.repeat.set(sizeX, sizeY)
            materials[4].map.magFilter = 1003
            sizeX = cube2.uv.back[2]
            sizeY = cube2.uv.back[3]
            sizeU = cube2.uv.back[0]
            sizeV = cube2.uv.back[1] + 1
            materials[5].transparant = true;
            materials[0].premultiplyAlpha = true;
            materials[5].map = new THREE.CanvasTexture(canvas)
            materials[5].map.offset.set(sizeU * sizeX, 1 - sizeV * sizeY)
            materials[5].map.repeat.set(sizeX, sizeY)
            materials[5].map.magFilter = 1003
        });
        mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeMult * cube3.size[0], sizeMult * cube3.size[1], sizeMult * cube3.size[2]), materials);
        mesh.position.set(posMult * cube3.offset[0], posMult * cube3.offset[1] + yIncrease, posMult * cube3.offset[2])
        meshes.push(mesh)
        if (cube.includes("Arm")) arms.push([cube,mesh,true]);
        scene.add(mesh);
    }
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
function setSlim(_slim) {
    slim = _slim;
    arms.forEach(v=>{
        if (!v[2]) v[1].geometry = new THREE.BoxGeometry((slim?30:40),120,40)
        else v[1].geometry = new THREE.BoxGeometry((slim?35:45),125,45)
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
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}