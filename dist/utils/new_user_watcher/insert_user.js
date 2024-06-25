"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_user = void 0;
const dbConnect_1 = __importDefault(require("../../lib/dbConnect"));
const models_1 = require("../../models");
const uuid_1 = require("uuid");
async function insert_user() {
    console.log("inserting new user");
    await (0, dbConnect_1.default)();
    const user = new models_1.User({
        ordinal_address: "bc1pl4t28mhc7q9hjwd32ghupjeygzmv70yhar8u7yn2kxsk9rsf0q4qy4td2x",
        cardinal_address: "bc1plrfjt8mk0f0vxw4vd9fmsdd34uptcn58w8jhk4sqnhxfj9m0cavq62hjen",
        id: (0, uuid_1.v4)(),
        ordinal_address_past_proccess: false,
        cardinal_address_past_proccess: false,
        ordinal_last_txid: "",
        cardinal_last_txid: "",
    });
    await user.save();
    console.log("User inserted successfully");
}
exports.insert_user = insert_user;
//# sourceMappingURL=insert_user.js.map