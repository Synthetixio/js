"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkId = exports.Network = exports.synthetix = void 0;
const synthetix_1 = require("synthetix");
const ethers_1 = require("ethers");
const types_1 = require("./types");
Object.defineProperty(exports, "Network", { enumerable: true, get: function () { return types_1.Network; } });
Object.defineProperty(exports, "NetworkId", { enumerable: true, get: function () { return types_1.NetworkId; } });
const constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const synthetix = ({ networkId, network, signer, provider }) => {
    const [currentNetwork, currentNetworkId] = selectNetwork(networkId, network);
    return {
        network: {
            id: currentNetworkId,
            name: currentNetwork,
        },
        networks: synthetix_1.networks,
        networkToChainId: synthetix_1.networkToChainId,
        decode: synthetix_1.decode,
        defaults: synthetix_1.defaults,
        feeds: synthetix_1.getFeeds({ network: currentNetwork }),
        tokens: synthetix_1.getTokens({ network: currentNetwork }),
        sources: synthetix_1.getSource({ network: currentNetwork }),
        targets: synthetix_1.getTarget({ network: currentNetwork }),
        synths: synthetix_1.getSynths({ network: currentNetwork }),
        users: synthetix_1.getUsers({ network: currentNetwork }),
        versions: synthetix_1.getVersions({ network: currentNetwork }),
        stakingRewards: synthetix_1.getStakingRewards({ network: currentNetwork }),
        suspensionReasons: synthetix_1.getSuspensionReasons(),
        toBytes32: synthetix_1.toBytes32,
        utils: ethers_1.ethers.utils,
        contracts: getSynthetixContracts(currentNetwork, signer, provider),
    };
};
exports.synthetix = synthetix;
const selectNetwork = (networkId, network) => {
    let currentNetwork = types_1.Network.Mainnet;
    let currentNetworkId = types_1.NetworkId.Mainnet;
    if ((network && !synthetix_1.networks.includes(network)) ||
        (networkId && !Object.values(synthetix_1.networkToChainId).includes(networkId))) {
        throw new Error(constants_1.ERRORS.badNetworkArg);
    }
    else if (network && synthetix_1.networks.includes(network)) {
        currentNetwork = network;
        currentNetworkId = synthetix_1.networkToChainId[network];
    }
    else if (networkId) {
        Object.entries(synthetix_1.networkToChainId).forEach(([key, value]) => {
            if (value === networkId) {
                currentNetwork = key;
                currentNetworkId = value;
            }
        });
    }
    return [currentNetwork, currentNetworkId];
};
const getSynthetixContracts = (network, signer, provider) => {
    const sources = synthetix_1.getSource({ network });
    const targets = synthetix_1.getTarget({ network });
    return Object.values(targets)
        .map((target) => {
        if (target.name === 'Synthetix') {
            target.address = targets.ProxyERC20.address;
        }
        else if (target.name === 'SynthsUSD') {
            target.address = targets.ProxyERC20sUSD.address;
        }
        else if (target.name === 'FeePool') {
            target.address = targets.ProxyFeePool.address;
        }
        else if (target.name.match(/Synth(s|i)[a-zA-Z]+$/)) {
            const newTarget = target.name.replace('Synth', 'Proxy');
            target.address = targets[newTarget].address;
        }
        return target;
    })
        .reduce((acc, { name, source, address }) => {
        acc[name] = new ethers_1.ethers.Contract(address, sources[source].abi, signer || provider || ethers_1.ethers.getDefaultProvider(network));
        return acc;
    }, {});
};
exports.default = synthetix;
