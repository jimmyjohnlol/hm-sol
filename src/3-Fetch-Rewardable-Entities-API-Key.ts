import {entityCreatorKey} from "@helium/helium-entity-manager-sdk";
import { daoKey } from "@helium/helium-sub-daos-sdk";
import { PublicKey, Connection } from "@solana/web3.js";

const hnt_mint = new PublicKey('q54mjY4Y6o2FCGBRu5j3aoQ49r1zFLSgwqT87io7hU6')
const dao = daoKey(hnt_mint)[0];
const creator = entityCreatorKey(dao)[0];
console.log(creator);