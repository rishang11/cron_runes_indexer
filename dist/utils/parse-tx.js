"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructTxData = exports.isSiteOnline = exports.fetchInscriptionsFromOutput = exports.fetchInscriptionsFromTX = void 0;
const axios_1 = __importDefault(require("axios"));
function removeFalsyValues(outputs_info) {
    return outputs_info.filter((output) => output && output.length > 0);
}
async function fetchInscriptionsFromTX(txid, vin, vout, provider) {
    try {
        const apiUrl = `${provider}/api/tx/${txid}`;
        const { data } = await axios_1.default.get(apiUrl, {
            headers: { Accept: "application/json" },
        });
        const inscriptions = removeFalsyValues(data.outputs_info).flat(1);
        if (data.inscription_count > 0) {
            return [];
        }
        if (!inscriptions || !inscriptions.length) {
            return [];
        }
        const details = inscriptions.map((i) => ({
            inscription_id: i.inscription_id,
            txData: constructTxData(inscriptions, vin, vout),
            body: {
                address: i.address,
                location: i.location,
                offset: Number(i.offset),
                output: i.output,
                output_value: Number(i.output_value.value),
                listed: false,
                listed_at: new Date(),
                listed_price: 0,
                listed_maker_fee_bp: 0,
                tap_internal_key: "",
                listed_seller_receive_address: "",
                signed_psbt: "",
                unsigned_psbt: "",
                in_mempool: false,
                txid: i.location.split(":")[0],
                ...(i.metaprotocol && { metaprotocol: i.metaprotocol }),
            },
        }));
        return details;
    }
    catch (error) {
        console.error(`Error fetching inscriptions for txid ${txid}:`, error);
        throw new Error("Failed to fetch inscriptions");
    }
}
exports.fetchInscriptionsFromTX = fetchInscriptionsFromTX;
async function fetchInscriptionsFromOutput(output, vin, vout) {
    try {
        const apiUrl = `${process.env.PROVIDER}/api/output/${output}`;
        const { data } = await axios_1.default.get(apiUrl, {
            headers: { Accept: "application/json" },
        });
        if (!data || !data.length) {
            return [];
        }
        const details = data.map((i) => ({
            inscription_id: i.inscription_id,
            txData: constructTxData(i.inscription_id, vin, vout),
            body: {
                location: i.location,
                offset: Number(i.offset),
                address: i.address,
                output: i.output,
                output_value: Number(i.output_value.value),
                listed: false,
                listed_at: new Date(),
                listed_price: 0,
                listed_maker_fee_bp: 0,
                tap_internal_key: "",
                listed_seller_receive_address: "",
                signed_psbt: "",
                unsigned_psbt: "",
                in_mempool: false,
                txid: i.location.split(":")[0],
                ...(i.metaprotocol && { metaprotocol: i.metaprotocol }),
            },
        }));
        return details;
    }
    catch (error) {
        console.error(`Error fetching inscriptions for output ${output}:`, error);
        throw new Error("Failed to fetch inscriptions");
    }
}
exports.fetchInscriptionsFromOutput = fetchInscriptionsFromOutput;
async function isSiteOnline() {
    try {
        await axios_1.default.head(process.env.PROVIDER || "");
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isSiteOnline = isSiteOnline;
function constructTxData(inscriptions, inputs, outputs) {
    if (!inscriptions.length) {
        return null;
    }
    const inputArray = inputs.map((input) => {
        var _a, _b, _c;
        return ({
            address: (_a = input.prevout) === null || _a === void 0 ? void 0 : _a.scriptpubkey_address,
            value: (_b = input.prevout) === null || _b === void 0 ? void 0 : _b.value,
            type: (_c = input.prevout) === null || _c === void 0 ? void 0 : _c.scriptpubkey_type,
        });
    });
    const outputArray = outputs.map((output) => ({
        address: output.scriptpubkey_address,
        value: output.value,
        type: output.scriptpubkey_type,
    }));
    let tag = null;
    let to = null;
    let from = null;
    let price = null;
    if (!tag) {
        const sweepTx = checkForSweep(inputArray, outputArray, inscriptions);
        if (sweepTx) {
            return {
                tag: sweepTx.tag,
                to: sweepTx.to,
                from: sweepTx.from,
                price: sweepTx.price,
                type: "sweep",
                marketplace: sweepTx.marketplace,
                fee: sweepTx.fee,
                saleInfo: sweepTx.saleInfo,
            };
        }
    }
    if (inputs.length >= 4 && !tag) {
        const saleInfo = checkFor4InputSale(inputArray, outputArray);
        if (saleInfo) {
            return {
                tag: saleInfo.tag,
                to: saleInfo.to,
                from: saleInfo.from,
                price: saleInfo.price,
                marketplace: saleInfo.marketplace,
                saleInfo: [
                    {
                        to: saleInfo.to,
                        from: saleInfo.from,
                        price: saleInfo.price,
                        inscription_id: inscriptions[inscriptions.length - 1].inscription_id,
                        output: inscriptions[inscriptions.length - 1].output,
                    },
                ],
                fee: saleInfo.fee,
            };
        }
    }
    if (!tag) {
        const transferCheck = checkForTransfer(inputArray, outputArray);
        if (transferCheck) {
            tag = transferCheck.tag;
            to = transferCheck.to;
            from = transferCheck.from;
        }
    }
    return {
        from: from || "",
        to: to || "",
        price: price || 0,
        tag: tag && inscriptions.length ? tag : "other",
        marketplace: "",
        saleInfo: [],
    };
}
exports.constructTxData = constructTxData;
const V1_P2TR_TYPE = "v1_p2tr";
const BC1P_PREFIX = "bc1p";
function checkFor4InputSale(inputArray, outputArray) {
    var _a, _b;
    if (inputArray.length < 3 || outputArray.length < 3) {
        return null;
    }
    const marketplaces = {
        bc1qcq2uv5nk6hec6kvag3wyevp6574qmsm9scjxc2: "magiceden",
        bc1qhg8828sk4yq6ac08rxd0rh7dzfjvgdch3vfsm4: "ordinalnovus",
        bc1p6yd49679azsaxqgtr52ff6jjvj2wv5dlaqwhaxarkamevgle2jaqs8vlnr: "ordinalswallet",
        bc1ppq8dyvkj4le0v0v4v4mdkw20ga7l0u9fhd8wtd67cdh36x6rchtsudyat9: "satsx",
        bc1qz9fuxrcrta2ut0ad76zlse09e98x9wrr7su7u6: "ordinalnovus",
        "3P4WqXDbSLRhzo2H6MT6YFbvBKBDPLbVtQ": "magiceden",
    };
    let marketplace = "";
    let fee = 0;
    for (const [address, name] of Object.entries(marketplaces)) {
        if (outputArray.some((a) => a.address === address)) {
            marketplace = name;
            fee = ((_a = outputArray.find((a) => a.address === address)) === null || _a === void 0 ? void 0 : _a.value) || 0;
            break;
        }
    }
    const isValueMatch = inputArray[0].value != null &&
        inputArray[1].value != null &&
        outputArray[0].value != null &&
        inputArray[0].value + inputArray[1].value === outputArray[0].value;
    if (isValueMatch) {
        const result = {
            from: inputArray[2].address || "",
            to: outputArray[1].address || "",
            price: ((_b = outputArray[2]) === null || _b === void 0 ? void 0 : _b.value) || 0,
            tag: "sale",
            marketplace,
            fee,
        };
        return result;
    }
    return null;
}
function checkForSweep(inputs, outputs, inscriptions) {
    var _a, _b, _c;
    try {
        if (inputs.length < 3 || outputs.length < 3) {
            return null;
        }
        const marketplaces = {
            bc1qcq2uv5nk6hec6kvag3wyevp6574qmsm9scjxc2: "magiceden",
            bc1qhg8828sk4yq6ac08rxd0rh7dzfjvgdch3vfsm4: "ordinalnovus",
            bc1p6yd49679azsaxqgtr52ff6jjvj2wv5dlaqwhaxarkamevgle2jaqs8vlnr: "ordinalswallet",
            bc1ppq8dyvkj4le0v0v4v4mdkw20ga7l0u9fhd8wtd67cdh36x6rchtsudyat9: "satsx",
            bc1qz9fuxrcrta2ut0ad76zlse09e98x9wrr7su7u6: "ordinalnovus",
            "3P4WqXDbSLRhzo2H6MT6YFbvBKBDPLbVtQ": "magiceden",
        };
        let marketplace = "";
        let fee = 0;
        for (const [address, name] of Object.entries(marketplaces)) {
            const matchingOutput = outputs.find((a) => a.address === address);
            if (matchingOutput) {
                marketplace = name;
                fee = matchingOutput.value || 0;
                break;
            }
        }
        const inputCount = inputs.length;
        let isSweep = false;
        if (inscriptions.length > 1 && inputCount >= inscriptions.length + 1 + 2) {
            let sameAddress = true;
            const firstAddress = inputs[0].address;
            let sumPreviousOutputValues = 0;
            for (let i = 0; i < inscriptions.length + 1; i++) {
                if (inputs[i].address !== firstAddress) {
                    sameAddress = false;
                    break;
                }
                if (inputs[i].value !== undefined) {
                    sumPreviousOutputValues += inputs[i].value || 0;
                }
                else {
                }
            }
            let saleInfo = [];
            if (sameAddress &&
                outputs.length > 0 &&
                sumPreviousOutputValues === outputs[0].value) {
                isSweep = true;
                inscriptions.forEach((inscription) => {
                    const inscription_id = inscription.inscription_id;
                    const output = inscription.output;
                    const pos = parseInt(output.split(":")[1]);
                    const to = outputs[pos].address || "";
                    const from = inputs[inscriptions.length + pos].address || "";
                    const price = outputs[1 + inscriptions.length + pos].value;
                    saleInfo.push({
                        to,
                        from,
                        inscription_id,
                        price: price || 0,
                        output,
                    });
                });
            }
            else {
            }
            if (isSweep)
                return {
                    from: ((_a = saleInfo[0]) === null || _a === void 0 ? void 0 : _a.from) || "",
                    to: ((_b = saleInfo[0]) === null || _b === void 0 ? void 0 : _b.to) || "",
                    price: ((_c = saleInfo[0]) === null || _c === void 0 ? void 0 : _c.price) || 0,
                    tag: "sweep",
                    marketplace,
                    fee,
                    saleInfo,
                };
            else
                return null;
        }
        return null;
    }
    catch (e) {
        return null;
    }
}
const checkForTransfer = (inputArray, outputArray) => {
    var _a, _b, _c;
    let isTransfer = false;
    let to;
    let from;
    if (outputArray.length === 1) {
        for (const input of inputArray) {
            const output = outputArray[0];
            if (input.type === V1_P2TR_TYPE && output.type === V1_P2TR_TYPE) {
                isTransfer = true;
                to = output.address;
                from = (_a = inputArray.find((a) => a.type === V1_P2TR_TYPE)) === null || _a === void 0 ? void 0 : _a.address;
                break;
            }
        }
    }
    else {
        for (const input of inputArray) {
            for (const output of outputArray) {
                if (input.value === output.value &&
                    (input.type === V1_P2TR_TYPE ||
                        ((_b = input === null || input === void 0 ? void 0 : input.address) === null || _b === void 0 ? void 0 : _b.startsWith(BC1P_PREFIX))) &&
                    (output.type === V1_P2TR_TYPE ||
                        ((_c = output === null || output === void 0 ? void 0 : output.address) === null || _c === void 0 ? void 0 : _c.startsWith(BC1P_PREFIX)))) {
                    isTransfer = true;
                    from = input.address;
                    to = output.address;
                    break;
                }
            }
            if (isTransfer) {
                break;
            }
        }
    }
    if (isTransfer && to && from)
        return { tag: "transfer", to, from, price: 0, marketplace: "" };
    else
        return null;
};
//# sourceMappingURL=parse-tx.js.map