import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TopicId,
  TransactionReceipt, TopicMessage
} from "@hashgraph/sdk"

export class HederaClientFacade {

  NETWORK_NAMES = [
    'mainnet',
    'testnet',
    'previewnet',
  ]

  hederaClient: Client;

  mirrorNetwork: boolean = false;
  messagesReceived: string[] = [];


  constructor(accountId: string, privateKey: string, networkName: string = 'testnet') {
    this.constructorValidation(accountId, privateKey, networkName);
    this.hederaClient = Client.forName(networkName).setOperator(accountId, privateKey);
  }

  private constructorValidation(accountId: string, privateKey: string, networkName: string) {
    if (!(accountId && privateKey && networkName)) {
      throw new Error(
        "Missing parameters: accountId, privateKey and networkName are required."
      );
    }
    if (!this.NETWORK_NAMES.includes(networkName)) {
      throw new Error(
        `Wrong parameter: networkName must be one of ${this.NETWORK_NAMES}.`
      );
    }
  }

  private subscribeValidation() {
    if (!this.mirrorNetwork) {
      throw new Error(
        `You should set a mirror network before subscribe a topic.`
      );
    }
  }


  private messageReceived(message: TopicMessage) {
    const message_data: string = Buffer.from(message.contents).toString()
    this.messagesReceived.push(message_data)
  }

  async createTopic(memo: string = 'test topic'): Promise<TopicId | null> {
    const transactionId = await new TopicCreateTransaction().setTopicMemo(memo).execute(this.hederaClient);
    const transactionReceipt = await transactionId.getReceipt(this.hederaClient);
    return transactionReceipt.topicId;
  }

  async sendMessage(topicId: TopicId, message: string): Promise<TransactionReceipt | null> {
    const hcsMessage = await new TopicMessageSubmitTransaction().setTopicId(topicId).setMessage(message).execute(this.hederaClient);
    const hcsMessageReceipt = await hcsMessage.getReceipt(this.hederaClient);
    return hcsMessageReceipt;
  }

  async subscribeTopic(topicId: TopicId) {
    this.subscribeValidation();
    return new TopicMessageQuery()
      .setTopicId(topicId)
      .subscribe(
        this.hederaClient,
        (error) => {
          console.log(error);
        },
        (message) => {
          this.messageReceived(message);
        }
      );
  }

  setupMirrorNetwork(networkUri: string = "hcs.testnet.mirrornode.hedera.com:5600") {
    if (!this.mirrorNetwork) {
      this.hederaClient.setMirrorNetwork(networkUri);
      this.mirrorNetwork = true;
    } else {
      throw new Error(
        `Mirror network already set.`
      );
    }
  }
}