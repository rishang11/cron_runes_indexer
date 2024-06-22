import { Schema } from "mongoose";

export const txSchema = new Schema(
  {
    txid: { type: String, required: true, unique: true },
    version: { type: Number, required: true },
    locktime: { type: Number, required: true },
    vin:{ type: Array, required: true },
    vout:{ type: Array, required: true},
    size: { type: Number, required: true },
    weight: { type: Number, required: true },
    sigops: { type: Number, required: true },
    fee: { type: Number, required: true },
    status: {
      confirmed: { type: Boolean, required: true },
      block_height: { type: Number, required: true },
      block_hash: { type: String, required: true },
      block_time: { type: Number, required: true },
    },
    parsed:{type:Boolean,required:true,default:false},
  },
  {
    timestamps: true, // Enable automatic timestamps (createdAt, updatedAt)
  }
);


//create index

txSchema.index({ parsed: 1 });
