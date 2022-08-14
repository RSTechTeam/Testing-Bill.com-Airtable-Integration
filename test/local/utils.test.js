import * as utils from '../../src/utils.js';
import {jest} from '@jest/globals';

describe('lazyCache', () => {
  let val = 0;
  const producer = jest.fn(() => ++val);
  let it;

  const expectPostCallInvariant = () => {
    expect(it()).toBe(1);
    expect(val).toBe(1);
    expect(producer.mock.calls.length).toBe(1);
  };

  test('is lazy', () => {
    expect(val).toBe(0);

    it = utils.lazyCache(producer);
    expect(val).toBe(0);
    expect(producer).not.toBeCalled();

    expectPostCallInvariant();
  });

  test('caches', () => {
    expect(val).toBe(1);
    expectPostCallInvariant();
  });
});

test('fetchError throws', () => {
  expect(() => fetchError('code', 'context', 'message')).toThrow();
});


describe.each`
  name       | batchFunc           | asyncExecutionOrder
  ${'Await'} | ${utils.batchAwait} | ${[5, 2, 0]}
  ${'Async'} | ${utils.batchAsync} | ${[0, 2, 5]}
`('batch', ({name, batchFunc, asyncExecutionOrder}) => {

  const successTest = (func, array, size, expected) => () => {
    return expect(batchFunc(func, array, size)).resolves.toEqual(expected);
  };

  const identity = x => x;

  const identityTest =
      (array, size, expected) => successTest(identity, array, size, expected);

  describe(name, () => {

    test('given empty, returns empty', identityTest([], 1, []));

    test('given non-positive size, throws', () => {
      const got = () => batchFunc(identity, [0], 0);
      if (name === 'Await') {
        return expect(got()).rejects.toThrow();
      } else {
        expect(got).toThrow();
      }
    });

    describe.each`
      array       | size | expected
      ${[1]}      | ${1} | ${[[1]]}
      ${[1, 2]}   | ${1} | ${[[1], [2]]}
      ${[1, 2, 3]}| ${2} | ${[[1, 2], [3]]}
    `('using identity function', ({array, size, expected}) => {
      test(
          `given args (${array}, ${size}), returns ${expected}`,
          identityTest(array, size, expected));
    });

    test(
        'given transformation function (increment), changes output', 
        successTest((arr) => arr[0] + 1, [1, 2], 1, [2, 3]));

    test('given timely async function', async () => {
      const gotExecutionOrder = [];
      const waitPushReturn = async (arr) => {
        const x = arr[0];
        await new Promise(resolve => setTimeout(resolve, x * 10));
        gotExecutionOrder.push(x);
        return x;
      };
      await successTest(waitPushReturn, [5, 2, 0], 1, [5, 2, 0])();
      expect(gotExecutionOrder).toEqual(asyncExecutionOrder);
    });
  });
});
