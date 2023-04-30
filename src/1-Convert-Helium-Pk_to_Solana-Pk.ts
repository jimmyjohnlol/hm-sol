import Address from "@helium/address";
import {PublicKey} from "@solana/web3.js";

// Below enter your helium public key {Wallet}
const addr = Address.fromB58("133AjM6Wt4GC2LaZpDF7zNCMw2C1tAm8692H85Rb26iVAziByVD"); // my helium public key - change with yours;

// Get the solana public key from this
const newPublickey = new PublicKey(addr.publicKey).toBase58()
console.log(newPublickey);