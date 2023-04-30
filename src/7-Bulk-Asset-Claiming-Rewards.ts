// This script is designed to claim rewards for a bulk assets on Solana.

import { init, lazyDistributorKey } from "@helium/lazy-distributor-sdk";
import { getCurrentRewards } from "@helium/distributor-oracle";
import * as anchor from "@coral-xyz/anchor";
import { formTransaction } from "@helium/distributor-oracle";
import { SOLANA_URL, ANCHOR_WALLET } from "./env";
import { PublicKey } from "@solana/web3.js";
import * as fs from "fs";

(async () => {
  try {
    anchor.setProvider(anchor.AnchorProvider.local(SOLANA_URL));
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await init(provider);
    const iotMint = new PublicKey("iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns");
    const jsonString = fs.readFileSync('./assets.json', 'utf-8');
    const assetIds = JSON.parse(jsonString).map(id => new PublicKey(id));

    for (const assetId of assetIds) {
      const lazyDistributorPKey = lazyDistributorKey(iotMint)[0];
      const rewards = await getCurrentRewards(program, lazyDistributorPKey, assetId);

      for (const reward of rewards) {
        const currentRewards = Number(reward.currentRewards);
        if (currentRewards > 0) {
          console.log(`Oracle ${reward.oracleKey} stating lifetime rewards of Asset ID ${assetId} ${reward.currentRewards}`);
          console.log("Sending Transaction...");

          const tx = await formTransaction({
            program,
            provider,
            rewards: [reward],
            hotspot: assetId,
            lazyDistributor: lazyDistributorPKey,
          });

          await provider.wallet.signTransaction(tx);
          console.log("Transaction signature: ", tx.signature.toString('hex'));
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    console.error(error.stack);
  }
})();
