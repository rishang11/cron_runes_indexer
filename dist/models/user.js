"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    ordinal_address: { type: String, required: true, unique: true },
    cardinal_address: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    ordinal_address_past_processed: { type: String, required: true, default: false },
    cardinal_address_past_processed: { type: String, required: true, default: false },
    ordinal_last_txid: { type: String },
    cardinal_last_txid: { type: String },
    icon: { type: String },
}, {
    timestamps: true,
});
//# sourceMappingURL=user.js.map