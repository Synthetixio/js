import { Config, Network, NetworkId, Target, TargetsRecord, ContractsMap, SynthetixJS, Synth, Token } from './types';
declare const synthetix: ({ networkId, network, signer, provider, useOvm, }: Config) => SynthetixJS;
export { synthetix, Network, NetworkId };
export type { Config, Target, TargetsRecord, ContractsMap, SynthetixJS, Synth, Token };
export default synthetix;
