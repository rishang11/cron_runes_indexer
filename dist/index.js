"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const parse_tx_1 = require("./crons/parse_tx");
(0, parse_tx_1.parseData)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8889;
app.use(express_1.default.json());
app.get("/", async (_req, res) => {
    try {
        console.log("api called");
        res.send("ok");
    }
    catch (error) {
        console.error("Error fetching inscriptions:", error);
        res.status(500).send("Error fetching inscriptions");
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map