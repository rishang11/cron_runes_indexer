"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseData = void 0;
const dbConnect_1 = __importDefault(require("../../lib/dbConnect"));
const models_1 = require("../../models");
const decode_hex_1 = require("../../utils/decode_hex");
const parseData = async () => {
    console.log("Fetching data...");
    await (0, dbConnect_1.default)();
    const user_Tx = await models_1.Tx.findOne({
        parsed: false,
    });
    if (!user_Tx) {
        console.log("No user_Tx found with parsed: false");
        return;
    }
    console.log(user_Tx, "user_Tx");
    const { vout } = user_Tx;
    if (!vout) {
        console.log("No vout data available");
        return;
    }
    console.log("------------------------------------------------------------");
    console.log(vout, "vout");
    console.log("///////////////////////////////////////////////////////");
    const opReturnData = extractOpReturnData(vout);
    if (opReturnData) {
        console.log(`Extracted OP_RETURN data: ${opReturnData}`);
    }
    else {
        console.log("No OP_RETURN data found");
    }
    const hexData = (0, decode_hex_1.decodeData)(opReturnData);
    console.log(hexData, "hexData");
};
exports.parseData = parseData;
function extractOpReturnData(vout) {
    for (const item of vout) {
        if (item.scriptpubkey_type === "op_return") {
            const scriptpubkeyAsm = item.scriptpubkey_asm;
            const parts = scriptpubkeyAsm.split(" ");
            if (parts.length > 2 && parts[0] === "OP_RETURN") {
                return parts[3];
            }
        }
    }
    return null;
}
//# sourceMappingURL=index.js.map