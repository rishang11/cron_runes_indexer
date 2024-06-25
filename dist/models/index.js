"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runesDatabase = exports.Tx = exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const tx_1 = require("./tx");
const runesDatabase_1 = require("./runesDatabase");
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", user_1.userSchema);
exports.User = User;
const Tx = mongoose_1.models.Tx || (0, mongoose_1.model)("Tx", tx_1.txSchema);
exports.Tx = Tx;
const runesDatabase = mongoose_1.models.runesDatabase || (0, mongoose_1.model)("runesDatabase", runesDatabase_1.runesDatabaseSchema);
exports.runesDatabase = runesDatabase;
//# sourceMappingURL=index.js.map