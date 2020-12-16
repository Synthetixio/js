"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = void 0;
exports.ERRORS = {
    badNetworkArg: 'unsupported network or network id passed. Please check SynthetixJS.supportedNetworks for a list of supported networks and ids',
    noMatch: (type, value) => `no contracts match ${type}: ${value}`,
};
