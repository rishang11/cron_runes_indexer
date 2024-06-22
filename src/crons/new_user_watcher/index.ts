import dbConnect from "../../lib/dbConnect";
import { Tx, User } from "../../models";
import axios from "axios";
import { wait } from "../../utils";

const LIMIT_BLOCKHEIGHT = 840000;

export const fetchData = async () => {
  try {
    console.log("Fetching data...");
    await dbConnect();

    const user = await User.findOne({
      ordinal_address_past_processed: false,
    });

    if (!user) {
      console.log("No user found with ordinal_address_past_processed: false");
      return;
    }
    console.log(user, "user");

    const { ordinal_address } = user;

    let search_more = true;
    let last_txid = user.ordinal_last_txid || "";
    while (search_more) {
      console.log("inside loop");
      try {

        // const url = `https://mempool.space/api/address/${ordinal_address}/txs/chain${ last_txid && "/after_txid" + last_txid}`;
        const url = `https://mempool.space/api/address/${ordinal_address}/txs?after_txid=${last_txid}`;
        const response = await axios.get(url);
        console.log(url, "url");

        if (response.status === 200) {
          console.log(response.data, "response ");

          if (response.data.length === 0) {
            search_more = false;
            console.log("when response is empty then out of loop");
            break;
          }

          if (response.data[response.data.length - 1].status.block_height < LIMIT_BLOCKHEIGHT) {
            console.log(
              "Block height is less than 840000",
              response.data[response.data.length - 1].status.block_height
            );
            search_more = false;
          }

          console.log(search_more, "search_more before addTxToDB");

          last_txid = response.data[response.data.length - 1].txid;
          await addTxToDB(response.data);

          console.log(search_more, "search_more after addTxToDB");

          user.ordinal_last_txid = last_txid;
          await user.save();
        }

        console.log(search_more, "search_more at end of loop");

        await wait(1);
      } catch (e: any) {
        console.error("Error fetching data:", e);
       
        search_more = false;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

async function addTxToDB(txes: any) {
  for (const tx of txes) {
    await Tx.create(tx);
  }
}
