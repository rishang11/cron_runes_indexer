import dbConnect from "../../lib/dbConnect";
import { User } from "../../models";
import { v4 as uuidv4 } from 'uuid';
export async function insert_user() {
    console.log("inserting new user");

    await dbConnect();

    // Create a new user instance
    const user = new User({
        //ordinal_address: "bc1qm045gn6vk6umsq3p7qjp0z339l9ksqyt7cwnnr",
        // ordinal_address: "3BQ8sfZMwduqCjNT6jVFwbe8QCeqinwNbE",
        ordinal_address: "bc1pl4t28mhc7q9hjwd32ghupjeygzmv70yhar8u7yn2kxsk9rsf0q4qy4td2x",
        cardinal_address: "bc1plrfjt8mk0f0vxw4vd9fmsdd34uptcn58w8jhk4sqnhxfj9m0cavq62hjen",
        id: uuidv4(),
        ordinal_address_past_proccess: false,
        cardinal_address_past_proccess: false,
        ordinal_last_txid: "",
        cardinal_last_txid: "",
    });

    
    await user.save();
    console.log("User inserted successfully");
}

