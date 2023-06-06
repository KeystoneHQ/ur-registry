import { CryptoKeypath, PathComponent } from '../../src';
import { KeyDerivation } from '../../src/extended/KeyDerivation';
import { Curve, DerivationAlgorithm, KeyDerivationSchema } from '../../src/extended/DerivationSchema';

describe('KeyDerivation', () => {
  it('should generate KeyDerivation', () => {
    const keyPath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    const schema = new KeyDerivationSchema(keyPath);

    const keyDerivation = new KeyDerivation([schema]);
    const hex = keyDerivation.toCBOR().toString('hex');
    expect(hex).toBe(
      'a10181d90516a301d90130a10186182cf500f500f502000300',
    );

    const ur = keyDerivation.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:key-derivation-call/oyadlytaahcmotadtaaddyoyadlncsdwykaeykaeykaoaeaxaeaxzmwyam',
    );
  });

  it('should decode KeyDerivation', () => {
    const hex =
      'a10181d90516a301d90130a10186182cf500f500f502000300';
    const keyDerivation = KeyDerivation.fromCBOR(
      Buffer.from(hex, 'hex'),
    );
    const schemas = keyDerivation.getSchemas();
    expect(schemas[0].getCurve()).toBe(Curve.secp256k1);
    expect(schemas[0].getAlgo()).toBe(DerivationAlgorithm.slip10);
    expect(schemas[0].getKeypath().getPath()).toBe(
      '44\'/0\'/0\'',
    );
  });
});
