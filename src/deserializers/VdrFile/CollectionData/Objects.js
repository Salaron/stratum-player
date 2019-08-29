import { readNext } from '../Collection'
import consts from '../consts'

function readObject(stream) {
    return {
        handle: stream.readWord(),
        options: stream.readWord(),
        name: (stream.fileversion >= 0x0102 && stream.fileversion < 0x0300) ? stream.readString() : ""
    };

    // if (stream.fileversion >= 0x0102 && stream.fileversion < 0x0300) {
    //     data.name = stream.readString()
    // }
    // return data;
}

function readObject2D(stream) {
    return {
        ...readObject(stream),
        position: stream.readPoint2D(),
        size: stream.readPoint2D()
    }
}

function read_otGROUP(stream) {
    return {
        ...readObject(stream),
        items: readNext(stream, true, consts.otPRIMARYCOLLECTION).data,
    }
}
function read_otGROUP2D(stream) {
    return read_otGROUP(stream);
}
// function read_otRGROUP2D(stream) {
    // throw Error('not here');
    // return readObject(stream);
// }

// function read_otGROUP3D(stream) {
//     throw Error('otGROUP3D not supported');
// }
// function read_otOBJECT3D(stream) {
//     throw Error('otOBJECT3D not supported');
// }
// function read_otCAMERA3D(stream) {
//     throw Error('otCAMERA3D not supported');
// }
// function read_otLIGHT3D(stream) {
//     throw Error('otLIGHT3D not supported');
// }

function read_otLINE2D(stream) {
    let data = {
        ...readObject2D(stream),
        penHandle: stream.readWord(),
        brushHandle: stream.readWord(),
    }
    const pointCount = stream.readWord();

    data.points = new Array(pointCount);
    for(let i = 0; i < pointCount; i++)
        data.points[i] = stream.readPoint2D();

    if(stream.fileversion <= 0x0200)
        return data;

    const size = stream.readBytes(1)[0];

    if(size)
        data.arrows = stream.readBytes(size);

    return data;
}

function read_otBITMAP2D(stream) {
    return {
        ...readObject2D(stream),
        data: {
            origin: stream.readPoint2D(),
            size: stream.readPoint2D(),
            angle: stream.readWord(),
            sourceHandle: stream.readWord(),
        }
    }
}

function read_otDOUBLEBITMAP2D(stream) {
    return read_otBITMAP2D(stream);
}

function read_otTEXT2D(stream) {
    return {
        ...readObject2D(stream),
        textHandle: stream.readWord(),
        delta: stream.readPoint2D(),
        angle : stream.readWord()
    }
}
// function read_otVIEW3D2D(stream) {
//     throw Error('otVIEW3D2D not supported');
// }
// function read_otUSEROBJECT2D(stream) {
//     throw Error('otUSEROBJECT2D not implemented');
//     return readObject2D(stream);
// }

const allKeys = {};

setTimeout(() => console.log(allKeys), 5000);

//WINOBJ2D.cpp -> 29
function read_otCONTROL2D(stream) {
    const res = {
        ...readObject2D(stream),
        data: {
            className: stream.readString(),
            text: stream.readString(),
            dwStyle: stream.readLong(),
            exStyle: stream.readLong(),
            id: stream.readWord(),
            size: {
                x: stream.readWord(),
                y: stream.readWord(),
            },
        }
    };
    if(!allKeys[res.data.className]){
        allKeys[res.data.className] = res;
    }
    stream.readWord(); //unused
    return res;
}

// function read_otEDITFRAME2D(stream) {
//     throw Error('otEDITFRAME2D not implemented');
//     // return readObject2D(stream);
// }
// function read_otROTATECENTER2D(stream) {
//     throw Error('otROTATECENTER2D not implemented');
//     // return readObject2D(stream);
// }

function read_otSPACE2D(stream) {
    return readObject2D(stream);
}
// function read_otSPACE3D(stream) {
//     throw Error('otSPACE3D not supported');
// }

export default function init(funcs) {
    funcs.otGROUP = read_otGROUP;
    funcs.otGROUP2D = read_otGROUP2D;
    // funcs.otRGROUP2D = read_otRGROUP2D;
    //funcs.otGROUP3D = read_otGROUP3D;
    //funcs.otOBJECT3D = read_otOBJECT3D;
    //funcs.otCAMERA3D = read_otCAMERA3D;
    //funcs.otLIGHT3D = read_otLIGHT3D;
    funcs.otLINE2D = read_otLINE2D;
    funcs.otBITMAP2D = read_otBITMAP2D;
    funcs.otDOUBLEBITMAP2D = read_otDOUBLEBITMAP2D;
    funcs.otTEXT2D = read_otTEXT2D;
    //funcs.otVIEW3D2D = read_otVIEW3D2D;
    // funcs.otUSEROBJECT2D = read_otUSEROBJECT2D;
    funcs.otCONTROL2D = read_otCONTROL2D;
    // funcs.otEDITFRAME2D = read_otEDITFRAME2D;
    // funcs.otROTATECENTER2D = read_otROTATECENTER2D;
    funcs.otSPACE2D = read_otSPACE2D;
    //funcs.otSPACE3D = read_otSPACE3D;
}