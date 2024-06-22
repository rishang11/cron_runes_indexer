import { Schema, Types } from "mongoose";

export interface ISale extends Document {
  inscriptions: IInscription[];
  inscription_ids: string[];
  type: string;
  price_usd: Types.Decimal128;
  price_sat: Types.Decimal128;
  price_btc: Types.Decimal128;
  from: string;
  to: string;
  txid: string;
  timestamp: Date;
  trade_id: number;
  official_collections: ICollection[];
  token?: string;
  amount?: number;
  sat_per_token?: number;
  usd_per_token?:number;
  btc_per_token?:number;
  created_at?: Date;
  updated_at?: Date;
}

interface ICollection {
  name: string;
}

export interface SyncState {
  inscription_block: number;
  inscription: number;
  tx_block: number;
  start: number;
}

export interface IInscription {
  _id: string;
  inscription_number: number;
  inscription_id: string;
  content?: string;
  sha?: string;
  location?: string;
  output?: string;
  timestamp?: Date;
  children?: any[];
  next?: string;
  previous?: string;
  parent?: string;
  genesis_address?: string;
  genesis_fee?: number;
  genesis_height?: number;
  genesis_transaction?: string;
  flagged?: boolean;
  banned: boolean;
  reason?: string;
  updated_by?: string;
  block?: number;
  content_length?: number;
  content_type?: string;
  collection_item_name?: string;
  collection_item_number?: number;
  sat_timestamp?: Date;
  cycle?: number;
  decimal?: string;
  degree?: string;
  epoch?: number;
  percentile?: string;
  period?: number;
  rarity?: string;

  sat?: number;
  sat_name?: string;
  sat_offset?: number;
  lists?: Schema.Types.ObjectId[];
  tags?: string[];
  error?: boolean;
  error_retry?: number;
  error_tag?: string;
  offset?: number;
  output_value?: number;
  address?: string;
  listed?: boolean;
  listed_at?: Date;
  listed_price?: number;
  listed_maker_fee_bp?: number;
  tap_internal_key?: string;
  listed_seller_receive_address?: string;
  signed_psbt?: string;
  unsigned_psbt?: string;
  in_mempool: boolean;
  txid: string;
  sat_block_time?: Date;
  sattributes?: string[];
  last_checked?: Date;
  version?: number;
  token?: boolean;
  domain_valid?: boolean;

  // v12.1.3
  metadata?: {
    [x: string]: string;
  };
  metaprotocol?: string;
  parsed_metaprotocol?: string[];
  charms?: number;
  cbrc_valid?: boolean;
}
