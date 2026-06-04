import { CryptoKeypath, PathComponent } from '../../src';
import {
  QRHardwareCall,
  QRHardwareCallType,
  QRHardwareCallVersion,
} from '../../src/extended/QRHardwareCall';
import { DeriveContextHashCall } from '../../src/extended/DeriveContextHashCall';

/**
 * Generates sample `derive-context-hash` qr-hardware-call URs for manual testing
 * (e.g. rendering a QR to scan in the Keystone simulator / firmware).
 *
 * Run with output visible:
 *   npx jest DeriveContextHashCall.fixtures --silent=false
 *
 * Each fixture is also asserted to round-trip, so this doubles as a regression test.
 */

type PathPart = { index: number; hardened: boolean };

const path = (...parts: PathPart[]) =>
  new CryptoKeypath(parts.map((p) => new PathComponent(p)));

const h = (n: number, hardened = true): PathPart => ({ index: n, hardened });

const buildCall = (
  appName: string,
  network: string,
  keyPath: CryptoKeypath,
  context: string,
  origin = 'babylon',
) =>
  new QRHardwareCall(
    QRHardwareCallType.DeriveContextHash,
    new DeriveContextHashCall(appName, network, keyPath, context),
    origin,
    QRHardwareCallVersion.V1,
  );

const fixtures: { name: string; call: QRHardwareCall }[] = [
  {
    name: 'taproot / mainnet / short context',
    call: buildCall(
      'babylon-btc-vault',
      'bitcoin-mainnet',
      path(h(86), h(0), h(0), h(0, false), h(0, false)),
      'deadbeef',
    ),
  },
  {
    name: 'taproot / mainnet / 512-byte context (scroll test)',
    call: buildCall(
      'babylon-btc-vault',
      'bitcoin-mainnet',
      path(h(86), h(0), h(0), h(0, false), h(0, false)),
      'deadbeef'.repeat(10),
    ),
  },
  {
    name: 'native segwit / testnet / short context',
    call: buildCall(
      'ordinals-market',
      'bitcoin-testnet',
      path(h(84), h(0), h(0), h(0, false), h(0, false)),
      '00112233445566778899aabbccddeeff',
    ),
  },
  {
    name: 'native segwit / testnet / short context',
    call: buildCall(
      'ordinals-market',
      'bitcoin-testnet',
      path(h(44), h(0), h(0), h(0, false), h(0, false)),
      '00112233445566778899aabbccddeeff',
    ),
  },
  {
    name: 'invaild value',
    call: buildCall(
      'test-app',
      'signet',
      path(h(44), h(0), h(0), h(0, false), h(0, false)),
      '00112233445566778899aabbccddeeff',
    ),
  },
];

describe('DeriveContextHashCall fixtures', () => {
  fixtures.forEach(({ name, call }) => {
    it(name, () => {
      // Large fragment length -> single-part UR (one static QR) where possible.
      const ur = call.toUREncoder(3000).nextPart();
      const cbor = call.toCBOR().toString('hex');

      // eslint-disable-next-line no-console
      console.log(`\n[${name}]\nUR:   ${ur.toUpperCase()}\nCBOR: ${cbor}\n`);

      expect(ur.startsWith('ur:qr-hardware-call/')).toBe(true);

      const decoded = QRHardwareCall.fromCBOR(Buffer.from(cbor, 'hex'));
      expect(decoded.getType()).toBe(QRHardwareCallType.DeriveContextHash);
      const params = decoded.getParams() as DeriveContextHashCall;
      const original = call.getParams() as DeriveContextHashCall;
      expect(params.getAppName()).toBe(original.getAppName());
      expect(params.getNetwork()).toBe(original.getNetwork());
      expect(params.getContext()).toBe(original.getContext());
      expect(params.getKeypath().getPath()).toBe(
        original.getKeypath().getPath(),
      );
    });
  });
});
