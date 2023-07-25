import { User } from "./user";

export interface Wallet {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    balances: Balance[];
}

export interface Balance {
    id: number,
    amount: number;
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    currency: Currency
}

export interface Currency {
    id: number;
    name: string;
    currencyCode: string;
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    status: any
}

export interface Transaction {
    id: number;
    amount: number;
    tx_ref: string;
    description?: string;
    currentBalance: number;
    balance: Balance | null;
    isWithdrawal: boolean;
    transactionType: TransactionType | null;
    source: TransactionSource | null;
    status: TransactionStatus | null;
    user: User | null;
    tx_date: string;
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
}


export interface TransactionType {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface TransactionSource {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface TransactionStatus {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface Withdrawal {
    id: number;
    amount: number;
    tx_ref: string;
    comment?: string;
    bank: Bank | null;
    transaction: Transaction | null;
    balance: Balance | null;
    status: TransactionStatus | null;
    processedBy: User | null;
    processedDate: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  export enum TransactionStatusEnum {
    'successful' = 1,
    'failed' = 2,
    'pending' = 3,
  }

  export interface Bank {
    id: number;
    bankName: string;
    bankCode?: string;
    recipientCode?: string;
    accountName?: string | null;
    accountNo?: string | null;
    // user: User | null;
    status: any;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  }

  export interface LocalBank {
    id: number;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string;
    pay_with_bank: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }