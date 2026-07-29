import {
  CryptoECKey,
  CryptoKeypath,
  DataItem,
  MultiKey,
  PathComponent,
} from '../src';

describe('security-sensitive model validation', () => {
  it('rejects invalid derivation path components', () => {
    expect(
      () => new PathComponent({ index: -1, hardened: false }),
    ).toThrow('Invalid index');
    expect(
      () => new PathComponent({ index: 1.5, hardened: false }),
    ).toThrow('Invalid index');
    expect(
      () =>
        new PathComponent({
          index: PathComponent.HARDENED_BIT,
          hardened: false,
        }),
    ).toThrow('Invalid index');
    expect(
      () =>
        new PathComponent({
          index: 0,
          hardened: 'false' as unknown as boolean,
        }),
    ).toThrow('hardened must be a boolean');
  });

  it('rejects invalid multisig thresholds and unknown key tags', () => {
    const key = new CryptoECKey({ data: Buffer.alloc(33) });
    expect(() => new MultiKey(0, [key])).toThrow('threshold');
    expect(() => new MultiKey(2, [key])).toThrow('threshold');

    const unknownKey = new DataItem({}, 999);
    expect(() =>
      MultiKey.fromDataItem(
        new DataItem({
          1: 1,
          2: [unknownKey],
        }),
      ),
    ).toThrow('unsupported key tag');
  });

  it('preserves valid wildcard derivation components', () => {
    const keypath = new CryptoKeypath([
      new PathComponent({ hardened: false }),
    ]);
    expect(keypath.getPath()).toBe('*');
  });
});
