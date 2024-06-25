"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseData = void 0;
const dbConnect_1 = __importDefault(require("../../lib/dbConnect"));
const models_1 = require("../../models");
const decode_hex_1 = require("../../utils/decode_hex");
const axios_1 = __importDefault(require("axios"));
const parseData = async () => {
    console.log("Fetching data...");
    await (0, dbConnect_1.default)();
    const user_Tx = await models_1.Tx.findOne({
        parsed: false,
    });
    if (!user_Tx) {
        console.log("No user_Tx found with parsed: false");
        return;
    }
    console.log(user_Tx, "user_Tx");
    const { vout } = user_Tx;
    if (!vout) {
        console.log("No vout data available");
        return;
    }
    console.log("------------------------------------------------------------");
    console.log(vout, "vout");
    console.log("///////////////////////////////////////////////////////");
    const opReturnData = extractOpReturnData(vout);
    if (opReturnData) {
        console.log(`Extracted OP_RETURN data: ${opReturnData}`);
        const hexData = (0, decode_hex_1.decodeData)(opReturnData);
        console.log(hexData, "hexData");
        const fetchedDetails = await fetchHexData(hexData);
        console.log(fetchedDetails, "fetchedDetails");
        const amount = hexData[3].toString();
        if (fetchedDetails) {
            const runeshexDetail = formatRuneshexDetail(user_Tx, fetchedDetails, amount);
            console.log(runeshexDetail, "runeshex");
            await addRunesDetailToDB(runeshexDetail);
        }
    }
    else {
        const isMagicEden = checkMagicEdenTransaction(vout);
        if (isMagicEden) {
            console.log("Transaction is from Magic Eden");
            const txid = user_Tx.txid;
            const details = await fetchMagicEdenDetails(txid, user_Tx);
            console.log(details, "Magic Eden Transaction Details");
            if (details) {
                const runesDetail = formatRunesDetail(user_Tx, details);
                console.log(runesDetail, "Formatted Runes Detail");
                await addRunesDetailToDB(runesDetail);
            }
        }
        else {
            console.log("No OP_RETURN data found and transaction is not from Magic Eden");
        }
    }
};
exports.parseData = parseData;
function extractOpReturnData(vout) {
    for (const item of vout) {
        if (item.scriptpubkey_type === "op_return") {
            const scriptpubkeyAsm = item.scriptpubkey_asm;
            const parts = scriptpubkeyAsm.split(" ");
            if (parts.length > 2 && parts[0] === "OP_RETURN") {
                return parts[3];
            }
        }
    }
    return null;
}
function checkMagicEdenTransaction(vout) {
    for (const item of vout) {
        if (item.scriptpubkey_address &&
            item.scriptpubkey_address.endsWith("cjxc2")) {
            return true;
        }
    }
    return false;
}
async function fetchHexData(hexData) {
    const dataToSave = [];
    const blockString = hexData[1].toString();
    const specificNumber = hexData[2].toString();
    console.log("Block String:", blockString);
    console.log("Specific Number:", specificNumber);
    const url = `https://ord.ordinalnovus.com/rune/${blockString}:${specificNumber}`;
    console.log(url, "url");
    try {
        const response = await axios_1.default.get(url, {
            headers: { Accept: "application/json" },
        });
        const data = response.data;
        dataToSave.push(data);
    }
    catch (error) {
        console.error(`Error fetching data for block ${blockString}:`, error);
    }
    if (dataToSave.length > 0) {
        console.log("Fetched details for all blocks:", dataToSave);
        return dataToSave;
    }
    return null;
}
async function fetchMagicEdenDetails(txid, user_Tx) {
    let currentTxid = txid;
    while (true) {
        const url = `https://ord.ordinalnovus.com/output/${currentTxid}:0`;
        try {
            const response = await axios_1.default.get(url, {
                headers: { Accept: "application/json" },
            });
            const data = response.data;
            if (data.spent == false) {
                return data;
            }
            else {
                console.log("when spend is true");
                let spent = true;
                while (spent) {
                    let prevTxid = user_Tx.vin[1].txid;
                    console.log(prevTxid, "prevTxid");
                    try {
                        const output = await axios_1.default.get(`https://ord.ordinalnovus.com/output/${prevTxid}:1`, { headers: { Accept: "application/json" } });
                        const result = output.data;
                        console.log(result, "result");
                        if (result.spent === true) {
                            const response = await axios_1.default.get(`https://mempool.space/api/tx/${prevTxid}`, { headers: { Accept: "application/json" } });
                            const data = response.data;
                            console.log(data, "data");
                            prevTxid = data.vin[1].txid;
                        }
                        else {
                            console.log("when spent is false");
                            console.log(result);
                            return null;
                        }
                    }
                    catch (error) {
                        console.error("Error fetching Magic Eden details:", error);
                        return null;
                    }
                    spent = false;
                }
                return null;
            }
        }
        catch (error) {
            console.error("Error fetching Magic Eden details:", error);
            return null;
        }
    }
}
function formatRunesDetail(user_Tx, details) {
    const runes = details.runes;
    const runeEntries = Object.entries(runes);
    if (runeEntries.length === 0) {
        throw new Error("No rune details available to format");
    }
    const [rune_name, runeDetail] = runeEntries[0];
    const { amount } = runeDetail;
    const sellervalue = user_Tx.vout[1].value;
    const magicedenValue = user_Tx.vout[2].value;
    const tx_fee = user_Tx.fee;
    console.log("---------sellervalue---");
    console.log({ sellervalue, magicedenValue, tx_fee, amount }, "calculation amt");
    const total_price = sellervalue + magicedenValue + tx_fee;
    const price_per_token = total_price / amount;
    console.log({ total_price, price_per_token });
    return {
        rune_name,
        amount,
        total_price,
        price_per_token,
        to: user_Tx.vout[0].scriptpubkey_address,
        from: user_Tx.vout[1].scriptpubkey_address,
        txid: user_Tx.txid,
        vin: user_Tx.vin,
        fee: user_Tx.fee,
        parsed: true,
    };
}
async function addRunesDetailToDB(runesDetail) {
    try {
        await models_1.runesDatabase.create(runesDetail);
        console.log("Runes detail added to the database");
    }
    catch (error) {
        console.error("Error adding runes detail to the database:", error);
    }
}
function formatRuneshexDetail(user_Tx, fetchedDetails, amount) {
    const [{ entry: { spaced_rune }, id, },] = fetchedDetails;
    return {
        rune_id: id,
        rune_name: spaced_rune,
        amount,
        price_per_token: user_Tx.fee,
        to: user_Tx.vout[1].scriptpubkey_address,
        from: user_Tx.vout[2].scriptpubkey_address,
        txid: user_Tx.txid,
        vin: user_Tx.vin,
        fee: user_Tx.fee,
        parsed: true,
    };
}
//# sourceMappingURL=index.js.map