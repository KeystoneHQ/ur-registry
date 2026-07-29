import { decodeToDataItem } from '../src/lib';

describe('CBOR decoder security limits', () => {
  it('rejects truncated byte strings instead of allocating declared length', () => {
    expect(() =>
      decodeToDataItem(Buffer.from('5a01000000', 'hex')),
    ).toThrow('CBOR chunk exceeds remaining input');
  });

  it('rejects unterminated indefinite-length containers', () => {
    expect(() => decodeToDataItem(Buffer.from([0x9f]))).toThrow(
      'Unexpected end of CBOR data',
    );
  });

  it('rejects unsafe object keys', () => {
    const protoKeyMap = Buffer.from(
      'a1695f5f70726f746f5f5fa101182a',
      'hex',
    );
    expect(() => decodeToDataItem(protoKeyMap)).toThrow(
      'Unsafe CBOR map key',
    );
  });

  it('rejects trailing values to prevent parser differentials', () => {
    expect(() => decodeToDataItem(Buffer.from('0102', 'hex'))).toThrow(
      'Trailing data after CBOR value',
    );
  });

  it('rejects invalid UTF-8 and duplicate map keys', () => {
    expect(() => decodeToDataItem(Buffer.from('61ff', 'hex'))).toThrow(
      'Invalid UTF-8 string',
    );
    expect(() => decodeToDataItem(Buffer.from('a201010102', 'hex'))).toThrow(
      'Duplicate CBOR map key',
    );
    expect(() =>
      decodeToDataItem(Buffer.from('1b0020000000000000', 'hex')),
    ).toThrow('CBOR integer exceeds JavaScript safe range');
  });

  it('rejects excessive nesting and container sizes', () => {
    const deeplyNested = Buffer.concat([
      Buffer.alloc(65, 0x81),
      Buffer.from([0x00]),
    ]);
    expect(() => decodeToDataItem(deeplyNested)).toThrow(
      'CBOR nesting depth exceeds limit',
    );
    expect(() =>
      decodeToDataItem(Buffer.from('9a000186a1', 'hex')),
    ).toThrow('CBOR container size exceeds limit');
  });
});
