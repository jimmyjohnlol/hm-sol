// This script is designed to claim rewards for a single asset on Solana.

import {init, lazyDistributorKey} from "@helium/lazy-distributor-sdk";
import { getCurrentRewards } from "@helium/distributor-oracle";
import * as anchor from "@coral-xyz/anchor";
import { formTransaction } from "@helium/distributor-oracle";
import { SOLANA_URL, ANCHOR_WALLET } from "./env";
import { PublicKey, Keypair } from "@solana/web3.js";

(async() => {

    try {
        anchor.setProvider(anchor.AnchorProvider.local(SOLANA_URL));
        const provider = anchor.getProvider()as anchor.AnchorProvider;
        const program = await init(provider);

        const iotMintKeyStr = "iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns";
        const iotMintKey = new PublicKey(iotMintKeyStr);
        console.log(`iotMint: ${iotMintKey.toBase58()}`)

        // picking up any random asset Id from json.
        const assetIdKeyStr = "6cfJkNjty6YmMG5vTsjrC65FTanhMptuRwgpP3N4pf2";
        const assetIdKey = new PublicKey(assetIdKeyStr);
        console.log(`assetId: ${assetIdKey.toBase58()}`)

        const lazyDistributorPKey = lazyDistributorKey(iotMintKey)[0];
        const rewards = await getCurrentRewards(program, lazyDistributorPKey, assetIdKey);
        rewards.map(rewards => {
            console.log(`Oracle ${rewards.oracleKey} stating lifetime rewards of ${rewards.currentRewards}`);
        });

        console.log("Sending Transaction......");
        const tx = await formTransaction({
            program,
            provider,
            rewards,
            hotspot: assetIdKey,
            lazyDistributor: lazyDistributorPKey,
        });

        //await provider.sendAndConfirm(tx);
        await provider.wallet.signTransaction(tx);
        console.log("Transaction signature:- ", tx.signature.toString('hex'));

    }
    catch(error){
        console.error(new Error('An error occured: ' + error.message));
        console.error(error.stack);
    }

})();

