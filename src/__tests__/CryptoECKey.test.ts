import { CryptoECKey } from '../CryptoECKey';
import { decodeToDataItem, encodeDataItem } from '../lib/cbor-sync';

describe('CryptoECKey', () => {
  it('test seed', () => {
    const hex =
      'A202F50358208C05C4B4F3E88840A4F4B5F155CFD69473EA169F3D0431B7A6787A23777F08AA';
    const data = Buffer.from(hex, 'hex');
    const dataItem = decodeToDataItem(data);

    const cryptoECKey = CryptoECKey.fromDataItem(dataItem);
    expect(cryptoECKey.getCurve()).toBe(0);
    expect(cryptoECKey.isPrivateKey()).toBeTruthy();
    expect(cryptoECKey.getData().toString('hex')).toBe(
      '8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa',
    );
    expect(encodeDataItem(cryptoECKey.toDataItem()).toString('hex')).toBe(
      hex.toLowerCase(),
    );
    const ur = cryptoECKey.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-eckey/oeaoykaxhdcxlkahssqzwfvslofzoxwkrewngotktbmwjkwdcmnefsaaehrlolkskncnktlbaypkrphsmyid',
    );
  });
});
