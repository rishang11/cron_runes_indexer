import dbConnect from "../lib/dbConnect";
import { User } from "../models";
import { createReconnectHandler } from "../utils";
//import { insert_user } from "../utils/new_user_watcher/insert_user";

export async function new_user_watcher() {
  try {
    await dbConnect(); // Ensures the database connection is established

    console.log("Monitoring for new activity");
  

    const changeStream = User.watch([
      {
        $match: {
          operationType: "insert",
          
          
        },
      },
    ]);

    changeStream.on("change", async (_change) => {
      console.log("received new User");

    //  const user= await User.findById(change.documentKey._id);
    // await insert_user();

    });

    changeStream.on("close", createReconnectHandler(new_user_watcher));
    changeStream.on("error", createReconnectHandler(new_user_watcher));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}


