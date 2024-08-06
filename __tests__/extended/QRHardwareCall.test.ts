import { CryptoKeypath, PathComponent } from '../../src';
import {
  QRHardwareCall,
  QRHardwareCallType,
  QRHardwareCallVersion,
} from '../../src/extended/QRHardwareCall';
import { KeyDerivation } from '../../src/extended/KeyDerivation';
import {
  ChainType,
  Curve,
  DerivationAlgorithm,
  KeyDerivationSchema,
} from '../../src/extended/DerivationSchema';

describe('QRHardwareCall', () => {
  it('should generate QRHardwareCall', () => {
    const keyPath1 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    const schema1 = new KeyDerivationSchema(keyPath1);
    const keyPath2 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
    ]);
    const schema2 = new KeyDerivationSchema(keyPath2, Curve.ed25519);

    const keyDerivation = new KeyDerivation([schema1, schema2]);
    const qrHardwareCall = new QRHardwareCall(
      QRHardwareCallType.KeyDerivation,
      keyDerivation,
    );

    const hex = qrHardwareCall.toCBOR().toString('hex');
    expect(hex).toBe(
      'a2010002d90515a10182d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a1018a182cf51901f5f500f500f500f402010300',
    );

    const ur = qrHardwareCall.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:qr-hardware-call/oeadaeaotaahbzoyadlftaahcmotadtaaddyoyadlncsdwykaeykaeykaoaeaxaetaahcmotadtaaddyoyadlecsdwykcfadykykaeykaeykaewkaoadaxaecnihhtjp',
    );
  });

  it('Test QRHardwareCall Version1 Example', () => {
    const keyPath1 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 1, hardened: true }),
    ]);

    const schema1 = new KeyDerivationSchema(
      keyPath1,
      Curve.ed25519,
      DerivationAlgorithm.slip10,
      ChainType.SOL,
    );
    const keyPath2 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
    ]);
    const schema2 = new KeyDerivationSchema(
      keyPath2,
      Curve.ed25519,
      DerivationAlgorithm.slip10,
      ChainType.SOL,
    );

    const keyPath3 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);
    const schema3 = new KeyDerivationSchema(
      keyPath3,
      Curve.ed25519,
      DerivationAlgorithm.slip10,
      ChainType.SOL,
    );

    const keyDerivation = new KeyDerivation([schema1, schema2, schema3]);
    const qrHardwareCall = new QRHardwareCall(
      QRHardwareCallType.KeyDerivation,
      keyDerivation,
      'XXX Wallet',
      QRHardwareCallVersion.V1,
    );

    const hex = qrHardwareCall.toCBOR().toString('hex');
    expect(hex).toBe(
      'a4010002d90515a10183d90516a401d90130a10186182cf51901f5f501f5020103000463534f4cd90516a401d90130a1018a182cf51901f5f500f500f500f4020103000463534f4cd90516a401d90130a10186182cf51901f5f500f5020103000463534f4c036a5858582057616c6c65740401',
    );

    const ur = qrHardwareCall.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:qr-hardware-call/oxadaeaotaahbzoyadlstaahcmoxadtaaddyoyadlncsdwykcfadykykadykaoadaxaeaaiagugwgstaahcmoxadtaaddyoyadlecsdwykcfadykykaeykaeykaewkaoadaxaeaaiagugwgstaahcmoxadtaaddyoyadlncsdwykcfadykykaeykaoadaxaeaaiagugwgsaximhdhdhdcxhghsjzjzihjyaaadfgdprppm',
    );
  });

  it('Test Generate QRHardwareCall Version1 Example2', () => {
    const keyPath1 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    const schema1 = new KeyDerivationSchema(
      keyPath1,
      Curve.secp256k1,
      DerivationAlgorithm.slip10,
      ChainType.BTC,
    );
    const keyPath2 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
    ]);
    const schema2 = new KeyDerivationSchema(
      keyPath2,
      Curve.ed25519,
      DerivationAlgorithm.slip10,
      ChainType.SOL,
    );

    const keyPath3 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 1, hardened: true }),
    ]);
    const schema3 = new KeyDerivationSchema(
      keyPath3,
      Curve.ed25519,
      DerivationAlgorithm.slip10,
      ChainType.SOL,
    );

    const keyDerivation = new KeyDerivation([schema1, schema2, schema3]);
    const qrHardwareCall = new QRHardwareCall(
      QRHardwareCallType.KeyDerivation,
      keyDerivation,
      'XXX Wallet',
      QRHardwareCallVersion.V1,
    );

    const hex = qrHardwareCall.toCBOR().toString('hex');
    expect(hex).toBe(
      'a4010002d90515a10183d90516a301d90130a10186182cf500f500f502000300d90516a401d90130a1018a182cf51901f5f500f500f500f4020103000463534f4cd90516a401d90130a10186182cf51901f5f501f5020103000463534f4c036a5858582057616c6c65740401',
    );

    const ur = qrHardwareCall.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:qr-hardware-call/oxadaeaotaahbzoyadlstaahcmotadtaaddyoyadlncsdwykaeykaeykaoaeaxaetaahcmoxadtaaddyoyadlecsdwykcfadykykaeykaeykaewkaoadaxaeaaiagugwgstaahcmoxadtaaddyoyadlncsdwykcfadykykadykaoadaxaeaaiagugwgsaximhdhdhdcxhghsjzjzihjyaaaduojkiede',
    );
  });

  it('should decode QRHardwareCall', () => {
    const hex =
      'a2010002d90515a10182d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a1018a182cf51901f5f500f500f500f402010300';
    const qrHardwareCall = QRHardwareCall.fromCBOR(Buffer.from(hex, 'hex'));
    expect(qrHardwareCall.getType()).toBe(QRHardwareCallType.KeyDerivation);

    const keyDerivation = qrHardwareCall.getParams() as KeyDerivation;
    const schemas = keyDerivation.getSchemas();
    expect(schemas[0].getCurve()).toBe(Curve.secp256k1);
    expect(schemas[0].getAlgo()).toBe(DerivationAlgorithm.slip10);
    expect(schemas[0].getKeypath().getPath()).toBe("44'/0'/0'");
    expect(schemas[1].getKeypath().getPath()).toBe("44'/501'/0'/0'/0");
  });
});
