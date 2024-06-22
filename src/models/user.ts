import { Schema } from "mongoose";


export const userSchema = new Schema(
  {
    ordinal_address: { type: String, required: true ,unique: true},
    cardinal_address: { type: String, required: true,unique: true},
    id: { type: String, required: true,unique: true},
    ordinal_address_past_processed: { type: String, required: true, default: false},
    cardinal_address_past_processed: { type: String, required: true,default: false},
    ordinal_last_txid: { type: String },
    cardinal_last_txid: { type: String },
    icon: { type: String},
  },
  {
    timestamps: true, // Enable automatic timestamps (createdAt, updatedAt)
  }
);
