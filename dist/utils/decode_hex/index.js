"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeData = void 0;
function decodeData(hex) {
    const byteArray = new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const integers = [];
    let i = 0;
    while (i < byteArray.length) {
        let value = BigInt(0);
        let shift = 0;
        while (true) {
            const byte = byteArray[i++];
            value += BigInt(byte & 0x7f) << BigInt(shift);
            shift += 7;
            if ((byte & 0x80) === 0)
                break;
        }
        integers.push(value);
    }
    return integers;
}
exports.decodeData = decodeData;
//# sourceMappingURL=index.js.map