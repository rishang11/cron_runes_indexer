"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSendEmail = void 0;
const shouldSendEmail = (lastEmailTimestamp) => {
    const now = new Date();
    if (lastEmailTimestamp === null ||
        now.getTime() - lastEmailTimestamp.getTime() > 3600000) {
        return true;
    }
    return false;
};
exports.shouldSendEmail = shouldSendEmail;
//# sourceMappingURL=should_send_email.js.map