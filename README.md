  ## Synthetix JS 

  This is a repo for interacting with Synthetix JS contracts. You may use this library in a node or browser environment and also import it as an es module for single page applications.

  #### Getting Started
  to install in the browser...

  to insteall in a node environment...

  to add to a single page application like react...

  #### Usage

  ###### Browser Example
  
  ```const network = 'mainnet';
  const { formatEther } = window.synthetix.utils; 
  const snxjs = window.synthetix({ network }); 
  // this instance exposes props for the given network: synths, sources, targets, users, as well as helper function toBytes32 - as per synthetix: https://github.com/Synthetixio/synthetix/blob/develop/index.js#L199

  const synths = snxjs.synths.map(({ name }) => name); 
  const fromBlock = blockTarget.value;
  const blockOptions = fromBlock ? { blockTag: Number(fromBlock) } : {};
  
  let totalInUSD = 0;
  
  // note how I can pass it a string and it will convert it to bytes32 for me
  const snxPrice = formatEther(await snxjs.ExchangeRates.rateForCurrency('SNX', blockOptions));  // note blockOptions must be passed to `ethers.Contract` as the final parameter (and fails if no archive node)
  // or better yet, can't we just expose these functions top level? 
  const snxPrice = formatEther(await snxjs.rateForCurrency('SNX', blockOptions)); 

  let results = await Promise.all(synths.map(async synth => {
    const totalAmount = await snxjs[synth].contract.totalSupply(blockOptions);
      
    const totalSupply = formatEther(totalAmount);  
    const rateForSynth = formatEther(await snxjs.rateForCurrency(synth, blockOptions));
    const totalSupplyInUSD = rateForSynth * totalSupply;
    totalInUSD += totalSupplyInUSD;
    const rateIsFrozen = await snxjs.rateIsFrozen(synth, blockOptions);
     
    return { synth, totalAmount, totalSupply, rateForSynth, totalSupplyInUSD, rateIsFrozen };
  }));```

[![Synthetixio](https://circleci.com/gh/Synthetixio/js.svg?style=svg)](https://github.com/Synthetixio/js)
