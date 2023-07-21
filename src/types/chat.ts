import { CardFile } from "./card";
import { Trade } from "./trade";
import { User } from "./user";

export interface TradeChat {
    id: number;
    message: string;
    trade?: Trade | null;
    from?: User | null;
    type: TradeChatType;
    images?: CardFile[] | null;
    status?: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }

  export interface TradeChatType {
    id: number;
    name: string;
  }