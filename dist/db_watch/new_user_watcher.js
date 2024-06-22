"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.new_user_watcher = void 0;
const dbConnect_1 = __importDefault(require("../lib/dbConnect"));
const models_1 = require("../models");
const utils_1 = require("../utils");
async function new_user_watcher() {
    try {
        await (0, dbConnect_1.default)();
        console.log("Monitoring for new activity");
        const changeStream = models_1.User.watch([
            {
                $match: {
                    operationType: "insert",
                },
            },
        ]);
        changeStream.on("change", async (_change) => {
            console.log("received new User");
        });
        changeStream.on("close", (0, utils_1.createReconnectHandler)(new_user_watcher));
        changeStream.on("error", (0, utils_1.createReconnectHandler)(new_user_watcher));
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
exports.new_user_watcher = new_user_watcher;
//# sourceMappingURL=new_user_watcher.js.map