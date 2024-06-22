"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReconnectHandler = exports.shortenString = exports.getBTCPriceInDollars = exports.writeSyncState = exports.readSyncState = exports.fetchProvider = exports.stringToHex = exports.wait = exports.pauseCronJob = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const SYNC_FILE_PATH = path_1.default.join(__dirname, "../../sync-state.json");
const pauseCronJob = (job, time = 10 * 60 * 60) => {
    if (job) {
        job.stop();
        setTimeout(() => {
            job.start();
        }, time);
    }
};
exports.pauseCronJob = pauseCronJob;
function wait(seconds = 10) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
exports.wait = wait;
function stringToHex(str) {
    return Buffer.from(str.toLowerCase(), "utf-8").toString("hex");
}
exports.stringToHex = stringToHex;
async function fetchProvider() {
    const urls = [];
    if (process.env.PROVIDER && process.env.PROVIDER.includes("https")) {
        urls.push(process.env.PROVIDER);
    }
    else if (process.env.PROVIDER && process.env.PROVIDER.includes("http://")) {
        urls.push(`${process.env.PROVIDER}:8080`);
        urls.push(`${process.env.PROVIDER}:8081`);
    }
    for (const url of urls) {
        try {
            const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
            if (response.ok) {
                return url;
            }
        }
        catch (error) {
            console.error(`Error fetching ${url}:`, error);
        }
    }
    return "";
}
exports.fetchProvider = fetchProvider;
const readSyncState = () => {
    try {
        const fileContent = fs_1.default.readFileSync(SYNC_FILE_PATH, "utf8");
        return JSON.parse(fileContent);
    }
    catch (error) {
        return {
            inscription_block: 767429,
            inscription: 0,
            tx_block: 818154,
            start: 767429,
        };
    }
};
exports.readSyncState = readSyncState;
const writeSyncState = (state) => {
    fs_1.default.writeFileSync(SYNC_FILE_PATH, JSON.stringify(state, null, 2), "utf8");
};
exports.writeSyncState = writeSyncState;
async function fetchContentFromProviders(contentId) {
    try {
        const url = `${process.env.PROVIDER}/content/${contentId}`;
        const response = await axios_1.default.get(url, {
            responseType: "arraybuffer",
        });
        return response;
    }
    catch (error) {
        return null;
    }
}
exports.default = fetchContentFromProviders;
let btcPriceCache = {
    price: null,
    timestamp: null,
};
async function getBTCPriceInDollars() {
    const tenMinutes = 10 * 60 * 1000;
    const currentTime = new Date();
    if (btcPriceCache.price &&
        btcPriceCache.timestamp &&
        currentTime.getTime() - btcPriceCache.timestamp.getTime() < tenMinutes) {
        return btcPriceCache.price;
    }
    try {
        const response = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
        const data = await response.json();
        const priceInDollars = Number(data["data"]["amount"]);
        btcPriceCache.price = priceInDollars;
        btcPriceCache.timestamp = currentTime;
        return priceInDollars;
    }
    catch (error) {
        console.error("Error fetching BTC price:", error);
        throw Error("BTC Price Fetch Error");
    }
}
exports.getBTCPriceInDollars = getBTCPriceInDollars;
function shortenString(str, length) {
    if (str.length <= (length || 8)) {
        return str;
    }
    const start = str.slice(0, 4);
    const end = str.slice(-4);
    return `${start}...${end}`;
}
exports.shortenString = shortenString;
function createReconnectHandler(reconnectCallback, delayInSeconds = 10) {
    return function handleReconnect() {
        console.log("Stream closed or encountered an error. Attempting to reconnect...");
        setTimeout(reconnectCallback, delayInSeconds * 1000);
    };
}
exports.createReconnectHandler = createReconnectHandler;
//# sourceMappingURL=index.js.map