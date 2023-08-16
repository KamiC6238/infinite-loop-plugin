## Introduction

A Babel plugin for detecting the presence of infinite loop code.

## Install
### npm
`npm install babel-infinite-loop-plugin`
### yarn
`yarn add babel-infinite-loop-plugin`
### pnpm
`pnpm install babel-infinite-loop-plugin`


## Usage
```javascript
import * as babel from '@babel/core';
import { infiniteLoopPlugin } from 'babel-infinite-loop-plugin';

const code = `while (1) {}`

const res = babel.transform(code, {
    plugins: [infiniteLoopPlugin]
})

console.log(res.code)

// result
var _loopIt = 0;

while (1) {
    if (_loopIt++ > 10001) {
        var babel_global = typeof window === 'undefined' ? self : window;
        babel_global.infiniteLoopError = new RangeError('An infinite loop was detected in the code');
        throw babel_global.infiniteLoopError;
    }
}
```
or
```javascript
import * as babel from '@babel/core';
import { getPluginWithConfig } from 'babel-infinite-loop-plugin';

const code = `while (1) {}`

const res = babel.transform(code, {
    plugins: [
        getPluginWithConfig({
            maxLoopTimes: 1000,
            errMsg: 'custom infinite loop error message'
        })
    ]
})

console.log(res.code)

// result
var _loopIt = 0;

while (1) {
    // the maxLoopTimes will be replaced to the customized value
    if (_loopIt++ > 1000) {
        var babel_global = typeof window === 'undefined' ? self : window;
        // the RangeError msg will be replaced to the customized value
        babel_global.infiniteLoopError = new RangeError('custom infinite loop error message');
        throw babel_global.infiniteLoopError;
    }
}
```

## Notice
The plugin only support `ForStatement` & `WhileStatement` & `DoWhileStatement`