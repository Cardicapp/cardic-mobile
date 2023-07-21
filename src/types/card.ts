import { TradeChat } from "./chat";
import { Trade } from "./trade";

export interface CardFile {
    id: number;
    name: string;
    fileName: string;
    trade: Trade | null;
    chat: TradeChat | null;
    path: string;
}