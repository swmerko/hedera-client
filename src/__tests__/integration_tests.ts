import {HederaClientFacade} from '../clients/hederaClientFacade'
import {Client, TopicId, TransactionReceipt} from "@hashgraph/sdk"
import {sleep} from "../utils";

require('dotenv').config();

const INTEGRATION_TEST_TIMEOUT: number = 15000;
const ACCOUNT_ID: string = process.env.ACCOUNT_ID || '';
const PRIVATE_KEY: string = process.env.PRIVATE_KEY || '';


test('Setup sender client and check the object type', () => {
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY).hederaClient
  expect(myClient).toBeInstanceOf(Client);
});

test('Setup sender client and create a topic', async () => {
  expect.assertions(1);
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY)
  const topicId = await myClient.createTopic()
  expect(topicId).toBeInstanceOf(TopicId);
}, INTEGRATION_TEST_TIMEOUT);

test('Setup sender client, create topic and push a message', async () => {
  expect.assertions(1);
  let hcsMessageReceipt = null;
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY)
  const topicId = await myClient.createTopic('test')
  if (topicId) {
    const message = "Hello from me!"
    hcsMessageReceipt = await myClient.sendMessage(topicId, message)
  }
  expect(hcsMessageReceipt).toBeInstanceOf(TransactionReceipt);
}, INTEGRATION_TEST_TIMEOUT);


test('Setup sender client and subscribe a topic without setup a network mirror', async () => {
  expect.assertions(1);
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY)
  const topicId = await myClient.createTopic('test')
  if (topicId) {
    try {
      await myClient.subscribeTopic(topicId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  }
}, INTEGRATION_TEST_TIMEOUT);


test('Setup sender client and setup a network mirror 2 times', async () => {
  expect.assertions(1);
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY)

  await myClient.setupMirrorNetwork();
  try {
    await myClient.setupMirrorNetwork();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
}, INTEGRATION_TEST_TIMEOUT);


test('Setup sender client send one message and receive it', async () => {
  expect.assertions(2);
  await sleep(10000);
  const myClient = new HederaClientFacade(ACCOUNT_ID, PRIVATE_KEY);
  const topicId = await myClient.createTopic('test');
  if (topicId) {
    myClient.setupMirrorNetwork();
    await sleep(5000);
    await myClient.subscribeTopic(topicId);
    const message = "Hello from this test!";
    await myClient.sendMessage(topicId, message);
    await sleep(6000);
    expect(myClient.messagesReceived.length).toBe(1);
    expect(myClient.messagesReceived[0]).toBe(message);
  }
}, INTEGRATION_TEST_TIMEOUT * 2);