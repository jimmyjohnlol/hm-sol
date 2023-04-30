/**
    In this script, we will use the asset IDs extracted from the previous script and saved in a JSON file. 
    The script will retrieve all available rewards for each asset, allowing you to claim them.
 */

    import { init, lazyDistributorKey } from "@helium/lazy-distributor-sdk";
    import { getCurrentRewards } from "@helium/distributor-oracle";
    import * as anchor from "@coral-xyz/anchor";
    import { SOLANA_URL, ANCHOR_WALLET } from "./env";
    import { PublicKey } from "@solana/web3.js";
    import * as fs from "fs";
    
    (async () => {
      try {
        anchor.setProvider(anchor.AnchorProvider.local(SOLANA_URL));
        const provider = anchor.getProvider() as anchor.AnchorProvider;
        const program = await init(provider);
        
        //Here, we are using Solana's program ID for IOT. If you would like to claim rewards for Mobile tokens, simply replace this mint address with the Mobile mint address.
        const iotMint = new PublicKey("iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns");
        const jsonString = fs.readFileSync('./assets.json', 'utf-8');
        const assetIds = JSON.parse(jsonString).map(id => new PublicKey(id));
    
        for (const assetId of assetIds) {
          const lazyDistributorPKey = lazyDistributorKey(iotMint)[0];
          const rewards = await getCurrentRewards(program, lazyDistributorPKey, assetId);
    
          rewards.forEach(reward => {
            const currentRewards = Number(reward.currentRewards);
            if (currentRewards > 0) {
              console.log(`Oracle ${reward.oracleKey} stating lifetime rewards of Asset ID ${assetId}: ${reward.currentRewards}`);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();
    