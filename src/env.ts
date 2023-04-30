import os from "os";

// configure your local solana wallet below
export const ANCHOR_WALLET = process.env.ANCHOR_WALLET = 
    process.env.ANCHOR_WALLET || os.homedir() + "/.config/solana/id.json";

// get you devnet rpc from helius
export const SOLANA_URL = process.env.SOLANA_URL || "{paste your helium rpc url either for devnet or mainnet}";

