import * as babel from '@babel/core';
import { infiniteLoopPlugin } from './index.js';

const code = `while (1) {}`

const res = babel.transform(code, {
    plugins: [infiniteLoopPlugin]
})

console.log(res.code)