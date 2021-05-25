import { decode, encode } from '../lib/cbor-sync';
import { CryptoOutput } from '../CryptoOutput';
import { ScriptExpressions } from '../ScriptExpression';
describe('CryptoOutput', () => {
  it('test p2pkh hdkey', () => {
    const hex =
      'd90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';
    const data = Buffer.from(hex, 'hex');
    const dataItem = decode(data);
    const cryptoOutput = CryptoOutput.fromDataItem(dataItem);

    expect(ScriptExpressions.PUBLIC_KEY_HASH.getTag()).toBe(
      cryptoOutput.getScriptExpressions()[0].getTag(),
    );
    expect(
      '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
    ).toBe(cryptoOutput.getHDKey().getKey().toString('hex'));
    expect(cryptoOutput.getHDKey().getChainCode().toString('hex')).toBe(
      '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
    );
    expect(cryptoOutput.getHDKey().getOrigin().getPath()).toBe("44'/0'/0'");
    expect(
      cryptoOutput
        .getHDKey()
        .getOrigin()
        .getSourceFingerprint()
        .toString('hex'),
    ).toBe('d34db33f');
    expect(cryptoOutput.getHDKey().getParentFingerprint().toString('hex')).toBe(
      '78412e3a',
    );
    expect(cryptoOutput.getHDKey().getChildren().getPath()).toBe('1/*');
    expect(
      cryptoOutput.getHDKey().getChildren().getSourceFingerprint(),
    ).toBeUndefined();
    expect(encode(cryptoOutput.toDataItem()).toString('hex')).toBe(hex);
  });
});
