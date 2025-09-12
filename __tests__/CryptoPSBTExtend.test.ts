import { CryptoPSBTExtend, CoinIds } from '../src';

describe('CryptoPSBTExtend', () => {
  it('test encode', () => {
    const hex =
      'a20158a770736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f0000000000000000000203';
    const coinId = CoinIds.Dogecoin;
    const psbtHex =
      '70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000';
      const cryptoPSBT = new CryptoPSBTExtend(Buffer.from(psbtHex, 'hex'), coinId);
      expect(cryptoPSBT.getPSBT().toString('hex')).toBe(psbtHex);
    expect(cryptoPSBT.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoPSBT.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-psbt-extend/oeadhdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaeaoaxjzhlbzyt',
    );
  });
});
