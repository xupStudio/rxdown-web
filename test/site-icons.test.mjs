import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const publicRoot = join(root, 'public');
const expectedIcons = new Map([
  ['app-icon.png', ['8f1ae0b4066e39da5a74bf7fa41c893675561d28252a32891955afb86ad977fd', 1024]],
  ['favicon.png', ['793500b85115f490825823d83a7e951f8db8ae337b6f21715f25e798d69ba2c7', 96]],
  ['icon-180.png', ['096a7d56188685bfdcd6300cd7ee1de818efd567aa26797be3ed76d81d333526', 180]],
  ['icon-192.png', ['0284ff5c6be260e86944065fe278d7567866b8e32fb5d6cfded2d0027c39c57b', 192]],
  ['icon-512.png', ['657d883448f810ed306f5a9f468f73ce95f749edf24b00f45aed3fdac6fde54a', 512]],
]);

test('the website uses the approved RxDown app icon at every declared PNG size', () => {
  for (const [name, [expectedHash, expectedSize]] of expectedIcons) {
    const source = readFileSync(join(publicRoot, name));
    const hash = createHash('sha256').update(source).digest('hex');

    assert.equal(hash, expectedHash, `${name} artwork`);
    assert.equal(source.readUInt32BE(16), expectedSize, `${name} width`);
    assert.equal(source.readUInt32BE(20), expectedSize, `${name} height`);
  }
});

test('favicon.ico contains the browser fallback sizes', () => {
  const source = readFileSync(join(publicRoot, 'favicon.ico'));
  const count = source.readUInt16LE(4);
  const sizes = Array.from({ length: count }, (_, index) => source.readUInt8(6 + index * 16));

  assert.deepEqual(sizes, [16, 32, 48]);
});
