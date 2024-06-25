"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runesDatabaseSchema = void 0;
const mongoose_1 = require("mongoose");
exports.runesDatabaseSchema = new mongoose_1.Schema({
    rune_id: { type: String, required: true, unique: true, default: false },
    rune_name: { type: String, required: true, default: false, },
    amount: { type: Number, required: true },
    total_price: { type: Number, required: true, default: false },
    price_per_token: { type: Number, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    txid: { type: String, required: true, unique: true },
    vin: { type: Array, required: true },
    fee: { type: Number, required: true },
    parsed: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
//# sourceMappingURL=runesDatabase.js.map