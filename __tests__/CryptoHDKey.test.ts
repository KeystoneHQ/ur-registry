import {
  CryptoCoinInfo,
  CryptoCoinInfoNetwork,
  CryptoKeypath,
  PathComponent,
} from '../src';
import { CryptoHDKey } from '../src';
import * as BIP32 from "bip32";

describe('CryptoHDKey', () => {
  it('test master key', () => {
    const hex =
      'A301F503582100E8F32E723DECF4051AEFAC8E2C93C9C5B214313817CDB01A1494B917C8436B35045820873DFF81C02F525623FD1FE5167EAC3A55A049DE3D314BB42EE227FFED37D508';
    const cryptoHDKey = CryptoHDKey.fromCBOR(Buffer.from(hex, 'hex'));
    expect(cryptoHDKey.isMaster()).toBe(true);
    expect(cryptoHDKey.getKey().toString('hex')).toBe(
      '00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
    );
    expect(cryptoHDKey.getChainCode().toString('hex')).toBe(
      '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
    );
    expect(cryptoHDKey.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoHDKey.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-hdkey/otadykaxhdclaevswfdmjpfswpwkahcywspsmndwmusoskprbbehetchsnpfcybbmwrhchspfxjeecaahdcxltfszmlyrtdlgmhfcnzcctvwcmkbpsftgonbgauefsehgrqzdmvodizmweemtlaybakiylat',
    );
  });

  it('test public testnet', () => {
    const hex =
      'A5035821026FE2355745BB2DB3630BBC80EF5D58951C963C841F54170BA6E5C12BE7FC12A6045820CED155C72456255881793514EDC5BD9447E7F74ABB88C6D6B6480FD016EE8C8505D90131A1020106D90130A1018A182CF501F501F500F401F4081AE9181CF3';

    const cryptoHDKey = CryptoHDKey.fromCBOR(Buffer.from(hex, 'hex'));
    expect(cryptoHDKey.isMaster()).toBeFalsy();
    expect(cryptoHDKey.isPrivateKey()).toBeFalsy();
    expect(cryptoHDKey.getKey().toString('hex')).toBe(
      '026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6',
    );
    expect(cryptoHDKey.getChainCode().toString('hex')).toBe(
      'ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85',
    );
    expect(cryptoHDKey.getUseInfo().getNetwork()).toBe(
      CryptoCoinInfoNetwork.testnet,
    );
    expect(cryptoHDKey.getOrigin().getPath()).toBe("44'/1'/1'/0/1");
    expect(cryptoHDKey.getParentFingerprint().toString('hex')).toBe('e9181cf3');
    expect(cryptoHDKey.getChildren()).toBeUndefined();
    expect(cryptoHDKey.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoHDKey.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-hdkey/onaxhdclaojlvoechgferkdpqdiabdrflawshlhdmdcemtfnlrctghchbdolvwsednvdztbgolaahdcxtottgostdkhfdahdlykkecbbweskrymwflvdylgerkloswtbrpfdbsticmwylklpahtaadehoyaoadamtaaddyoyadlecsdwykadykadykaewkadwkaycywlcscewfihbdaehn',
    );
  });

  it('test construct public test', () => {
    const hex =
      'A5035821026FE2355745BB2DB3630BBC80EF5D58951C963C841F54170BA6E5C12BE7FC12A6045820CED155C72456255881793514EDC5BD9447E7F74ABB88C6D6B6480FD016EE8C8505D90131A1020106D90130A1018A182CF501F501F500F401F4081AE9181CF3';
    const coinInfo = new CryptoCoinInfo(
      undefined,
      CryptoCoinInfoNetwork.testnet,
    );
    const originkeypath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 1, hardened: true }),
      new PathComponent({ index: 1, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
      new PathComponent({ index: 1, hardened: false }),
    ]);
    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6',
        'hex',
      ),
      chainCode: Buffer.from(
        'ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85',
        'hex',
      ),
      useInfo: coinInfo,
      parentFingerprint: Buffer.from('e9181cf3', 'hex'),
      origin: originkeypath,
    });

    expect(cryptoHDKey.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoHDKey.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-hdkey/onaxhdclaojlvoechgferkdpqdiabdrflawshlhdmdcemtfnlrctghchbdolvwsednvdztbgolaahdcxtottgostdkhfdahdlykkecbbweskrymwflvdylgerkloswtbrpfdbsticmwylklpahtaadehoyaoadamtaaddyoyadlecsdwykadykadykaewkadwkaycywlcscewfihbdaehn',
    );
  });

  it('test it can generate m level derivation key', () => {
    const extendedPublicKey = "xpub661MyMwAqRbcGrSy23RC9y3S1QS1TUFmwj64mpx6k2vFwz1vcS7BcToj4NoTsu1pjZHJnHxTsrKu2UHaKhRqRbHHhbjAN2ytU8hUpYgkaYq"

    let node = BIP32.fromBase58(extendedPublicKey)

    const hex = "A303582103AC3DF08EC59F6F1CDC55B3007F90F1A98435EC345C3CAC400EDE1DD533D75FA9045820E8145DB627E79188E14C1FD6C772998509961D358FE8ECF3D7CC43BB1D0F952006D90130A20180021A854BC782"
    const originkeypath = new CryptoKeypath([], node.fingerprint);
    const cryptoHDKey = new CryptoHDKey({
      isMaster:false,
      key: node.publicKey,
      chainCode: node.chainCode,
      origin: originkeypath
    })
    expect(cryptoHDKey.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoHDKey.toUREncoder(1000).nextPart();
    expect(ur).toBe("ur:crypto-hdkey/otaxhdclaxpsfswtmnsknejlceuogoqdaelbmhwnptlrecwpeehhfnpsfzbauecatleotsheptaahdcxvsbbhlrpdivdmelovygscttbstjpnllpasmtcaecmyvswpwftssffxrkcabsmdcxamtaaddyoeadlaaocylpgrstlfiewtseje")
  })
});
