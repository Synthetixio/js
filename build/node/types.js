"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkId = exports.Network = void 0;
var Network;
(function (Network) {
    Network["Mainnet"] = "mainnet";
    Network["Ropsten"] = "ropsten";
    Network["Rinkeby"] = "rinkeby";
    Network["Kovan"] = "kovan";
})(Network = exports.Network || (exports.Network = {}));
var NetworkId;
(function (NetworkId) {
    NetworkId[NetworkId["Mainnet"] = 1] = "Mainnet";
    NetworkId[NetworkId["Ropsten"] = 3] = "Ropsten";
    NetworkId[NetworkId["Rinkeby"] = 4] = "Rinkeby";
    NetworkId[NetworkId["Kovan"] = 42] = "Kovan";
})(NetworkId = exports.NetworkId || (exports.NetworkId = {}));
