import { Schema } from "mongoose";

export const runesDatabaseSchema = new Schema(
  {
    rune_id:{ type: String, required: true,unique: true,default: false},
    rune_name:{ type: String, required: true,default: false,},
    amount:{ type: Number, required: true},
    total_price:{ type: Number, required:true,default:false},
    price_per_token:{ type: Number, required:true},
    to:{ type: String, required: true},
    from:{ type: String, required: true},
    txid: { type: String, required: true, unique: true },
    vin:{ type: Array, required: true },
    fee: { type: Number, required: true },
    parsed:{type:Boolean,required:true,default:false},
  },
  {
    timestamps: true, // Enable automatic timestamps (createdAt, updatedAt)
  }
);


