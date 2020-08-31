# Synthetix JS

[![Synthetixio](https://circleci.com/gh/Synthetixio/js.svg?style=svg)](https://github.com/Synthetixio/js)

:warning: This library is still under construction and in BETA, please use with caution.

### The official Javascript library for interacting with Synthetix protocol contracts.

This library can be used in 2 different environments:

1. Common-js module for node environments
2. UMD module for browser environments

#### Installation

```

// For node environments:
const { synthetix } = require('@synthetixio/js');

// For single page applications:
import { synthetix } from '@synthetixio/js';

// For browser environments:
// after running npm build take the index.browser.js file and put it in a script tag
// then you can access synthetix on the window object:
const { synthetix } = window;


const snxjs = synthetix({ network: 'mainnet' });


// Note for typescript applications:
import { synthetix, Networks } from '@synthetixio/js';
const snxjs = synthetix({ network: Networks.Mainnet });
```

#### Usage

See the examples folder for usage details
