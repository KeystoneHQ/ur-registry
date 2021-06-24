import {
  CryptoHDKey,
  CryptoKeypath,
  CryptoOutput,
  PathComponent,
  ScriptExpressions,
  CryptoAccount,
} from '../src';

import * as bitcoin from 'bitcoinjs-lib';
import { mnemonicToSeedSync } from 'bip39';

describe('CryptoAccount', () => {
  it('test seed', () => {
    const hex =
      'A2011A37B5EED40286D90193D9012FA403582103EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD320458206456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B06D90130A10186182CF500F500F5081A99F9CDF7D90190D90194D9012FA403582102C7E4823730F6EE2CF864E2C352060A88E60B51A84E89E4C8C75EC22590AD6B690458209D2F86043276F9251A4A4F577166A5ABEB16B6EC61E226B5B8FA11038BFDA42D06D90130A101861831F500F500F5081AA80F7CDBD90194D9012FA403582103FD433450B6924B4F7EFDD5D1ED017D364BE95AB2B592DC8BDDB3B00C1C24F63F04582072EDE7334D5ACF91C6FDA622C205199C595A31F9218ED30792D301D5EE9E3A8806D90130A101861854F500F500F5081A0D5DE1D7D90190D9012FA4035821035CCD58B63A2CDC23D0812710603592E7457573211880CB59B1EF012E168E059A04582088D3299B448F87215D96B0C226235AFC027F9E7DC700284F3E912A34DAEB1A2306D90130A10182182DF5081A37B5EED4D90190D90191D9012FA4035821032C78EBFCABDAC6D735A0820EF8732F2821B4FB84CD5D6B26526938F90C0507110458207953EFE16A73E5D3F9F2D4C6E49BD88E22093BBD85BE5A7E862A4B98A16E0AB606D90130A101881830F500F500F501F5081A59B69B2AD90191D9012FA40358210260563EE80C26844621B06B74070BAF0E23FB76CE439D0237E87502EBBD3CA3460458202FA0E41C9DC43DC4518659BFCEF935BA8101B57DBC0812805DD983BC1D34B81306D90130A101881830F500F500F502F5081A59B69B2A';
    const data = Buffer.from(hex, 'hex');
    const cryptoAccount = CryptoAccount.fromCBOR(data);
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

    expect(cryptoAccount.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoAccount.toUREncoder(2000).nextPart();
    expect(ur).toBe(
      'ur:crypto-account/oeadcyemrewytyaolntaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykaycynlytsnyltaadmhtaadmwtaaddloxaxhdclaostvelfemdyynwydwyaievosrgmambklovabdgypdglldvespsthysadamhpmjeinaahdcxntdllnaaeykoytdacygegwhgjsiyonpywmcmrpwphsvodsrerozsbyaxluzcoxdpamtaaddyoyadlncsehykaeykaeykaycypdbskeuytaadmwtaaddloxaxhdclaxzcfxeegdrpmogrgwkbzctlttweadkiengrwlhtprremouoluutqdpfbncedkynfhaahdcxjpwevdeogthttkmeswzcolcpsaahcfnshkhtehytclmnteatmoteadtlwynnftloamtaaddyoyadlncsghykaeykaeykaycybthlvytstaadmhtaaddloxaxhdclaxhhsnhdrpftdwuocntilydibehnecmovdfekpjkclcslasbhkpawsaddmcmmnahnyaahdcxlotedtndfymyltclhlmtpfsadscnhtztaolbnnkistaedegwfmmedreetnwmcycnamtaaddyoyadlfcsdpykaycyemrewytytaadmhtaadmetaaddloxaxhdclaxdwkswmztpytnswtsecnblfbayajkdldeclqzzolrsnhljedsgminetytbnahatbyaahdcxkkguwsvyimjkvwteytwztyswvendtpmncpasfrrylprnhtkblndrgrmkoyjtbkrpamtaaddyoyadlocsdyykaeykaeykadykaycyhkrpnddrtaadmetaaddloxaxhdclaohnhffmvsbndslrfgclpfjejyatbdpebacnzokotofxntaoemvskpaowmryfnotfgaahdcxdlnbvecentssfsssgylnhkrstoytecrdlyadrekirfaybglahltalsrfcaeerobwamtaaddyoyadlocsdyykaeykaeykaoykaycyhkrpnddrgdaogykb',
    );
  });

  it('test construct', () => {
    const p2pkh = new CryptoOutput(
      [ScriptExpressions.PUBLIC_KEY_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '03eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd32',
          'hex',
        ),
        chainCode: Buffer.from(
          '6456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 44, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('99f9cdf7', 'hex'),
      }),
    );

    const p2sh_p2wpkh = new CryptoOutput(
      [
        ScriptExpressions.SCRIPT_HASH,
        ScriptExpressions.WITNESS_PUBLIC_KEY_HASH,
      ],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '02c7e4823730f6ee2cf864e2c352060a88e60b51a84e89e4c8c75ec22590ad6b69',
          'hex',
        ),
        chainCode: Buffer.from(
          '9d2f86043276f9251a4a4f577166a5abeb16b6ec61e226b5b8fa11038bfda42d',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 49, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('a80f7cdb', 'hex'),
      }),
    );

    const p2wpkh = new CryptoOutput(
      [ScriptExpressions.WITNESS_PUBLIC_KEY_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '03fd433450b6924b4f7efdd5d1ed017d364be95ab2b592dc8bddb3b00c1c24f63f',
          'hex',
        ),
        chainCode: Buffer.from(
          '72ede7334d5acf91c6fda622c205199c595a31f9218ed30792d301d5ee9e3a88',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 84, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('0d5de1d7', 'hex'),
      }),
    );

    const p2sh_multisig = new CryptoOutput(
      [ScriptExpressions.SCRIPT_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '035ccd58b63a2cdc23d0812710603592e7457573211880cb59b1ef012e168e059a',
          'hex',
        ),
        chainCode: Buffer.from(
          '88d3299b448f87215d96b0c226235afc027f9e7dc700284f3e912a34daeb1a23',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 45, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('37b5eed4', 'hex'),
      }),
    );

    const p2sh_p2wsh = new CryptoOutput(
      [ScriptExpressions.SCRIPT_HASH, ScriptExpressions.WITNESS_SCRIPT_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '032c78ebfcabdac6d735a0820ef8732f2821b4fb84cd5d6b26526938f90c050711',
          'hex',
        ),
        chainCode: Buffer.from(
          '7953efe16a73e5d3f9f2d4c6e49bd88e22093bbd85be5a7e862a4b98a16e0ab6',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 48, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 1, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('59b69b2a', 'hex'),
      }),
    );

    const p2wsh = new CryptoOutput(
      [ScriptExpressions.WITNESS_SCRIPT_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '0260563ee80c26844621b06b74070baf0e23fb76ce439d0237e87502ebbd3ca346',
          'hex',
        ),
        chainCode: Buffer.from(
          '2fa0e41c9dc43dc4518659bfcef935ba8101b57dbc0812805dd983bc1d34b813',
          'hex',
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 48, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 2, hardened: true }),
        ]),
        parentFingerprint: Buffer.from('59b69b2a', 'hex'),
      }),
    );

    const cryptoAccount = new CryptoAccount(Buffer.from('37b5eed4', 'hex'), [
      p2pkh,
      p2sh_p2wpkh,
      p2wpkh,
      p2sh_multisig,
      p2sh_p2wsh,
      p2wsh,
    ]);

    expect(cryptoAccount.getMasterFingerprint().toString('hex')).toBe(
      '37b5eed4',
    );

    const hex =
      'A2011A37B5EED40286D90193D9012FA403582103EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD320458206456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B06D90130A10186182CF500F500F5081A99F9CDF7D90190D90194D9012FA403582102C7E4823730F6EE2CF864E2C352060A88E60B51A84E89E4C8C75EC22590AD6B690458209D2F86043276F9251A4A4F577166A5ABEB16B6EC61E226B5B8FA11038BFDA42D06D90130A101861831F500F500F5081AA80F7CDBD90194D9012FA403582103FD433450B6924B4F7EFDD5D1ED017D364BE95AB2B592DC8BDDB3B00C1C24F63F04582072EDE7334D5ACF91C6FDA622C205199C595A31F9218ED30792D301D5EE9E3A8806D90130A101861854F500F500F5081A0D5DE1D7D90190D9012FA4035821035CCD58B63A2CDC23D0812710603592E7457573211880CB59B1EF012E168E059A04582088D3299B448F87215D96B0C226235AFC027F9E7DC700284F3E912A34DAEB1A2306D90130A10182182DF5081A37B5EED4D90190D90191D9012FA4035821032C78EBFCABDAC6D735A0820EF8732F2821B4FB84CD5D6B26526938F90C0507110458207953EFE16A73E5D3F9F2D4C6E49BD88E22093BBD85BE5A7E862A4B98A16E0AB606D90130A101881830F500F500F501F5081A59B69B2AD90191D9012FA40358210260563EE80C26844621B06B74070BAF0E23FB76CE439D0237E87502EBBD3CA3460458202FA0E41C9DC43DC4518659BFCEF935BA8101B57DBC0812805DD983BC1D34B81306D90130A101881830F500F500F502F5081A59B69B2A';
    expect(cryptoAccount.toCBOR().toString('hex')).toBe(hex.toLowerCase());
    const ur = cryptoAccount.toUREncoder(2000).nextPart();
    expect(ur).toBe(
      'ur:crypto-account/oeadcyemrewytyaolntaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykaycynlytsnyltaadmhtaadmwtaaddloxaxhdclaostvelfemdyynwydwyaievosrgmambklovabdgypdglldvespsthysadamhpmjeinaahdcxntdllnaaeykoytdacygegwhgjsiyonpywmcmrpwphsvodsrerozsbyaxluzcoxdpamtaaddyoyadlncsehykaeykaeykaycypdbskeuytaadmwtaaddloxaxhdclaxzcfxeegdrpmogrgwkbzctlttweadkiengrwlhtprremouoluutqdpfbncedkynfhaahdcxjpwevdeogthttkmeswzcolcpsaahcfnshkhtehytclmnteatmoteadtlwynnftloamtaaddyoyadlncsghykaeykaeykaycybthlvytstaadmhtaaddloxaxhdclaxhhsnhdrpftdwuocntilydibehnecmovdfekpjkclcslasbhkpawsaddmcmmnahnyaahdcxlotedtndfymyltclhlmtpfsadscnhtztaolbnnkistaedegwfmmedreetnwmcycnamtaaddyoyadlfcsdpykaycyemrewytytaadmhtaadmetaaddloxaxhdclaxdwkswmztpytnswtsecnblfbayajkdldeclqzzolrsnhljedsgminetytbnahatbyaahdcxkkguwsvyimjkvwteytwztyswvendtpmncpasfrrylprnhtkblndrgrmkoyjtbkrpamtaaddyoyadlocsdyykaeykaeykadykaycyhkrpnddrtaadmetaaddloxaxhdclaohnhffmvsbndslrfgclpfjejyatbdpebacnzokotofxntaoemvskpaowmryfnotfgaahdcxdlnbvecentssfsssgylnhkrstoytecrdlyadrekirfaybglahltalsrfcaeerobwamtaaddyoyadlocsdyykaeykaeykaoykaycyhkrpnddrgdaogykb',
    );
  });

  it('test construct 2', () => {
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seed = mnemonicToSeedSync(mnemonic);
    const rootKey = bitcoin.bip32.fromSeed(seed);
    const masterFingerprint = rootKey.fingerprint;
    const p2wsh_key = rootKey.derivePath("48'/0'/0'/2'");
    const _parentFingerprint = p2wsh_key.parentFingerprint;
    const parentFingerprint = Buffer.alloc(4);
    parentFingerprint.writeUInt32BE(_parentFingerprint);
    const cryptoAccount = new CryptoAccount(masterFingerprint, [
      new CryptoOutput(
        [ScriptExpressions.WITNESS_SCRIPT_HASH],
        new CryptoHDKey({
          isMaster: false,
          key: p2wsh_key.publicKey,
          chainCode: p2wsh_key.chainCode,
          origin: new CryptoKeypath(
            [
              new PathComponent({ index: 48, hardened: true }),
              new PathComponent({ index: 0, hardened: true }),
              new PathComponent({ index: 0, hardened: true }),
              new PathComponent({ index: 2, hardened: true }),
            ],
            masterFingerprint,
            p2wsh_key.depth,
          ),
          parentFingerprint,
        }),
      ),
    ]);
    const ur = cryptoAccount.toUREncoder(2000).nextPart();
    expect(ur).toBe(
      'ur:crypto-account/oeadcyjksktnbkaolytaadmetaaddloxaxhdclaocyfrykzoylemtiwfinmuzcfguogabwasfrwmgudpihgwvturtalutdkplpuonedtaahdcxrknbstsgcmbkltbazerhfzpymhtiwkdegwwdcwhybtclchiokblffhsrkbdphgiaamtaaddyotadlocsdyykaeykaeykaoykaocyjksktnbkaxaaaycycewzmscmvlaabkzs',
    );
  });
});
