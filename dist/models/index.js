"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tx = exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const tx_1 = require("./tx");
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", user_1.userSchema);
exports.User = User;
const Tx = mongoose_1.models.Tx || (0, mongoose_1.model)("Tx", tx_1.txSchema);
exports.Tx = Tx;
//# sourceMappingURL=index.js.map