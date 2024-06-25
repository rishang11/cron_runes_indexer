import { model, models } from "mongoose";
import { userSchema } from "./user";
import { txSchema } from "./tx";
import { runesDatabaseSchema } from "./runesDatabase";
const User = models.User || model("User", userSchema);
const Tx= models.Tx|| model("Tx", txSchema)
const runesDatabase = models.runesDatabase || model("runesDatabase", runesDatabaseSchema)

export {
    User,
    Tx,
    runesDatabase,
};
