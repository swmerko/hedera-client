import { Client, TopicId, TransactionReceipt } from "@hashgraph/sdk";
export declare class HederaClientFacade {
    NETWORK_NAMES: string[];
    hederaClient: Client;
    mirrorNetwork: boolean;
    messagesReceived: string[];
    constructor(accountId: string, privateKey: string, networkName?: string);
    private constructorValidation;
    private subscribeValidation;
    private messageReceived;
    createTopic(memo?: string): Promise<TopicId | null>;
    sendMessage(topicId: TopicId, message: string): Promise<TransactionReceipt | null>;
    subscribeTopic(topicId: TopicId): Promise<import("@hashgraph/sdk").SubscriptionHandle>;
    setupMirrorNetwork(networkUri?: string): void;
}
