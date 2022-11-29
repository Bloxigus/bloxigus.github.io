// var colours = {
//     "A": "edge",
//     "B": "edge2",
//     "C": "middle",
//     "D": "lip",
//     "E": "eye",
//     "F": "fin1",
//     "G": "fin2",
//     "H": "fin3",
//     "I": "fin4",
//     "J": "fin5",
//     " ": "transparent",
//     "X": "base"
// }
const EPS = 1e-3;
var colourLocations = {
    head: {
        top: [
            "AABBBBAA",
            "ABCCCCBA",
            "JCCCCCCJ",
            "ICCCCCCI",
            "BCCCCCCB",
            "BCCCCCCB",
            "ABCCCCBA",
            "AABBBBAA"
        ],
        side: [
            "AABBIJAA",
            "ABCGHCBA",
            "BCFFCIJB",
            "BCCCGHCB",
            "BCCFFCII",
            "ECCCCGHB",
            "ABCCFFBA",
            "AABBBBAA"
        ],
        front: [
            "AABBBBAA",
            "ABCCCCBA",
            "BCCCCCCB",
            "BCCCCCCB",
            "BCCCCCCB",
            "ECCDDCCE",
            "ABCCCCBA",
            "AABBBBAA"
        ],
        base: [
            "AABBBBAA",
            "ABCCCCBA",
            "BCCCCCCB",
            "BCCCCCCB",
            "BCCCCCCB",
            "BCCCCCCB",
            "ABCCCCBA",
            "AABBBBAA"
        ],
        back: [
            "AABBBBAA",
            "ABCCCCBA",
            "BCCCCCCB",
            "BCCCCCCB",
            "JBCCCCBJ",
            "BCCCCCCB",
            "ABCCCCBA",
            "AABBBBAA"
        ]
    },
    hat: {
        top: [
            "        ",
            "        ",
            "J      J",
            "I      I",
            "        ",
            "        ",
            "        ",
            "        "
        ],
        side: [
            "    IJ  ",
            "   GH   ",
            "  FF IJ ",
            "    GH  ",
            "   FF II",
            "     GH ",
            "    FF  ",
            "        "
        ],
        front: [
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        "
        ],
        base: [
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        "
        ],
        back: [
            "        ",
            "        ",
            "        ",
            "        ",
            "J      J",
            "        ",
            "        ",
            "        "
        ]
    },
    legs: {
        top: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        front: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        base: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        back: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ]
    },
    outerLayerLeg: {
        top: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        front: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        base: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        back: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ]
    },
    chest: {
        top: [
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        front: [
            "XXKKKKXX",
            "XXXKKXXX",
            "XXXKKXXX",
            "XXXKKXXX",
            "XXXKKXXX",
            "XXXKKXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX"
        ],
        base: [
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX"
        ],
        back: [
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX",
            "XXXXXXXX"
        ]
    },
    arm: {
        top: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "BBBB",
            "AAAA"
        ],
        front: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "BBBB",
            "AAAA"
        ],
        base: [
            "AAAA",
            "AAAA",
            "AAAA",
            "AAAA"
        ],
        back: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "BBBB",
            "AAAA"
        ]
    },
    outerLayerArm: {
        top: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        front: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        base: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        back: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ]
    }
}
var colourLocationsSlim = {
    head: colourLocations.head,
    hat: colourLocations.hat,
    legs: colourLocations.legs,
    outerLayerLeg: colourLocations.outerLayerLeg,
    chest: colourLocations.chest,
    arm: {
        top: [
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "BBBB",
            "AAAA"
        ],
        front: [
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "BBB",
            "AAA"
        ],
        base: [
            "AAA",
            "AAA",
            "AAA",
            "AAA"
        ],
        back: [
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "BBB",
            "AAA"
        ]
    },
    outerLayerArm: {
        top: [
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ],
        side: [
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX",
            "XXXX"
        ],
        front: [
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ],
        base: [
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ],
        back: [
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ]
    }
}
var locations = {
    head: [[0, 0]],
    hat: [[32, 0]],
    legs: [[0, 16], [16, 48]],
    chest: [[16, 16]],
    arm: [[40, 16], [32, 48]],
    outerLayerArm: [[40, 32], [48, 48]]
}
var locationsSlim = locations
let cubes = {
    head: {
        size: [8, 8, 8],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [8 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [16 / 8, 56 / 8, 1 / 8, 1 / 8],
            top: [8 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [0 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [16 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [24 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8 + EPS, 12 + EPS, 4 + EPS],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 20 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 44 / 4, 1 / (64 / 8), 1 / (64 / 4)],
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
            bottom: [40 / 4, 12 / 4, 1 / (64 / 4), 1 / (64 / 4)],
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
            bottom: [48 / 4, 44 / 4, 1 / (64 / 4), 1 / (64 / 4)],
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
            bottom: [24 / 4, 12 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [20 / 4, 48 / 4, 1 / (64 / 4), 1 / (64 / 4)],
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
            bottom: [8 / 4, 44 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 16 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let outerLayerCubes = {
    head: {
        size: [9, 9, 9],
        offset: [0, 16, 0],
        hidden: false,
        uv: {
            front: [40 / 8, 8 / 8, 1 / 8, 1 / 8],
            bottom: [48 / 8, 56 / 8, 1 / 8, 1 / 8],
            top: [40 / 8, 0 / 8, 1 / 8, 1 / 8],
            left: [32 / 8, 8 / 8, 1 / 8, 1 / 8],
            right: [48 / 8, 8 / 8, 1 / 8, 1 / 8],
            back: [56 / 8, 8 / 8, 1 / 8, 1 / 8],
        }
    },
    body: {
        size: [8.5 + EPS, 12.5 + EPS, 4.5 + EPS],
        offset: [0, 6, 0],
        hidden: false,
        uv: {
            front: [20 / 8, 36 / 12, 1 / (64 / 8), 1 / (64 / 12)],
            bottom: [28 / 8, 28 / 4, 1 / (64 / 8), 1 / (64 / 4)],
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
            bottom: [56 / 4, 12 / 4, 1 / (64 / 4), 1 / (64 / 4)],
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
            bottom: [48 / 4, 28 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [44 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [40 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [48 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [52 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    },
    rightLeg: {
        size: [4.5 + EPS, 12.5 + EPS, 4.5 + EPS],
        offset: [2, -6, 0],
        hidden: false,
        uv: {
            front: [4 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            bottom: [8 / 4, 12 / 4, 1 / (64 / 4), 1 / (64 / 4)],
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
            bottom: [8 / 4, 28 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            top: [4 / 4, 32 / 4, 1 / (64 / 4), 1 / (64 / 4)],
            left: [0 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [8 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [12 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
        }
    }
}
let cubesSlim = {
    head: cubes.head,
    body: cubes.body,
    rightArm: {
        size: [3, 12, 4],
        offset: [5.5, 6, 0],
        hidden: false,
        uv: {
            front: [36 / 3, 52 / 12, 1 / (64 / 3), 1 / (64 / 12)],
            bottom: [39 / 3, 12 / 4, 1 / (64 / 3), 1 / (64 / 4)],
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
            bottom: [47 / 3, 44 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            top: [44 / 3, 16 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            left: [40 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [47 / 4, 20 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [51 / 3, 20 / 12, 1 / (64 / 3), 1 / (64 / 12)],
        }
    },
    rightLeg: cubes.rightLeg,
    leftLeg: cubes.leftLeg
}
let outerLayerCubesSlim = {
    head: outerLayerCubes.head,
    body: outerLayerCubes.body,
    rightArm: {
        size: [3.5, 12.5, 4.5],
        offset: [5.5, 6, 0],
        hidden: false,
        uv: {
            front: [52 / 3, 52 / 12, 1 / (64 / 3), 1 / (64 / 12)],
            bottom: [55 / 3, 12 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            top: [52 / 3, 48 / 12, 1 / (64 / 3), 1 / (64 / 4)],
            left: [48 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [55 / 4, 52 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [59 / 3, 52 / 12, 1 / (64 / 3), 1 / (64 / 12)],
        }
    },
    leftArm: {
        size: [3.5, 12.5, 4.5],
        offset: [-5.5, 6, 0],
        hidden: false,
        uv: {
            front: [44 / 3, 36 / 12, 1 / (64 / 3), 1 / (64 / 12)],
            bottom: [47 / 3, 28 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            top: [44 / 3, 32 / 4, 1 / (64 / 3), 1 / (64 / 4)],
            left: [40 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            right: [47 / 4, 36 / 12, 1 / (64 / 4), 1 / (64 / 12)],
            back: [51 / 3, 36 / 12, 1 / (64 / 3), 1 / (64 / 12)],
        }
    },
    rightLeg: outerLayerCubes.rightLeg,
    leftLeg: outerLayerCubes.leftLeg
}