"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HederaClient = void 0;
var hederaClientFacade_1 = require("./clients/hederaClientFacade");
require('dotenv').config();
var ACCOUNT_ID = process.env.ACCOUNT_ID || '';
var PRIVATE_KEY = process.env.PRIVATE_KEY || '';
exports.HederaClient = new hederaClientFacade_1.HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY);
