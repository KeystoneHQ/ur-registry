import { CryptoKeypath, PathComponent } from '../../src';
import {
  QRHardwareCall,
  QRHardwareCallType,
  QRHardwareCallVersion,
} from '../../src/extended/QRHardwareCall';
import { DeriveContextHashCall } from '../../src/extended/DeriveContextHashCall';

describe('DeriveContextHashCall', () => {
  const buildCall = () => {
    // m/44'/0'/0'/0/0 — matches the Babylon spec test vector / the Rust round-trip test.
    const keyPath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
      new PathComponent({ index: 0, hardened: false }),
    ]);
    const params = new DeriveContextHashCall(
      'babylon-btc-vault',
      'bitcoin-mainnet',
      keyPath,
      'deadbeef',
    );
    return new QRHardwareCall(
      QRHardwareCallType.DeriveContextHash,
      params,
      'babylon',
      QRHardwareCallVersion.V1,
    );
  };

  it('should encode to the canonical CBOR (must match the firmware/Rust encoding)', () => {
    const hex = buildCall().toCBOR().toString('hex');
    // Pinned to lock byte-for-byte agreement with ur-registry (Rust) tag 1303.
    expect(hex).toBe(
      'a4010102d90517a40171626162796c6f6e2d6274632d7661756c74026f626974636f696e2d6d61696e6e657403d90130a1018a182cf500f500f500f400f4046864656164626565660367626162796c6f6e0401',
    );
  });

  it('should round-trip encode -> decode', () => {
    const hex = buildCall().toCBOR().toString('hex');
    const decoded = QRHardwareCall.fromCBOR(Buffer.from(hex, 'hex'));

    expect(decoded.getType()).toBe(QRHardwareCallType.DeriveContextHash);
    expect(decoded.getOrigin()).toBe('babylon');
    expect(decoded.getVersion()).toBe(QRHardwareCallVersion.V1);

    const params = decoded.getParams() as DeriveContextHashCall;
    expect(params.getAppName()).toBe('babylon-btc-vault');
    expect(params.getNetwork()).toBe('bitcoin-mainnet');
    expect(params.getContext()).toBe('deadbeef');
    expect(params.getKeypath().getPath()).toBe("44'/0'/0'/0/0");
  });
});
