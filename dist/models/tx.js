"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txSchema = void 0;
const mongoose_1 = require("mongoose");
exports.txSchema = new mongoose_1.Schema({
    txid: { type: String, required: true, unique: true },
    version: { type: Number, required: true },
    locktime: { type: Number, required: true },
    vin: { type: Array, required: true },
    vout: { type: Array, required: true },
    size: { type: Number, required: true },
    weight: { type: Number, required: true },
    sigops: { type: Number, required: true },
    fee: { type: Number, required: true },
    status: {
        confirmed: { type: Boolean, required: true },
        block_height: { type: Number, required: true },
        block_hash: { type: String, required: true },
        block_time: { type: Number, required: true },
    },
    parsed: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
exports.txSchema.index({ parsed: 1 });
//# sourceMappingURL=tx.js.map