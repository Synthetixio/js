import { ethers } from 'ethers';
export declare enum Network {
    Mainnet = "mainnet",
    Ropsten = "ropsten",
    Rinkeby = "rinkeby",
    Kovan = "kovan"
}
export declare enum NetworkId {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42
}
declare type ContractInfo = {
    address: string;
    replaced_in: string;
    status: string;
};
declare type Version = {
    commit: string;
    contracts: {
        [name: string]: ContractInfo;
    };
    date: string;
    fulltag: string;
    network: string;
    release: string;
    tag: string;
};
declare type StakingReward = {
    name: string;
    rewardsToken: string;
    stakingToken: string;
};
export declare type Token = {
    address: string;
    asset?: string;
    decimals: number;
    feed?: string;
    index?: Array<{
        asset: string;
        category: string;
        description: string;
        sign: string;
        units: number;
        weight: number;
    }>;
    inverted?: {
        entryPoint: number;
        lowerLimit: number;
        upperLimit: number;
    };
    name: string;
    symbol: string;
};
declare type Feed = {
    asset: string;
    category: string;
    desc?: string;
    description?: string;
    exchange?: string;
    feed?: string;
    sign: string;
};
export declare type SynthetixJS = {
    networks: Array<Network>;
    networkToChainId: Record<Network, NetworkId>;
    decode: (config: {
        network: Network;
        data: string;
        target: Target;
    }) => {
        method: {
            name: string;
            params: Array<any>;
        };
        contract: string;
    };
    defaults: {
        [key: string]: any;
    };
    feeds: {
        [symbol: string]: Feed;
    };
    tokens: Array<Token>;
    network: {
        id: NetworkId;
        name: Network;
    };
    sources: {
        [name: string]: SourceData;
    };
    targets: TargetsRecord;
    synths: Synth[];
    versions: {
        [version: string]: Version;
    };
    stakingRewards: Array<StakingReward>;
    suspensionReasons: {
        [code: number]: string;
    };
    users: User[];
    toBytes32: (key: string) => string;
    utils: typeof ethers.utils;
    contracts: ContractsMap;
};
export declare type SourceData = {
    bytecode: string;
    abi: ethers.ContractInterface;
};
export declare type Target = {
    name: string;
    source: string;
    address: string;
    link: string;
    timestamp: string;
    txn: string;
    network: Network;
};
export declare type TargetsRecord = Record<string, Target>;
export interface ContractDefinition {
    name: string;
    abi: ethers.ContractInterface;
    address: string;
}
export declare type ContractsMap = {
    [name: string]: ethers.Contract;
};
export declare type Config = {
    networkId?: NetworkId;
    network?: Network;
    signer?: ethers.Signer;
    provider?: ethers.providers.Provider;
};
export declare type Synth = {
    name: string;
    asset: string;
    category: string;
    sign: string;
    desc: string;
    aggregator?: string;
    subclass?: string;
};
export declare type User = {
    name: string;
    address: string;
};
export {};
