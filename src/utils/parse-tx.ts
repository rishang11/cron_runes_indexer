import axios from "axios";
import { IVIN, IVOUT } from "../types/Tx";

// Define the IOutputInfo type
interface IOutputValue {
  value: number;
  script_pubkey: string;
}

export interface IOutputInfoItem {
  inscription_id: string;
  location: string;
  output: string;
  offset: number;
  output_value: IOutputValue;
  metaprotocol: string;
  address: string;
}

type IOutputInfo = IOutputInfoItem[][];

function removeFalsyValues(outputs_info: IOutputInfo) {
  return outputs_info.filter((output) => output && output.length > 0);
}

export async function fetchInscriptionsFromTX(
  txid: string,
  vin: IVIN[],
  vout: IVOUT[],
  provider: string
): Promise<any[]> {
  try {
    const apiUrl = `${provider}/api/tx/${txid}`;

    const { data } = await axios.get(apiUrl, {
      headers: { Accept: "application/json" },
    });

    const inscriptions: IOutputInfoItem[] = removeFalsyValues(
      data.outputs_info
    ).flat(1);
    if (data.inscription_count > 0) {
      return [];
    }
    if (!inscriptions || !inscriptions.length) {
      return [];
    }

    const details = inscriptions.map((i: any) => ({
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
  } catch (error) {
    console.error(`Error fetching inscriptions for txid ${txid}:`, error);
    throw new Error("Failed to fetch inscriptions");
  }
}

export async function fetchInscriptionsFromOutput(
  output: string,
  vin: IVIN[],
  vout: IVOUT[]
): Promise<any[]> {
  try {
    const apiUrl = `${process.env.PROVIDER}/api/output/${output}`;

    const { data } = await axios.get(apiUrl, {
      headers: { Accept: "application/json" },
    });
    if (!data || !data.length) {
      return [];
    }
    const details = data.map((i: any) => ({
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
  } catch (error) {
    console.error(`Error fetching inscriptions for output ${output}:`, error);
    throw new Error("Failed to fetch inscriptions");
  }
}

export async function isSiteOnline() {
  try {
    // Axios HEAD request for minimal data transfer
    await axios.head(process.env.PROVIDER || "");
    return true; // Site responded, it's online
  } catch (error) {
    // Handle network errors or non-2xx responses
    return false; // Site did not respond correctly, it might be offline
  }
}

type InputType = { address?: string; value?: number; type?: string };
type OutputType = { address?: string; value?: number; type?: string };
type ITXDATAWITHOUTTXID = {
  from: string;
  to: string;
  price: number;
  tag: string;
  marketplace: string;
  fee?: number;
  type?: "normal" | "sweep";
};

type ISaleInfo = {
  to: string;
  from: string;
  inscription_id: string;
  price: number;
  output: string;
};
export type ITXDATA = ITXDATAWITHOUTTXID & {
  saleInfo: ISaleInfo[];
};

export function constructTxData(
  inscriptions: IOutputInfoItem[],
  inputs: IVIN[],
  outputs: IVOUT[]
): ITXDATA | null {
  if (!inscriptions.length) {
    // console.debug("Inscriptions not present");
    return null;
  }
  // console.debug("Constructing transaction data...");

  const inputArray: InputType[] = inputs.map((input) => ({
    address: input.prevout?.scriptpubkey_address,
    value: input.prevout?.value,
    type: input.prevout?.scriptpubkey_type,
  }));

  const outputArray: OutputType[] = outputs.map((output) => ({
    address: output.scriptpubkey_address,
    value: output.value,
    type: output.scriptpubkey_type,
  }));

  // console.debug("Input and Output arrays constructed.");

  let tag: string | null = null;
  let to: string | null = null;
  let from: string | null = null;
  let price: number | null = null;

  if (!tag) {
    const sweepTx = checkForSweep(inputArray, outputArray, inscriptions);

    if (sweepTx) {
      // console.debug("Valid sale detected.");
      return {
        tag: sweepTx.tag,
        to: sweepTx.to,
        from: sweepTx.from,
        price: sweepTx.price,
        type: "sweep",
        // inscription_id,
        // txid: inscription_id.split("i")[0],
        marketplace: sweepTx.marketplace,
        fee: sweepTx.fee,
        saleInfo: sweepTx.saleInfo,
      };
    }
  }

  if (inputs.length >= 4 && !tag) {
    const saleInfo = checkFor4InputSale(inputArray, outputArray);

    if (saleInfo) {
      // console.debug("Valid sale detected.");
      return {
        tag: saleInfo.tag,
        to: saleInfo.to,
        from: saleInfo.from,
        price: saleInfo.price,
        // inscription_id,
        // txid: inscription_id.split("i")[0],
        marketplace: saleInfo.marketplace,
        saleInfo: [
          {
            to: saleInfo.to,
            from: saleInfo.from,
            price: saleInfo.price,
            inscription_id:
              inscriptions[inscriptions.length - 1].inscription_id,
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

  // console.log(
  //   {
  //     from,
  //     to,
  //     price,
  //     tag: tag && inscription_id ? tag : "other",
  //     inscription_id,
  //   },
  //   "RETURNING THIS"
  // );
  // console.debug("Transaction data construction completed.");
  return {
    from: from || "",
    to: to || "",
    price: price || 0,
    tag: tag && inscriptions.length ? tag : "other",
    // inscription_id,
    marketplace: "",
    saleInfo: [],
  };
}

const V1_P2TR_TYPE = "v1_p2tr";
const BC1P_PREFIX = "bc1p";

function checkFor4InputSale(
  inputArray: InputType[],
  outputArray: OutputType[]
): ITXDATAWITHOUTTXID | null {
  if (inputArray.length < 3 || outputArray.length < 3) {
    return null;
  }

  // Marketplace addresses and their corresponding names
  const marketplaces = {
    bc1qcq2uv5nk6hec6kvag3wyevp6574qmsm9scjxc2: "magiceden",
    bc1qhg8828sk4yq6ac08rxd0rh7dzfjvgdch3vfsm4: "ordinalnovus",
    bc1p6yd49679azsaxqgtr52ff6jjvj2wv5dlaqwhaxarkamevgle2jaqs8vlnr:
      "ordinalswallet",
    bc1ppq8dyvkj4le0v0v4v4mdkw20ga7l0u9fhd8wtd67cdh36x6rchtsudyat9: "satsx",
    bc1qz9fuxrcrta2ut0ad76zlse09e98x9wrr7su7u6: "ordinalnovus",
    "3P4WqXDbSLRhzo2H6MT6YFbvBKBDPLbVtQ": "magiceden",
  };

  let marketplace = "";
  let fee = 0;

  // Iterate over the marketplaces to find a match
  for (const [address, name] of Object.entries(marketplaces)) {
    if (outputArray.some((a) => a.address === address)) {
      marketplace = name;
      fee = outputArray.find((a) => a.address === address)?.value || 0;
      break; // Stop searching once a marketplace is found
    }
  }

  const isValueMatch =
    inputArray[0].value != null &&
    inputArray[1].value != null &&
    outputArray[0].value != null &&
    inputArray[0].value + inputArray[1].value === outputArray[0].value;

  if (isValueMatch) {
    const result: ITXDATAWITHOUTTXID = {
      from: inputArray[2].address || "",
      to: outputArray[1].address || "",
      price: outputArray[2]?.value || 0, // Assuming price is a number and should default to 0 if not set
      tag: "sale",
      marketplace,
      fee,
    };

    return result;
  }

  return null;
}

function checkForSweep(
  inputs: InputType[],
  outputs: OutputType[],
  inscriptions: IOutputInfoItem[]
): ITXDATA | null {
  try {
    if (inputs.length < 3 || outputs.length < 3) {
      return null;
    }

    const marketplaces = {
      bc1qcq2uv5nk6hec6kvag3wyevp6574qmsm9scjxc2: "magiceden",
      bc1qhg8828sk4yq6ac08rxd0rh7dzfjvgdch3vfsm4: "ordinalnovus",
      bc1p6yd49679azsaxqgtr52ff6jjvj2wv5dlaqwhaxarkamevgle2jaqs8vlnr:
        "ordinalswallet",
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

    // console.log({ marketplace, fee });

    const inputCount = inputs.length;
    // const outputCount = outputs.length;

    // console.log(`Number of inputs: ${inputCount}`);
    // console.log(`Number of outputs: ${outputCount}`);
    // console.log(`Number of inscriptions: ${inscriptions.length}`);

    let isSweep = false;

    // more than 1 inscription needed and input should be more than (inscriptions length + buyer input + 2 dummy utxo min)
    if (inscriptions.length > 1 && inputCount >= inscriptions.length + 1 + 2) {
      // console.log(
      //   `Checking if the first ${
      //     inscriptions.length + 1
      //   } inputs belong to the same address`
      // );

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
        } else {
          // console.warn(`Value for previous output of input ${i} is not defined`);
        }
      }

      // console.log(
      //   `Sum of the necessary input previous output values: ${sumPreviousOutputValues}`
      // );

      let saleInfo: ISaleInfo[] = [];

      if (
        sameAddress &&
        outputs.length > 0 &&
        sumPreviousOutputValues === outputs[0].value
      ) {
        // console.log(
        //   "Condition met: Sum of previous output values for the necessary inputs equals the value of the first output"
        // );
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
      } else {
        // console.log("Condition not met");
      }

      if (isSweep)
        return {
          from: saleInfo[0]?.from || "",
          to: saleInfo[0]?.to || "",
          price: saleInfo[0]?.price || 0,
          tag: "sweep",
          marketplace,
          fee,
          saleInfo,
        };
      else return null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

const checkForTransfer = (
  inputArray: InputType[],
  outputArray: OutputType[]
): ITXDATAWITHOUTTXID | null => {
  let isTransfer = false;
  let to: string | undefined;
  let from: string | undefined;

  if (outputArray.length === 1) {
    // single taproot output transfer
    for (const input of inputArray) {
      const output = outputArray[0];
      if (input.type === V1_P2TR_TYPE && output.type === V1_P2TR_TYPE) {
        isTransfer = true;
        to = output.address;
        from = inputArray.find((a) => a.type === V1_P2TR_TYPE)?.address;
        break;
      }
    }
  } else {
    // multiple outputs transfer
    for (const input of inputArray) {
      for (const output of outputArray) {
        if (
          input.value === output.value &&
          (input.type === V1_P2TR_TYPE ||
            input?.address?.startsWith(BC1P_PREFIX)) &&
          (output.type === V1_P2TR_TYPE ||
            output?.address?.startsWith(BC1P_PREFIX))
        ) {
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
  else return null;
};
