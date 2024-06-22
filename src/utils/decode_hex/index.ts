export function decodeData(hex:any) {
    const byteArray = new Uint8Array(
      hex.match(/.{1,2}/g).map((byte:any) => parseInt(byte, 16))
    );
    const integers = [];
    let i = 0;
  
    while (i < byteArray.length) {
      let value = BigInt(0); // Use BigInt for value
      let shift = 0;
      while (true) {
        const byte = byteArray[i++];
        value += BigInt(byte & 0x7f) << BigInt(shift); // Apply BigInt to calculations
        shift += 7;
        if ((byte & 0x80) === 0) break;
      }
      integers.push(value);
    }
  
    return integers;
  }