"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailAlert = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
async function sendEmailAlert({ from = "crypticmeta@coderixx.com", to = "ankitpathak@coderixx.com", subject, html, }) {
    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
exports.sendEmailAlert = sendEmailAlert;
//# sourceMappingURL=send_email_alert.js.map