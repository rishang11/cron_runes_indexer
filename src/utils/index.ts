import fs from "fs";
import path from "path";
import { SyncState } from "../types";
import axios from "axios";
const SYNC_FILE_PATH = path.join(__dirname, "../../sync-state.json");

export const pauseCronJob = (job: any, time = 10 * 60 * 60) => {
  if (job) {
    // console.log(`Pausing cron job for ${time / 3600} minutes...`);
    job.stop(); // Stop the job
    setTimeout(() => {
      // console.log("Resuming cron job...");
      job.start(); // Restart the job after  minutes
    }, time); //  in milliseconds
  }
};

export function wait(seconds = 10) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function stringToHex(str: string) {
  return Buffer.from(str.toLowerCase(), "utf-8").toString("hex");
}

export async function fetchProvider(): Promise<string> {
  const urls: string[] = [];

  if (process.env.PROVIDER && process.env.PROVIDER.includes("https")) {
    urls.push(process.env.PROVIDER);
  } else if (process.env.PROVIDER && process.env.PROVIDER.includes("http://")) {
    urls.push(`${process.env.PROVIDER}:8080`);
    urls.push(`${process.env.PROVIDER}:8081`);
  }
  // console.log({ urls });
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }
  return "";
}

export const readSyncState = (): SyncState => {
  try {
    const fileContent = fs.readFileSync(SYNC_FILE_PATH, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return {
      inscription_block: 767429,
      inscription: 0,
      tx_block: 818154,
      start: 767429,
    }; // Default state
  }
};

export const writeSyncState = (state: SyncState) => {
  fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify(state, null, 2), "utf8");
};

export default async function fetchContentFromProviders(contentId: string) {
  try {
    const url = `${process.env.PROVIDER}/content/${contentId}`;
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return response;
  } catch (error: any) {
    // console.log(error);
    // console.log("err fetching content: ", contentId);
    return null;
    // throw Error("Err Fetching Content: " + contentId);
  }
}

let btcPriceCache: { price: number | null; timestamp: Date | null } = {
  price: null,
  timestamp: null,
};

export async function getBTCPriceInDollars(): Promise<number> {
  const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
  const currentTime = new Date();

  // Check if cache is valid
  if (
    btcPriceCache.price &&
    btcPriceCache.timestamp &&
    currentTime.getTime() - btcPriceCache.timestamp.getTime() < tenMinutes
  ) {
    return btcPriceCache.price; // Return cached price
  }

  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/prices/BTC-USD/spot"
    );
    const data = await response.json();
    const priceInDollars = Number(data["data"]["amount"]);

    // Update cache
    btcPriceCache.price = priceInDollars;
    btcPriceCache.timestamp = currentTime;

    return priceInDollars;
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    throw Error("BTC Price Fetch Error");
  }
}

export function shortenString(str: string, length?: number): string {
  if (str.length <= (length || 8)) {
    return str;
  }
  const start = str.slice(0, 4);
  const end = str.slice(-4);
  return `${start}...${end}`;
}

// ReconnectionHandler.ts
export function createReconnectHandler(
  reconnectCallback: () => void,
  delayInSeconds: number = 10
) {
  return function handleReconnect() {
    console.log(
      "Stream closed or encountered an error. Attempting to reconnect..."
    );
    setTimeout(reconnectCallback, delayInSeconds * 1000); // Reconnect after the specified delay
  };
}
