import {expect} from './chai-setup';
import {ethers} from 'hardhat';
import {
    EntryPoint,
    SimpleAccountFactory
} from '../typechain';
import * as fs from "fs";
import Web3 from "web3"
import { ContractFactory, ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import {
    getMultichainMessageHash,
    getMultichainPackedUserOps
} from './utils/multichainSigner';
import axios from 'axios';

let SimpleAccountFactory:ContractFactory;

async function setup() {
  const EntryPoint: ContractFactory = await ethers.getContractFactory("EntryPoint");
  SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");

  // contract list
  const contracts = {
    EntryPoint: <EntryPoint> await EntryPoint.attach("0xcfB2F03F531d381e2f2f45D8DBB6474c1843Bd38"),
    SimpleAccountFactory: <SimpleAccountFactory> await SimpleAccountFactory.attach("0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007"),
  };

  return {
    contracts
  };
}


// Naming By index of handler Name (interestModel, handlerDS, proxy, siDS)
describe('[Entrypoint and simpleAccountFactory deploy and testing]', async function () {
  let entryPoint: EntryPoint;
  let simpleAccountFactory: SimpleAccountFactory;
  let SimpleAccount: ContractFactory;
  let users: any;

  beforeEach(async function () {
    let {contracts} = await setup();
    users = await ethers.getSigners();

    // Get the contract factory for SimpleAccount with the linked library
    SimpleAccount = await ethers.getContractFactory("SimpleAccount");

    entryPoint = contracts.EntryPoint;
    simpleAccountFactory = contracts.SimpleAccountFactory;
  });


  it("[Single Create Wallet HandleOps by entrypoint]", async function() {

    const userOp = {
      "sender": "0x76d949E566182e38142b579765b4bd845669809E",
      "nonce": "0",
      "initCode": "0x4Bcb18B7eF23d0A1dc0931476E497D29fd4670075fbfb9cf000000000000000000000000a555da8ecbc2e0de5db7924a5703989f14683cc1000000000000000000000000000000000000000000000000000000000000000d",
      "callData": "0x18dfb3c7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c72380000000000000000000000007aa581f22c26098c0baf6756d6a55f93439c26110000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000007aa581f22c26098c0baf6756d6a55f93439c261100000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c441d7edcf000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e848000000000000000000000000076d949e566182e38142b579765b4bd845669809e00000000000000000000000000000000000000000000000000000000",
      "callGasLimit": "500000",
      "verificationGasLimit": "600000",
      "preVerificationGas": "21000",
      "maxFeePerGas": "0",
      "maxPriorityFeePerGas": "1000000000",
      "paymasterAndData": "0x",
      "signature": "0xdc2628878d6e451d1c01f0ed5f913aa6304f4fa51ff0d9cb69974c598e36dc1c01eba5a5cf2b7dc8d1e370e88d5322cf48cbe0b2105c726bd2ed11bea391186e1c"
  }
  
    let tx = await entryPoint.handleOps([userOp], users[0].address);
    await tx.wait();
    console.log(tx);

    
  });



});