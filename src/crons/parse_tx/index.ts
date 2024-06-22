// import dbConnect from "../../lib/dbConnect";
// import { Tx } from "../../models";

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



  

//   console.log(vout, "vout");
// };


/****update code */
import dbConnect from "../../lib/dbConnect";
import { Tx } from "../../models";
import { decodeData } from "../../utils/decode_hex";

interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number;
}

export const parseData = async () => {
  console.log("Fetching data...");
  await dbConnect();

  const user_Tx = await Tx.findOne({
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
  } else {
    console.log("No OP_RETURN data found");
  }

  const hexData = decodeData(opReturnData);
  console.log(hexData, "hexData");
  
};

function extractOpReturnData(vout: Vout[]): string | null {
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
