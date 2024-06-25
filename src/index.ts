require("dotenv").config();
import express from "express";
//import { magicedenData } from "./crons/magiceden_tx";
import { parseData } from "./crons/parse_tx";
//import { insert_user } from "./utils/new_user_watcher/insert_user";
//import { fetchData } from "./crons/new_user_watcher";


 //insert_user();
  //fetchData();
 parseData();
  //magicedenData();

//new_user_watcher();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8889;

// Express middleware
app.use(express.json());

app.get("/", async (_req: any, res: any) => {
  try {
    console.log("api called")
    //const { data } = await axios.get(`https://ordinalnovus.com/api/status`);

    res.send("ok");
  } catch (error) {
    console.error("Error fetching inscriptions:", error);
    res.status(500).send("Error fetching inscriptions");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
