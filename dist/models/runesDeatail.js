"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runesDetailSchema = void 0;
const mongoose_1 = require("mongoose");
exports.runesDetailSchema = new mongoose_1.Schema({
    rune_name: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    txid: { type: String, required: true, unique: true },
    vin: { type: Array, required: true },
    vout: { type: Array, required: true },
    fee: { type: Number, required: true },
    parsed: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
//# sourceMappingURL=runesDeatail.js.map