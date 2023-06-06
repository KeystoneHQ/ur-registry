import { CryptoKeypath, PathComponent } from '../../src';
import { QRHardwareCall, QRHardwareCallType } from '../../src/extended/QRHardwareCall';
import { KeyDerivation } from '../../src/extended/KeyDerivation';
import { Curve, DerivationAlgorithm, KeyDerivationSchema } from '../../src/extended/DerivationSchema';

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
    const qrHardwareCall = new QRHardwareCall(QRHardwareCallType.KeyDerivation, keyDerivation);

    const hex = qrHardwareCall.toCBOR().toString('hex');
    expect(hex).toBe(
      'a2010002d90515a10182d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a1018a182cf51901f5f500f500f500f402010300',
    );

    const ur = qrHardwareCall.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:qr-hardware-call/oeadaeaotaahbzoyadlftaahcmotadtaaddyoyadlncsdwykaeykaeykaoaeaxaetaahcmotadtaaddyoyadlecsdwykcfadykykaeykaeykaewkaoadaxaecnihhtjp',
    );
  });

  it('should decode QRHardwareCall', () => {
    const hex =
      'a2010002d90515a10182d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a1018a182cf51901f5f500f500f500f402010300';
    const qrHardwareCall = QRHardwareCall.fromCBOR(
      Buffer.from(hex, 'hex'),
    );
    expect(qrHardwareCall.getType()).toBe(QRHardwareCallType.KeyDerivation);

    const keyDerivation = qrHardwareCall.getParams() as KeyDerivation;
    const schemas = keyDerivation.getSchemas();
    expect(schemas[0].getCurve()).toBe(Curve.secp256k1);
    expect(schemas[0].getAlgo()).toBe(DerivationAlgorithm.slip10);
    expect(schemas[0].getKeypath().getPath()).toBe(
      '44\'/0\'/0\'',
    );
    expect(schemas[1].getKeypath().getPath()).toBe(
      '44\'/501\'/0\'/0\'/0',
    );
  });
});
