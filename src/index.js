import * as babel from '@babel/core';

let maxLoopTimes = 10001;
let errMsg = 'An infinite loop was detected in the code';

function getBuildGuard() {
    return babel.template(`
        if (LOOP_ITERATOR++ > MAX_LOOP_ITERATOR) {
            var babel_global = typeof window === 'undefined' ? self : window;
            babel_global.infiniteLoopError = new RangeError('${errMsg}');
            throw babel_global.infiniteLoopError;
        }
    `);
}

function infiniteLoopPlugin(babel) {
    return {
        name: 'infinite-loop-plugin',
        visitor: {
            'ForStatement|WhileStatement|DoWhileStatement': path => {
                const buildGuard = getBuildGuard();
                const loopIterator = path.scope.parent.generateUidIdentifier('loopIt');
                const initLoopIterator = babel.types.numericLiteral(0);
            
                path.scope.parent.push({
                    id: loopIterator,
                    init: initLoopIterator,
                });
            
                const guard = buildGuard({
                    LOOP_ITERATOR: loopIterator,
                    MAX_LOOP_ITERATOR: babel.types.numericLiteral(maxLoopTimes),
                });
            
                const body = path.get('body');
                if (!body.isBlockStatement()) {
                    const statement = body.node;
                    body.replaceWith(babel.types.blockStatement([guard, statement]));
                } else {
                    body.unshiftContainer('body', guard);
                }
            }
        }
    }
}

/**
 * @param {{maxLoopTimes?: number; errMsg?: string}} configs
 * @returns 
 */
function getPluginWithConfig(configs = {
    maxLoopTimes,
    errMsg
}) {
    maxLoopTimes = configs.maxLoopTimes;
    errMsg = configs.errMsg

    return infiniteLoopPlugin
}

export {
    getPluginWithConfig,
    infiniteLoopPlugin
}