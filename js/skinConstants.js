/** What each colour represents:
    "A": "edge"
    "B": "edge2"
    "C": "middle"
    "D": "lip"
    "E": "eye"
    "F": "fin1"
    "G": "fin2"
    "H": "fin3"
    "I": "fin4"
    "J": "fin5"
    " ": "transparent"
    "X": "base"
*/
let colourLocations = {
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
        side_right: [
            "AABBIJAA",
            "ABCGHCBA",
            "BCFFCIJB",
            "BCCCGHCB",
            "BCCFFCII",
            "ECCCCGHB",
            "ABCCFFBA",
            "AABBBBAA"
        ],
        side_left: Utils.reverse([
            "AABBIJAA",
            "ABCGHCBA",
            "BCFFCIJB",
            "BCCCGHCB",
            "BCCFFCII",
            "ECCCCGHB",
            "ABCCFFBA",
            "AABBBBAA"
        ]),
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
        side_left: Utils.reverse([
            "    IJ  ",
            "   GH   ",
            "  FF IJ ",
            "    GH  ",
            "   FF II",
            "     GH ",
            "    FF  ",
            "        "
        ]),
        side_right: [
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
        side_left: [
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
        side_right: [
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
        side_left: [
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
        side_right: [
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
            "XXCCCCXX",
            "XXCCCCXX",
            "XXXCCXXX"
        ],
        side_left: [
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
        side_right: [
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
        side_right: [
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
        side_left: [
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
        side_right: [
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
        side_left: [
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
let colourLocationsSlim = {
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
        side_left: [
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
        side_right: [
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
        side_right: [
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
        side_left: [
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
let locations = {
    head: [
        [0, 0]
    ],
    hat: [
        [32, 0]
    ],
    legs: [
        [0, 16],
        [16, 48]
    ],
    outerLayerLeg: [
        [0, 48],
        [16, 64]
    ],
    chest: [
        [16, 16]
    ],
    arm: [
        [40, 16],
        [32, 48]
    ],
    outerLayerArm: [
        [40, 32],
        [48, 48]
    ]
}
let locationsSlim = locations
let cubes = {
    head: {
        size: [8, 8, 8],
        offset: [0, 16, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [8, 8],
            bottom: [16, 0],
            top: [8, 0],
            left: [0, 8],
            right: [16, 8],
            back: [24, 8]
        }
    },
    body: {
        size: [8, 12, 4],
        offset: [0, 6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [20, 20],
            bottom: [28, 16],
            top: [20, 16],
            left: [16, 20],
            right: [28, 20],
            back: [32, 20]
        }
    },
    rightArm: {
        size: [4, 12, 4],
        offset: [6, 6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [36, 52],
            bottom: [40, 48],
            top: [36, 48],
            left: [32, 52],
            right: [40, 52],
            back: [36, 52]
        }
    },
    leftArm: {
        size: [4, 12, 4],
        offset: [-6, 6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [44, 20],
            bottom: [48, 16],
            top: [44, 16],
            left: [40, 20],
            right: [48, 20],
            back: [52, 20]
        }
    },
    rightLeg: {
        size: [4, 12, 4],
        offset: [2, -6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [20, 52],
            bottom: [24, 48],
            top: [20, 48],
            left: [16, 52],
            right: [24, 52],
            back: [28, 52]
        }
    },
    leftLeg: {
        size: [4, 12, 4],
        offset: [-2, -6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [4, 20],
            bottom: [8, 16],
            top: [4, 16],
            left: [0, 20],
            right: [8, 20],
            back: [12, 20]
        }
    }
}
let outerLayerCubes = {
    head: {
        size: [8, 8, 8],
        offset: [0, 16, 0],
        hidden: false,
        inflate: 1,
        uv: {
            front: [40, 8],
            bottom: [48, 0],
            top: [40, 0],
            left: [32, 8],
            right: [48, 8],
            back: [56, 8]
        }
    },
    body: {
        size: [8, 12, 4],
        offset: [0, 6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [20, 36],
            bottom: [28, 32],
            top: [20, 32],
            left: [16, 36],
            right: [28, 36],
            back: [32, 36]
        }
    },
    rightArm: {
        size: [4, 12, 4],
        offset: [6, 6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [52, 52],
            bottom: [56, 48],
            top: [52, 48],
            left: [48, 52],
            right: [56, 52],
            back: [60, 52]
        }
    },
    leftArm: {
        size: [4, 12, 4],
        offset: [-6, 6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [44, 36],
            bottom: [48, 32],
            top: [44, 32],
            left: [40, 36],
            right: [48, 36],
            back: [52, 36]
        }
    },
    rightLeg: {
        size: [4, 12, 4],
        offset: [2, -6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [4, 52],
            bottom: [8, 48],
            top: [4, 48],
            left: [0, 52],
            right: [8, 52],
            back: [12, 52]
        }
    },
    leftLeg: {
        size: [4, 12, 4],
        offset: [-2, -6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [4, 36],
            bottom: [8, 32],
            top: [4, 32],
            left: [0, 36],
            right: [8, 36],
            back: [12, 36]
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
        inflate: 0,
        uv: {
            front: [36, 52],
            bottom: [39, 48],
            top: [36, 48],
            left: [32, 52],
            right: [39, 52],
            back: [35, 52]
        }
    },
    leftArm: {
        size: [3, 12, 4],
        offset: [-5.5, 6, 0],
        hidden: false,
        inflate: 0,
        uv: {
            front: [44, 20],
            bottom: [47, 16],
            top: [44, 16],
            left: [40, 20],
            right: [47, 20],
            back: [51, 20]
        }
    },
    rightLeg: cubes.rightLeg,
    leftLeg: cubes.leftLeg
}
let outerLayerCubesSlim = {
    head: outerLayerCubes.head,
    body: outerLayerCubes.body,
    rightArm: {
        size: [3, 12, 4],
        offset: [5.5, 6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [52, 52],
            bottom: [55, 48],
            top: [52, 48],
            left: [48, 52],
            right: [55, 52],
            back: [59, 52]
        }
    },
    leftArm: {
        size: [3, 12, 4],
        offset: [-5.5, 6, 0],
        hidden: false,
        inflate: 0.5,
        uv: {
            front: [44, 36],
            bottom: [47, 32],
            top: [44, 32],
            left: [40, 36],
            right: [47, 36],
            back: [51, 36]
        }
    },
    rightLeg: outerLayerCubes.rightLeg,
    leftLeg: outerLayerCubes.leftLeg
}