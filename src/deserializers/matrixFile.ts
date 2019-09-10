import { BinaryStream } from ".";

export default function deserialize(stream: BinaryStream) {
    // const sizeofDouble = 8;
    if (stream.readWord() !== 0x0c) throw Error("Not a Matrix File");
    stream.seek(14);
    const dimY = stream.readLong();
    const dimX = stream.readLong();
    const minY = stream.readLong();
    const minX = stream.readLong();
    const type = stream.readWord();
    stream.readWord(); //должен быть 0
    return { dimX, dimY, data: Array.from({ length: dimX * dimY }, () => stream.readDouble()) };
}
