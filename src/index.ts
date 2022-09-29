import {HederaClientFacade} from "./clients/hederaClientFacade";
require('dotenv').config();

const ACCOUNT_ID: string = process.env.ACCOUNT_ID || '';
const PRIVATE_KEY: string = process.env.PRIVATE_KEY || '';

export const HederaClient: HederaClientFacade = new HederaClientFacade(
  ACCOUNT_ID,
  PRIVATE_KEY,
)
