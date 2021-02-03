import assert from 'assert';
import { add, mul } from '../add';

describe('add function testing', function () {
  it('1 + 2 = 3', function () {
    assert.strictEqual(add(1, 2), 3);
  });

  it('-5 + 2 = -3', function () {
    assert.strictEqual(add(-5, 2), -3);
  });
});

describe('mul function testing', function () {
  it('1 * 2 = 2', function () {
    assert.strictEqual(mul(1, 2), 2);
  });

  it('-5 * 2 = -10', function () {
    assert.strictEqual(mul(-5, 2), -10);
  });
});
