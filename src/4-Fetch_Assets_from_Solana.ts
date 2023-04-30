/**
    With this script, you can retrieve all migrated assets (hotspots) on 
    Solana by simply providing your new Solana public key. The fetched asset 
    data will be sourced from the oracle data and saved in a JSON file.

    Note: The current implementation only extracts the asset ID from the data. 
    If you need to use the entire data set, just modify the response in the script accordingly.
 */


import axios from 'axios';
import fs from 'fs';
import { SOLANA_URL } from './env';

const url = SOLANA_URL;
const data = {
    "jsonrpc": "2.0",
    "method": "search_assets",
    "id": "get-assets-op-1",
    "params": {
        "ownerAddress": "q54mjY4Y6o2FCGBRu5j3aoQ49r1zFLSgwqT87io7hU6",
        "page": 0,
    }
};
const headers = {
    'Content-Type': 'application/json',
};

const options = {
    method: 'post',
    url,
    data,
    headers
};

axios(options)
    .then(response => {
        if (response.data.result.items) {
            const ids = response.data.result.items.map(items => items.id);
            const jsonData = JSON.stringify(ids);
            fs.writeFile('assets.json', jsonData, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`IDs ${ids} saved to response.json`);
                }
            });
        } else {
            console.error("Error: response data has no 'assets' array");
        }
    })
    .catch(error => console.error(error));
