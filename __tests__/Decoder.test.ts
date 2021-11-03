import {
  Bytes,
  CryptoAccount,
  CryptoCoinInfoNetwork,
  CryptoECKey,
  CryptoHDKey,
  CryptoOutput,
  CryptoPSBT,
  ScriptExpressions,
} from '../src';
import { URRegistryDecoder } from '../src/Decoder';
describe('UR Registry Decoder', () => {
  let urRegistryDecoder: URRegistryDecoder;
  beforeEach(() => {
    urRegistryDecoder = new URRegistryDecoder();
  });
  it('should decode Bytes', () => {
    const ur = 'ur:bytes/gdaebycpeofygoiyktlonlpkrksfutwyzmwmfyeozs';
    urRegistryDecoder.receivePart(ur);
    const bytes = urRegistryDecoder.resultRegistryType() as Bytes;
    expect(bytes.getData().toString('hex')).toBe(
      '00112233445566778899aabbccddeeff',
    );
  });
  it('should decode CryptoHDKey', () => {
    const ur =
      'ur:crypto-hdkey/onaxhdclaojlvoechgferkdpqdiabdrflawshlhdmdcemtfnlrctghchbdolvwsednvdztbgolaahdcxtottgostdkhfdahdlykkecbbweskrymwflvdylgerkloswtbrpfdbsticmwylklpahtaadehoyaoadamtaaddyoyadlecsdwykadykadykaewkadwkaycywlcscewfihbdaehn';
    const hex =
      'A5035821026FE2355745BB2DB3630BBC80EF5D58951C963C841F54170BA6E5C12BE7FC12A6045820CED155C72456255881793514EDC5BD9447E7F74ABB88C6D6B6480FD016EE8C8505D90131A1020106D90130A1018A182CF501F501F500F401F4081AE9181CF3';
    urRegistryDecoder.receivePart(ur);
    const cryptoHDKey = urRegistryDecoder.resultRegistryType() as CryptoHDKey;
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
  });

  it('should decode CryptoECKey', () => {
    const hex =
      'A202F50358208C05C4B4F3E88840A4F4B5F155CFD69473EA169F3D0431B7A6787A23777F08AA';
    const ur =
      'ur:crypto-eckey/oeaoykaxhdcxlkahssqzwfvslofzoxwkrewngotktbmwjkwdcmnefsaaehrlolkskncnktlbaypkrphsmyid';
    urRegistryDecoder.receivePart(ur);
    const cryptoECKey = urRegistryDecoder.resultRegistryType() as CryptoECKey;
    expect(cryptoECKey.getCurve()).toBe(0);
    expect(cryptoECKey.isPrivateKey()).toBeTruthy();
    expect(cryptoECKey.getData().toString('hex')).toBe(
      '8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa',
    );
    expect(cryptoECKey.toCBOR().toString('hex')).toBe(hex.toLowerCase());
  });

  it('should decode CryptoOutput', () => {
    const ur =
      'ur:crypto-output/taadmetaadmtoeadadaolftaaddloxaxhdclaxsbsgptsolkltkndsmskiaelfhhmdimcnmnlgutzotecpsfveylgrbdhptbpsveosaahdcxhnganelacwldjnlschnyfxjyplrllfdrplpswdnbuyctlpwyfmmhgsgtwsrymtldamtaaddyoyaxaeattaaddyoyadlnadwkaewklawktaaddloxaxhdclaoztnnhtwtpslgndfnwpzedrlomnclchrdfsayntlplplojznslfjejecpptlgbgwdaahdcxwtmhnyzmpkkbvdpyvwutglbeahmktyuogusnjonththhdwpsfzvdfpdlcndlkensamtaaddyoeadlfaewkaocyrycmrnvwattaaddyoyadlnaewkaewklawkkkztdlon';
    const hex =
      'd90191d90196a201010282d9012fa403582103cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a704582060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd968906d90130a20180030007d90130a1018601f400f480f4d9012fa403582102fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea045820f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c06d90130a2018200f4021abd16bee507d90130a1018600f400f480f4';
    urRegistryDecoder.receivePart(ur);
    const cryptoOutput = urRegistryDecoder.resultRegistryType() as CryptoOutput;
    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.WITNESS_SCRIPT_HASH,
      ScriptExpressions.MULTISIG,
    ]);
    expect(cryptoOutput.getHDKey()).toBeUndefined();

    expect(cryptoOutput.getMultiKey().getThreshold()).toBe(1);

    const firstKey = cryptoOutput.getMultiKey().getKeys()[0] as CryptoHDKey;
    expect(firstKey.getKey().toString('hex')).toBe(
      '03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7',
    );
    expect(firstKey.getChainCode().toString('hex')).toBe(
      '60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689',
    );
    expect(firstKey.getOrigin().getPath()).toBeUndefined();
    expect(firstKey.getOrigin().getSourceFingerprint()).toBeUndefined();
    expect(firstKey.getOrigin().getDepth()).toBe(0);
    expect(firstKey.getChildren().getPath()).toBe('1/0/*');
    expect(firstKey.getChildren().getSourceFingerprint()).toBeUndefined();

    const secondKey = cryptoOutput.getMultiKey().getKeys()[1] as CryptoHDKey;
    expect(secondKey.getKey().toString('hex')).toBe(
      '02fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea',
    );
    expect(secondKey.getChainCode().toString('hex')).toBe(
      'f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c',
    );
    expect(secondKey.getOrigin().getPath()).toBe('0');
    expect(secondKey.getOrigin().getSourceFingerprint().toString('hex')).toBe(
      'bd16bee5',
    );
    expect(secondKey.getOrigin().getDepth()).toBeUndefined();
    expect(secondKey.getChildren().getPath()).toBe('0/0/*');
    expect(secondKey.getChildren().getSourceFingerprint()).toBeUndefined();

    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
  });

  it('should decode CryptoPSBT', () => {
    const hex =
      '58A770736274FF01009A020000000258E87A21B56DAF0C23BE8E7070456C336F7CBAA5C8757924F545887BB2ABDD750000000000FFFFFFFF838D0427D0EC650A68AA46BB0B098AEA4422C071B2CA78352A077959D07CEA1D0100000000FFFFFFFF0270AAF00800000000160014D85C2B71D0060B09C9886AEB815E50991DDA124D00E1F5050000000016001400AEA9A2E5F0F876A588DF5546E8742D1D87008F000000000000000000';
    const ur =
      'ur:crypto-psbt/hdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaebkgdcarh';
    urRegistryDecoder.receivePart(ur);
    const cryptoPSBT = urRegistryDecoder.resultRegistryType() as CryptoPSBT;
    const psbtHex =
      '70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000';
    expect(cryptoPSBT.getPSBT().toString('hex')).toBe(psbtHex);
    expect(cryptoPSBT.toCBOR().toString('hex')).toBe(hex.toLowerCase());
  });

  it('should decode CryptoAccount', () => {
    const hex =
      'A2011A37B5EED40286D90193D9012FA403582103EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD320458206456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B06D90130A10186182CF500F500F5081A99F9CDF7D90190D90194D9012FA403582102C7E4823730F6EE2CF864E2C352060A88E60B51A84E89E4C8C75EC22590AD6B690458209D2F86043276F9251A4A4F577166A5ABEB16B6EC61E226B5B8FA11038BFDA42D06D90130A101861831F500F500F5081AA80F7CDBD90194D9012FA403582103FD433450B6924B4F7EFDD5D1ED017D364BE95AB2B592DC8BDDB3B00C1C24F63F04582072EDE7334D5ACF91C6FDA622C205199C595A31F9218ED30792D301D5EE9E3A8806D90130A101861854F500F500F5081A0D5DE1D7D90190D9012FA4035821035CCD58B63A2CDC23D0812710603592E7457573211880CB59B1EF012E168E059A04582088D3299B448F87215D96B0C226235AFC027F9E7DC700284F3E912A34DAEB1A2306D90130A10182182DF5081A37B5EED4D90190D90191D9012FA4035821032C78EBFCABDAC6D735A0820EF8732F2821B4FB84CD5D6B26526938F90C0507110458207953EFE16A73E5D3F9F2D4C6E49BD88E22093BBD85BE5A7E862A4B98A16E0AB606D90130A101881830F500F500F501F5081A59B69B2AD90191D9012FA40358210260563EE80C26844621B06B74070BAF0E23FB76CE439D0237E87502EBBD3CA3460458202FA0E41C9DC43DC4518659BFCEF935BA8101B57DBC0812805DD983BC1D34B81306D90130A101881830F500F500F502F5081A59B69B2A';
    const ur =
      'ur:crypto-account/oeadcyemrewytyaolntaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykaycynlytsnyltaadmhtaadmwtaaddloxaxhdclaostvelfemdyynwydwyaievosrgmambklovabdgypdglldvespsthysadamhpmjeinaahdcxntdllnaaeykoytdacygegwhgjsiyonpywmcmrpwphsvodsrerozsbyaxluzcoxdpamtaaddyoyadlncsehykaeykaeykaycypdbskeuytaadmwtaaddloxaxhdclaxzcfxeegdrpmogrgwkbzctlttweadkiengrwlhtprremouoluutqdpfbncedkynfhaahdcxjpwevdeogthttkmeswzcolcpsaahcfnshkhtehytclmnteatmoteadtlwynnftloamtaaddyoyadlncsghykaeykaeykaycybthlvytstaadmhtaaddloxaxhdclaxhhsnhdrpftdwuocntilydibehnecmovdfekpjkclcslasbhkpawsaddmcmmnahnyaahdcxlotedtndfymyltclhlmtpfsadscnhtztaolbnnkistaedegwfmmedreetnwmcycnamtaaddyoyadlfcsdpykaycyemrewytytaadmhtaadmetaaddloxaxhdclaxdwkswmztpytnswtsecnblfbayajkdldeclqzzolrsnhljedsgminetytbnahatbyaahdcxkkguwsvyimjkvwteytwztyswvendtpmncpasfrrylprnhtkblndrgrmkoyjtbkrpamtaaddyoyadlocsdyykaeykaeykadykaycyhkrpnddrtaadmetaaddloxaxhdclaohnhffmvsbndslrfgclpfjejyatbdpebacnzokotofxntaoemvskpaowmryfnotfgaahdcxdlnbvecentssfsssgylnhkrstoytecrdlyadrekirfaybglahltalsrfcaeerobwamtaaddyoyadlocsdyykaeykaeykaoykaycyhkrpnddrgdaogykb';
    urRegistryDecoder.receivePart(ur);
    const cryptoAccount =
      urRegistryDecoder.resultRegistryType() as CryptoAccount;
    expect(cryptoAccount.getMasterFingerprint().toString('hex')).toBe(
      '37b5eed4',
    );

    const outputDescriptors = cryptoAccount.getOutputDescriptors();

    const cryptoOutput1 = outputDescriptors[0];
    expect(cryptoOutput1.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput1.getHDKey().getKey().toString('hex')).toBe(
      '03eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd32',
    );
    expect(cryptoOutput1.getHDKey().getChainCode().toString('hex')).toBe(
      '6456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b',
    );
    expect(cryptoOutput1.getHDKey().getOrigin().getPath()).toBe("44'/0'/0'");
    expect(
      cryptoOutput1.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('99f9cdf7');
    expect(cryptoOutput1.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput1.toString()).toBe("pkh(xpub6CnQkivUEH9bSbWVWfDLCtigKKgnSWGaVSRyCbN2QNBJzuvHT1vUQpgSpY1NiVvoeNEuVwk748Cn9G3NtbQB1aGGsEL7aYEnjVWgjj9tefu)");

    const cryptoOutput2 = outputDescriptors[1];
    expect(cryptoOutput2.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.WITNESS_PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput2.getHDKey().getKey().toString('hex')).toBe(
      '02c7e4823730f6ee2cf864e2c352060a88e60b51a84e89e4c8c75ec22590ad6b69',
    );
    expect(cryptoOutput2.getHDKey().getChainCode().toString('hex')).toBe(
      '9d2f86043276f9251a4a4f577166a5abeb16b6ec61e226b5b8fa11038bfda42d',
    );
    expect(cryptoOutput2.getHDKey().getOrigin().getPath()).toBe("49'/0'/0'");
    expect(
      cryptoOutput2.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('a80f7cdb');
    expect(cryptoOutput2.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput2.toString()).toBe("sh(wpkh(xpub6CtR1iF4dZPkEyXDwVf3HE74tSwXNMcHtBzX4gwz2UnPhJ54Jz5unHx2syYCCDkvVUmsmoYTmcaHXe1wJppvct4GMMaN5XAbRk7yGScRSte))");

    const cryptoOutput3 = outputDescriptors[2];
    expect(cryptoOutput3.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.WITNESS_PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput3.getHDKey().getKey().toString('hex')).toBe(
      '03fd433450b6924b4f7efdd5d1ed017d364be95ab2b592dc8bddb3b00c1c24f63f',
    );
    expect(cryptoOutput3.getHDKey().getChainCode().toString('hex')).toBe(
      '72ede7334d5acf91c6fda622c205199c595a31f9218ed30792d301d5ee9e3a88',
    );
    expect(cryptoOutput3.getHDKey().getOrigin().getPath()).toBe("84'/0'/0'");
    expect(
      cryptoOutput3.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('0d5de1d7');
    expect(cryptoOutput3.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput3.toString()).toBe("wpkh(xpub6BkU445MSEBXbPjD3g2c2ch6mn8yy1SXXQUM7EwjgYiq6Wt1NDwDZ45npqWcV8uQC5oi2gHuVukoCoZZyT4HKq8EpotPMqGqxdZRuapCQ23)");

    const cryptoOutput4 = outputDescriptors[3];
    expect(cryptoOutput4.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.SCRIPT_HASH,
    ]);
    expect(cryptoOutput4.getHDKey().getKey().toString('hex')).toBe(
      '035ccd58b63a2cdc23d0812710603592e7457573211880cb59b1ef012e168e059a',
    );
    expect(cryptoOutput4.getHDKey().getChainCode().toString('hex')).toBe(
      '88d3299b448f87215d96b0c226235afc027f9e7dc700284f3e912a34daeb1a23',
    );
    expect(cryptoOutput4.getHDKey().getOrigin().getPath()).toBe("45'");
    expect(
      cryptoOutput4.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('37b5eed4');
    expect(cryptoOutput4.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput4.toString()).toBe("sh(xpub68JFLJTH96GUqC6SoVw5c2qyLSt776PGu5xde8ddVACuPYyarvSL827TbZGavuNbKQ8DG3VP9fCXPhQRBgPrS4MPG3zaZgwAGuPHYvVuY9X)");

    const cryptoOutput5 = outputDescriptors[4];
    expect(cryptoOutput5.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.WITNESS_SCRIPT_HASH,
    ]);
    expect(cryptoOutput5.getHDKey().getKey().toString('hex')).toBe(
      '032c78ebfcabdac6d735a0820ef8732f2821b4fb84cd5d6b26526938f90c050711',
    );
    expect(cryptoOutput5.getHDKey().getChainCode().toString('hex')).toBe(
      '7953efe16a73e5d3f9f2d4c6e49bd88e22093bbd85be5a7e862a4b98a16e0ab6',
    );
    expect(cryptoOutput5.getHDKey().getOrigin().getPath()).toBe("48'/0'/0'/1'");
    expect(
      cryptoOutput5.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('59b69b2a');
    expect(cryptoOutput5.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput5.toString()).toBe("sh(wsh(xpub6EC9f7mLFJQoPaqDJ72Zbv67JWzmpXvCYQSecER9GzkYy5eWLsVLbHnxoAZ8NnnsrjhMLduJo9dG6fNQkmMFL3Qedj2kf5bEy5tptHPApNf))");

    const cryptoOutput6 = outputDescriptors[5];
    expect(cryptoOutput6.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.WITNESS_SCRIPT_HASH,
    ]);
    expect(cryptoOutput6.getHDKey().getKey().toString('hex')).toBe(
      '0260563ee80c26844621b06b74070baf0e23fb76ce439d0237e87502ebbd3ca346',
    );
    expect(cryptoOutput6.getHDKey().getChainCode().toString('hex')).toBe(
      '2fa0e41c9dc43dc4518659bfcef935ba8101b57dbc0812805dd983bc1d34b813',
    );
    expect(cryptoOutput6.getHDKey().getOrigin().getPath()).toBe("48'/0'/0'/2'");
    expect(
      cryptoOutput6.getHDKey().getParentFingerprint().toString('hex'),
    ).toBe('59b69b2a');
    expect(cryptoOutput6.getHDKey().getChildren()).toBeUndefined();
    expect(cryptoOutput6.toString()).toBe("wsh(xpub6EC9f7mLFJQoRQ6qiTvWQeeYsgtki6fBzSUgWgUtAujEMtAfJSAn3AVS4KrLHRV2hNX77YwNkg4azUzuSwhNGtcq4r2J8bLGMDkrQYHvoed)");

    expect(cryptoAccount.toCBOR().toString('hex')).toBe(hex.toLowerCase());
  });
});
