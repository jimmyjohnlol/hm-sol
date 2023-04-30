// In this we are going to fetch our solana migrated wallet balnce
/**
    Here we will fetch
    - Sol
    - IoT
    - Mobile(5G)
    - DC
    token balances using solana new wallet public key {q54mjY4Y6o2FCGBRu5j3aoQ49r1zFLSgwqT87io7hU6}
 */

    import { Connection, PublicKey } from "@solana/web3.js";

    // configure you env file with your credentials
    import { SOLANA_URL } from "./env";
    
    const connection = new Connection(SOLANA_URL, "confirmed");
    
    const getTokenAccountBalance = async (publicKey, tokenMintAddress) => {
      const tokenAccountInfo = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: tokenMintAddress,
      });
      if (tokenAccountInfo.value.length === 0) {
        return 0;
      }
      const tokenAccount = tokenAccountInfo.value[0].account;
      const tokenAmount = tokenAccount.data.parsed.info.tokenAmount;
      return tokenAmount.amount;
    };
    
    const fetchTokenBalance = async (publicKey, mintAddress, tokenName) => {
      const tokenMintAddress = new PublicKey(mintAddress);
      const tokenBalance = await getTokenAccountBalance(publicKey, tokenMintAddress);
      console.log(`${tokenName} Token Balance: ${tokenBalance}`);
    };
    
    (async () => {
      // wallet address public key.
      const publicKey = new PublicKey("q54mjY4Y6o2FCGBRu5j3aoQ49r1zFLSgwqT87io7hU6");
      const tokenData = [
        { name: "IOT", mintAddress: "iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns" },
        { name: "HNT", mintAddress: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux" },
        { name: "Mobile", mintAddress: "mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6" },
        { name: "DC", mintAddress: "dcuc8Amr83Wz27ZkQ2K9NS6r8zRpf1J6cvArEBDZDmm" },
      ];
    
      const solanaBalance = await connection.getBalance(publicKey);
      console.log(`Solana Token Balance: ${solanaBalance}`);
    
      for (const token of tokenData) {
        await fetchTokenBalance(publicKey, token.mintAddress, token.name);
      }
    })();
    