import {
  CryptoECKey,
  CryptoHDKey,
  CryptoKeypath,
  CryptoOutput,
  MultiKey,
  PathComponent,
} from '../src';
import { ScriptExpressions } from '../src';
describe('CryptoOutput', () => {
  it('test p2pkh eckey', () => {
    const hex =
      'd90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));

    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput.getECKey().getData().toString('hex')).toBe(
      '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
    );
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmutaadeyoyaxhdclaoswaalbmwfpwekijndyfefzjtmdrtketphhktmngrlkwsfnospypsasrhhhjonnvwtsqzwljy',
    );
  });
  it('test construct p2pkh eckey', () => {
    const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
    const ecKey = new CryptoECKey({
      data: Buffer.from(
        '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
        'hex',
      ),
    });

    const cryptoOutput = new CryptoOutput(scriptExpressions, ecKey);
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(
      'd90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
    );
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmutaadeyoyaxhdclaoswaalbmwfpwekijndyfefzjtmdrtketphhktmngrlkwsfnospypsasrhhhjonnvwtsqzwljy',
    );
  });
  it('test p2sh p2wpkh eckey', () => {
    const hex =
      'd90190d90194d90132a103582103fff97bd5755eeea420453a14355235d382f6472f8568a18b2f057a1460297556';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));
    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.WITNESS_PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput.getECKey().getData().toString('hex')).toBe(
      '03fff97bd5755eeea420453a14355235d382f6472f8568a18b2f057a1460297556',
    );
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmhtaadmwtaadeyoyaxhdclaxzmytkgtlkphywyoxcxfeftbbecgmectelfynfldllpisoyludlahknbbhndtkphfhlehmust',
    );
  });
  it('test construct p2sh p2wpkh eckey', () => {
    const hex =
      'd90190d90194d90132a103582103fff97bd5755eeea420453a14355235d382f6472f8568a18b2f057a1460297556';
    const scriptExpressions = [
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.WITNESS_PUBLIC_KEY_HASH,
    ];
    const ecKey = new CryptoECKey({
      data: Buffer.from(
        '03fff97bd5755eeea420453a14355235d382f6472f8568a18b2f057a1460297556',
        'hex',
      ),
    });
    const cryptoOutput = new CryptoOutput(scriptExpressions, ecKey);
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmhtaadmwtaadeyoyaxhdclaxzmytkgtlkphywyoxcxfeftbbecgmectelfynfldllpisoyludlahknbbhndtkphfhlehmust',
    );
  });
  it('test multi eckey', () => {
    const hex =
      'd90190d90196a201020282d90132a1035821022f01e5e15cca351daff3843fb70f3c2f0a1bdd05e5af888a67784ef3e10a2a01d90132a103582103acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));
    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.MULTISIG,
    ]);
    expect(cryptoOutput.getHDKey()).toBeUndefined();
    expect(cryptoOutput.getMultiKey().getThreshold()).toBe(2);
    const firstKey = cryptoOutput.getMultiKey().getEcKeys()[0];
    expect(firstKey.getData().toString('hex')).toBe(
      '022f01e5e15cca351daff3843fb70f3c2f0a1bdd05e5af888a67784ef3e10a2a01',
    );
    const secondKey = cryptoOutput.getMultiKey().getEcKeys()[1];
    expect(secondKey.getData().toString('hex')).toBe(
      '03acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
    );
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmhtaadmtoeadaoaolftaadeyoyaxhdclaodladvwvyhhsgeccapewflrfhrlbsfndlbkcwutahvwpeloleioksglwfvybkdradtaadeyoyaxhdclaxpstylrvowtstynguaspmchlenegonyryvtmsmtmsgshgvdbbsrhebybtztdisfrnpfadremh',
    );
  });
  it('test construct multi eckey', () => {
    const hex =
      'd90190d90196a201020282d90132a1035821022f01e5e15cca351daff3843fb70f3c2f0a1bdd05e5af888a67784ef3e10a2a01d90132a103582103acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe';
    const scriptExpressions = [
      ScriptExpressions.SCRIPT_HASH,
      ScriptExpressions.MULTISIG,
    ];

    const firstKey = new CryptoECKey({
      data: Buffer.from(
        '022f01e5e15cca351daff3843fb70f3c2f0a1bdd05e5af888a67784ef3e10a2a01',
        'hex',
      ),
    });
    const secondKey = new CryptoECKey({
      data: Buffer.from(
        '03acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'hex',
      ),
    });
    const multiKey = new MultiKey(2, [firstKey, secondKey], []);
    const cryptoOutput = new CryptoOutput(scriptExpressions, multiKey);
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder().nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmhtaadmtoeadaoaolftaadeyoyaxhdclaodladvwvyhhsgeccapewflrfhrlbsfndlbkcwutahvwpeloleioksglwfvybkdradtaadeyoyaxhdclaxpstylrvowtstynguaspmchlenegonyryvtmsmtmsgshgvdbbsrhebybtztdisfrnpfadremh',
    );
  });
  it('test p2pkh hdkey', () => {
    const hex =
      'd90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));

    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.PUBLIC_KEY_HASH,
    ]);
    expect(cryptoOutput.getHDKey().getKey().toString('hex')).toBe(
      '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
    );
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
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmftpyaaeelb',
    );
  });

  it('test construct p2pkh hdkey', () => {
    const hex =
      'd90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';
    const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
    const originKeypath = new CryptoKeypath(
      [
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ],
      Buffer.from('d34db33f', 'hex'),
    );
    const childrenKeypath = new CryptoKeypath([
      new PathComponent({ index: 1, hardened: false }),
      new PathComponent({ hardened: false }),
    ]);
    const hdkey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      chainCode: Buffer.from(
        '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
        'hex',
      ),
      origin: originKeypath,
      children: childrenKeypath,
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    const cryptoOutput = new CryptoOutput(scriptExpressions, hdkey);

    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmftpyaaeelb',
    );
  });
  it('test multi hdKey', () => {
    const hex =
      'd90191d90196a201010282d9012fa403582103cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a704582060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd968906d90130a1030007d90130a1018601f400f480f4d9012fa403582102fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea045820f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c06d90130a2018200f4021abd16bee507d90130a1018600f400f480f4';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));

    expect(cryptoOutput.getScriptExpressions()).toStrictEqual([
      ScriptExpressions.WITNESS_SCRIPT_HASH,
      ScriptExpressions.MULTISIG,
    ]);
    expect(cryptoOutput.getHDKey()).toBeUndefined();

    expect(cryptoOutput.getMultiKey().getThreshold()).toBe(1);

    const firstKey = cryptoOutput.getMultiKey().getHdKeys()[0];
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

    const secondKey = cryptoOutput.getMultiKey().getHdKeys()[1];
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
    const ur = cryptoOutput.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmetaadmtoeadadaolftaaddloxaxhdclaxsbsgptsolkltkndsmskiaelfhhmdimcnmnlgutzotecpsfveylgrbdhptbpsveosaahdcxhnganelacwldjnlschnyfxjyplrllfdrplpswdnbuyctlpwyfmmhgsgtwsrymtldamtaaddyoyaxaeattaaddyoyadlnadwkaewklawktaaddloxaxhdclaoztnnhtwtpslgndfnwpzedrlomnclchrdfsayntlplplojznslfjejecpptlgbgwdaahdcxwtmhnyzmpkkbvdpyvwutglbeahmktyuogusnjonththhdwpsfzvdfpdlcndlkensamtaaddyoeadlfaewkaocyrycmrnvwattaaddyoyadlnaewkaewklawkkkztdlon',
    );
  });

  it('test construct multi hdkey', () => {
    const hex =
      'd90191d90196a201010282d9012fa403582103cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a704582060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd968906d90130a1030007d90130a1018601f400f480f4d9012fa403582102fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea045820f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c06d90130a2018200f4021abd16bee507d90130a1018600f400f480f4';
    const scriptExpressions = [
      ScriptExpressions.WITNESS_SCRIPT_HASH,
      ScriptExpressions.MULTISIG,
    ];
    const firstKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7',
        'hex',
      ),
      chainCode: Buffer.from(
        '60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689',
        'hex',
      ),
      origin: new CryptoKeypath(undefined, undefined, 0),
      children: new CryptoKeypath(
        [
          new PathComponent({ index: 1, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ hardened: false }),
        ],
        undefined,
      ),
    });
    const secondKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea',
        'hex',
      ),
      chainCode: Buffer.from(
        'f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c',
        'hex',
      ),
      origin: new CryptoKeypath(
        [new PathComponent({ index: 0, hardened: false })],
        Buffer.from('bd16bee5', 'hex'),
      ),
      children: new CryptoKeypath([
        new PathComponent({ index: 0, hardened: false }),
        new PathComponent({ index: 0, hardened: false }),
        new PathComponent({ hardened: false }),
      ]),
    });
    const multiKey = new MultiKey(1, [], [firstKey, secondKey]);
    const cryptoOutput = new CryptoOutput(scriptExpressions, multiKey);
    expect(cryptoOutput.toCBOR().toString('hex')).toBe(hex);
    const ur = cryptoOutput.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      'ur:crypto-output/taadmetaadmtoeadadaolftaaddloxaxhdclaxsbsgptsolkltkndsmskiaelfhhmdimcnmnlgutzotecpsfveylgrbdhptbpsveosaahdcxhnganelacwldjnlschnyfxjyplrllfdrplpswdnbuyctlpwyfmmhgsgtwsrymtldamtaaddyoyaxaeattaaddyoyadlnadwkaewklawktaaddloxaxhdclaoztnnhtwtpslgndfnwpzedrlomnclchrdfsayntlplplojznslfjejecpptlgbgwdaahdcxwtmhnyzmpkkbvdpyvwutglbeahmktyuogusnjonththhdwpsfzvdfpdlcndlkensamtaaddyoeadlfaewkaocyrycmrnvwattaaddyoyadlnaewkaewklawkkkztdlon',
    );
  });
});
