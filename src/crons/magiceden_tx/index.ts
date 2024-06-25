
// // /****update code */
// // import dbConnect from "../../lib/dbConnect";
// // import { Tx } from "../../models";
// // import { decodeData } from "../../utils/decode_hex";

// // interface Vout {
// //   scriptpubkey: string;
// //   scriptpubkey_asm: string;
// //   scriptpubkey_type: string;
// //   scriptpubkey_address?: string;
// //   value: number;
// // }

// // export const parseData = async () => {
// //   console.log("Fetching data...");
// //   await dbConnect();

// //   const user_Tx = await Tx.findOne({
// //     parsed: false,
// //   });

// //   if (!user_Tx) {
// //     console.log("No user_Tx found with parsed: false");
// //     return;
// //   }
// //   console.log(user_Tx, "user_Tx");

// //   const { vout } = user_Tx;
// //   if (!vout) {
// //     console.log("No vout data available");
// //     return;
// //   }

// //   console.log("------------------------------------------------------------");
// //   console.log(vout, "vout");
// //   console.log("///////////////////////////////////////////////////////");

// //   const opReturnData = extractOpReturnData(vout);

// //   if (opReturnData) {
// //     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
// //   } else {
// //     console.log("No OP_RETURN data found");
// //   }

// //   const hexData = decodeData(opReturnData);
// //   console.log(hexData, "hexData");
  
// // };

// // function extractOpReturnData(vout: Vout[]): string | null {
// //   for (const item of vout) {
// //     if (item.scriptpubkey_type === "op_return") {
// //       const scriptpubkeyAsm = item.scriptpubkey_asm;
// //       const parts = scriptpubkeyAsm.split(" ");
// //       if (parts.length > 2 && parts[0] === "OP_RETURN") {
// //         return parts[3];
// //       }
// //     }
// //   }
// //   return null;
// // }


// /*****magic eden *** */
// // import dbConnect from "../../lib/dbConnect";
// // import { Tx } from "../../models";
// // import { decodeData } from "../../utils/decode_hex";

// // interface Vout {
// //   scriptpubkey: string;
// //   scriptpubkey_asm: string;
// //   scriptpubkey_type: string;
// //   scriptpubkey_address?: string;
// //   value: number;
// // }

// // // Assume user_Tx has the following interface based on context
// // interface UserTx {
// //   _id: string;
// //   parsed: boolean;
// //   vout: Vout[];
// //   txid: string; // Assuming txid is present, adjust if not
// // }

// // export const parseData = async () => {
// //   console.log("Fetching data...");
// //   await dbConnect();

// //   const user_Tx: UserTx | null = await Tx.findOne({
// //     parsed: false,
// //   });

// //   if (!user_Tx) {
// //     console.log("No user_Tx found with parsed: false");
// //     return;
// //   }
// //   console.log(user_Tx, "user_Tx");

// //   const { vout } = user_Tx;
// //   if (!vout || !vout.length) {
// //     console.log("No vout data available");
// //     return;
// //   }

// //   console.log("------------------------------------------------------------");
// //   console.log(vout, "vout");
// //   console.log("///////////////////////////////////////////////////////");

// //   const opReturnData = extractOpReturnData(vout, user_Tx);
// //   console.log(opReturnData, "opReturnData");

// // //   if (opReturnData) {
// // //     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
// // //     const hexData = decodeData(opReturnData);
// // //     console.log(hexData, "hexData");
// // //   } else {
// // //     console.log("No OP_RETURN data found");
// // //   }

// //   // Update the parsed field to true
// //   await Tx.updateOne({ _id: user_Tx._id }, { parsed: true });
// // };

// // function extractOpReturnData(vout: Vout[], user_Tx: UserTx): string | null {
// //   for (const item of vout) {
// //     if (item.scriptpubkey_type === "op_return") {
// //       const scriptpubkeyAsm = item.scriptpubkey_asm;
// //       const parts = scriptpubkeyAsm.split(" ");
// //       if (parts.length > 1 && parts[0] === "OP_RETURN") {
// //         // Adjust the index if needed, typically the data follows directly after "OP_RETURN"
// //         return parts[1];
// //       }
// //     } else if (item.scriptpubkey_address?.endsWith("cjxc2")) {
// //       // Assuming you want to log the txid if address ends with "cjxc2"
// //       const {txid} = user_Tx;
// //       return txid;
      
// //     }
// //   }
// //   return null;
// // }



// /***** new */
// import dbConnect from "../../lib/dbConnect";
// import { Tx } from "../../models";
// import { decodeData } from "../../utils/decode_hex";
// import axios from "axios";
// interface Vout {
//   scriptpubkey: string;
//   scriptpubkey_asm: string;
//   scriptpubkey_type: string;
//   scriptpubkey_address?: string;
//   value: number;
// }
// export const parseData = async () => {
//   console.log("Fetching data...");
//   await dbConnect();
//   const user_Tx = await Tx.findOne({
//     parsed: false,
//   });
//   if (!user_Tx) {
//     console.log("No user_Tx found with parsed: false");
//     return;
//   }
//   console.log(user_Tx, "user_Tx");
//   const { vout } = user_Tx;
//   if (!vout) {
//     console.log("No vout data available");
//     return;
//   }
//   console.log("------------------------------------------------------------");
//   console.log(vout, "vout");
//   console.log("///////////////////////////////////////////////////////");
//   const opReturnData = extractOpReturnData(vout);
//   if (opReturnData) {
//     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
//     const hexData = decodeData(opReturnData);
//     console.log(hexData, "hexData");
//   } else {
//     const isMagicEden = checkMagicEdenTransaction(vout);
//     if (isMagicEden) {
//       console.log("Transaction is from Magic Eden");
//       const txid = user_Tx.txid;
//       const details = await fetchMagicEdenDetails(txid);
//       console.log(details, "Magic Eden Transaction Details");
//     } else {
//       console.log("No OP_RETURN data found and transaction is not from Magic Eden");
//     }
//   }
// };
// function extractOpReturnData(vout: Vout[]): string | null {
//   for (const item of vout) {
//     if (item.scriptpubkey_type === "op_return") {
//       const scriptpubkeyAsm = item.scriptpubkey_asm;
//       const parts = scriptpubkeyAsm.split(" ");
//       if (parts.length > 2 && parts[0] === "OP_RETURN") {
//         return parts[3];
//       }
//     }
//   }
//   return null;
// }
// function checkMagicEdenTransaction(vout: Vout[]): boolean {
//   for (const item of vout) {
//     if (item.scriptpubkey_address && item.scriptpubkey_address.endsWith("cjxc2")) {
//       return true;
//     }
//   }
//   return false;
// }
// async function fetchMagicEdenDetails(txid: string): Promise<any> {
//   let currentTxid = txid;
//   while (true) {
//     const url = `https://ord.ordinalnovus.com/output/${currentTxid}:0`;
//     try {
//       const response = await axios.get(url, { headers:{
//         "Accept": "application/json"
//       }});
//       const data = response.data;
//       if (data.spent) {
//         currentTxid = data.txid;
//       } else {
//         return data;
//       }
//     } catch (error) {
//       console.error("Error fetching Magic Eden details:", error);
//       return null;
//     }
//   }
// }

/********************** */
// /****update code */
// import dbConnect from "../../lib/dbConnect";
// import { Tx } from "../../models";
// import { decodeData } from "../../utils/decode_hex";

// interface Vout {
//   scriptpubkey: string;
//   scriptpubkey_asm: string;
//   scriptpubkey_type: string;
//   scriptpubkey_address?: string;
//   value: number;
// }

// export const parseData = async () => {
//   console.log("Fetching data...");
//   await dbConnect();

//   const user_Tx = await Tx.findOne({
//     parsed: false,
//   });

//   if (!user_Tx) {
//     console.log("No user_Tx found with parsed: false");
//     return;
//   }
//   console.log(user_Tx, "user_Tx");

//   const { vout } = user_Tx;
//   if (!vout) {
//     console.log("No vout data available");
//     return;
//   }

//   console.log("------------------------------------------------------------");
//   console.log(vout, "vout");
//   console.log("///////////////////////////////////////////////////////");

//   const opReturnData = extractOpReturnData(vout);

//   if (opReturnData) {
//     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
//   } else {
//     console.log("No OP_RETURN data found");
//   }

//   const hexData = decodeData(opReturnData);
//   console.log(hexData, "hexData");
  
// };

// function extractOpReturnData(vout: Vout[]): string | null {
//   for (const item of vout) {
//     if (item.scriptpubkey_type === "op_return") {
//       const scriptpubkeyAsm = item.scriptpubkey_asm;
//       const parts = scriptpubkeyAsm.split(" ");
//       if (parts.length > 2 && parts[0] === "OP_RETURN") {
//         return parts[3];
//       }
//     }
//   }
//   return null;
// }


/*****magic eden *** */
// import dbConnect from "../../lib/dbConnect";
// import { Tx } from "../../models";
// import { decodeData } from "../../utils/decode_hex";

// interface Vout {
//   scriptpubkey: string;
//   scriptpubkey_asm: string;
//   scriptpubkey_type: string;
//   scriptpubkey_address?: string;
//   value: number;
// }

// // Assume user_Tx has the following interface based on context
// interface UserTx {
//   _id: string;
//   parsed: boolean;
//   vout: Vout[];
//   txid: string; // Assuming txid is present, adjust if not
// }

// export const parseData = async () => {
//   console.log("Fetching data...");
//   await dbConnect();

//   const user_Tx: UserTx | null = await Tx.findOne({
//     parsed: false,
//   });

//   if (!user_Tx) {
//     console.log("No user_Tx found with parsed: false");
//     return;
//   }
//   console.log(user_Tx, "user_Tx");

//   const { vout } = user_Tx;
//   if (!vout || !vout.length) {
//     console.log("No vout data available");
//     return;
//   }

//   console.log("------------------------------------------------------------");
//   console.log(vout, "vout");
//   console.log("///////////////////////////////////////////////////////");

//   const opReturnData = extractOpReturnData(vout, user_Tx);
//   console.log(opReturnData, "opReturnData");

// //   if (opReturnData) {
// //     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
// //     const hexData = decodeData(opReturnData);
// //     console.log(hexData, "hexData");
// //   } else {
// //     console.log("No OP_RETURN data found");
// //   }

//   // Update the parsed field to true
//   await Tx.updateOne({ _id: user_Tx._id }, { parsed: true });
// };

// function extractOpReturnData(vout: Vout[], user_Tx: UserTx): string | null {
//   for (const item of vout) {
//     if (item.scriptpubkey_type === "op_return") {
//       const scriptpubkeyAsm = item.scriptpubkey_asm;
//       const parts = scriptpubkeyAsm.split(" ");
//       if (parts.length > 1 && parts[0] === "OP_RETURN") {
//         // Adjust the index if needed, typically the data follows directly after "OP_RETURN"
//         return parts[1];
//       }
//     } else if (item.scriptpubkey_address?.endsWith("cjxc2")) {
//       // Assuming you want to log the txid if address ends with "cjxc2"
//       const {txid} = user_Tx;
//       return txid;
      
//     }
//   }
//   return null;


//////////////////////////parse_tx/////////////////////////////
// import dbConnect from "../../lib/dbConnect";
// import { Tx, runesDatabase } from "../../models";
// import { decodeData } from "../../utils/decode_hex";
// import axios from "axios";

// interface Vout {
//   scriptpubkey: string;
//   scriptpubkey_asm: string;
//   scriptpubkey_type: string;
//   scriptpubkey_address?: string;
//   value: number;
// }

// export const parseData = async () => {
//   console.log("Fetching data...");
//   await dbConnect();
//   const user_Tx = await Tx.findOne({
//     parsed: false,
//   });
//   if (!user_Tx) {
//     console.log("No user_Tx found with parsed: false");
//     return;
//   }
//   console.log(user_Tx, "user_Tx");
//   const { vout } = user_Tx;
//   if (!vout) {
//     console.log("No vout data available");
//     return;
//   }
//   console.log("------------------------------------------------------------");
//   console.log(vout, "vout");
//   console.log("///////////////////////////////////////////////////////");
  
//   const opReturnData = extractOpReturnData(vout);
//   if (opReturnData) {
//     console.log(`Extracted OP_RETURN data: ${opReturnData}`);
//     const hexData = decodeData(opReturnData);
//     console.log(hexData, "hexData");

    
//   } else {
//     const isMagicEden = checkMagicEdenTransaction(vout);
//     if (isMagicEden) {
//       console.log("Transaction is from Magic Eden");
//       const txid = user_Tx.txid;
//       const details = await fetchMagicEdenDetails(txid);
//       console.log(details, "Magic Eden Transaction Details");

//       if (details) {
//         // Extract required details
//         const runesDetail = formatRunesDetail(user_Tx, details);
//         console.log(runesDetail, "Formatted Runes Detail");

//         //Save to database
//         await addRunesDetailToDB(runesDetail);
//       }
//     } else {
//       console.log("No OP_RETURN data found and transaction is not from Magic Eden");
//     }
//   }

 
// };

// // Helper function to extract OP_RETURN data
// function extractOpReturnData(vout: Vout[]): string | null {
//   for (const item of vout) {
//     if (item.scriptpubkey_type === "op_return") {
//       const scriptpubkeyAsm = item.scriptpubkey_asm;
//       const parts = scriptpubkeyAsm.split(" ");
//       if (parts.length > 2 && parts[0] === "OP_RETURN") {
//         return parts[3];
//       }
//     }
//   }
//   return null;
// }

// // Helper function to check if transaction is from Magic Eden
// function checkMagicEdenTransaction(vout: Vout[]): boolean {
//   for (const item of vout) {
//     if (item.scriptpubkey_address && item.scriptpubkey_address.endsWith("cjxc2")) {
//       return true;
//     }
//   }
//   return false;
// }

// // Fetch Magic Eden transaction details
// async function fetchMagicEdenDetails(txid: string): Promise<any> {
//   let currentTxid = txid;
//   while (true) {
//     const url = `https://ord.ordinalnovus.com/output/${currentTxid}:0`;
//     try {
//       const response = await axios.get(url, { headers: { "Accept": "application/json" } });
//       const data = response.data;
//       if (data.spent == false) {
//         return data;
//       } else {

//         // if spend is true  then check vin 2 find the txid then call this api 
//         //https://mempool.space/api/tx/4f793bd498d6825c62b0be24c4fd7c5a769518e90bea86cd0eba49cbedb7b5ba
//         return null; // If spent is true, return null
        
//       }
//     } catch (error) {
//       console.error("Error fetching Magic Eden details:", error);
//       return null;
//     }
//   }
// }

// // Format runes details
// function formatRunesDetail(user_Tx: any, details: any) {
//   const runes = details.runes; // Assuming details contain a 'runes' field
//   const runeEntries = Object.entries(runes);
//   if (runeEntries.length === 0) {
//     throw new Error("No rune details available to format");
//   }

//   // Extract the first rune for simplicity; adjust as needed
//   const [rune_name, runeDetail] = runeEntries[0];
//   //@ts-ignore
//   const amount = runeDetail.amount;

//   const sellervalue = user_Tx.vout[1].value;
//   const magicedenValue = user_Tx.vout[2].value;
//   const tx_fee = user_Tx.fee;

//   console.log("---------sellervalue---")
//   console.log({sellervalue, magicedenValue, tx_fee,amount},"calculation amt");



  


//   const total_price = sellervalue + magicedenValue + tx_fee
//   const price_per_token = (sellervalue + magicedenValue + tx_fee)/amount;

//   console.log({total_price, price_per_token});

  

//   return {
//     rune_name,
//     amount,
//     total_price,
//     price_per_token,
//     to: user_Tx.vout[0].scriptpubkey_address,
//     from: user_Tx.vout[1].scriptpubkey_address,
//     txid: user_Tx.txid,
//     vin: user_Tx.vin,
//     fee: user_Tx.fee,
//     parsed: true,
//   };
// }


// async function addRunesDetailToDB(runesDetail: any) {
//   try {
//     await runesDatabase.create(runesDetail);
//     console.log("Runes detail added to the database");
//   } catch (error) {
//     console.error("Error adding runes detail to the database:", error);
//   }
// }


