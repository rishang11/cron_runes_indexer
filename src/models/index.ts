import { model, models } from "mongoose";
import { userSchema } from "./user";
import { txSchema } from "./tx";
const User = models.User || model("User", userSchema);
const Tx= models.Tx|| model("Tx", txSchema)

export {
    User,
    Tx
};
