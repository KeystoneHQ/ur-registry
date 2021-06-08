# BC-UR-Registry

This repository is an implementation of [the BC-UR Registry specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md)

Currently support:

crypto-output, crypto-eckey, crypto-hdkey, crypto-keypath, crypto-coin-info, crypto-psbt, crypto-account

## Installing

To install, run:

```bash
yarn add @keystonehq/bc-ur-registry
```

## Usage Samples:

#### [CryptoOutput]Decode from cbor hex

```js
import { CryptoOutput } from '@keystonehq/bc-ur-registry';
// decode hex from UR: "ur:crypto-output/taadmutaadeyoyaxhdclaoswaalbmwfpwekijndyfefzjtmdrtketphhktmngrlkwsfnospypsasrhhhjonnvwtsqzwljy"
// by other BC-UR encoding or decoding library
const hex =
  'd90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';
const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(hex, 'hex'));
// You can know which class[CryptoOutput/CryptoHDKey/CryptoECKey/...] to use by reading ur, e.g.
// "ur:crypto-output/taadmutaadeyoyaxhdclaoswaalbmwfpwekijndyfefzjtmdrtketphhktmngrlkwsfnospypsasrhhhjonnvwtsqzwljy"
```

#### [CryptoOutput]Construct a p2pkh ecKey

```js
import {
  CryptoOutput,
  CryptoECKey,
  ScriptExpressions,
} from '@keystonehq/bc-ur-registry';

const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
const ecKey = new CryptoECKey({
  data: Buffer.from(
    '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
    'hex',
  ),
});

const cryptoOutput = new CryptoOutput(scriptExpressions, ecKey);
console.log(cryptoOutput.toCBOR().toString('hex'));
// "d90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5"
const ur = cryptoOutput.toUREncoder().nextPart();
console.log(ur);
// "ur:crypto-output/taadmutaadeyoyaxhdclaoswaalbmwfpwekijndyfefzjtmdrtketphhktmngrlkwsfnospypsasrhhhjonnvwtsqzwljy"
```

#### [CryptoOutput]Construct a p2pkh hdkey

```js
import {
  CryptoOutput,
  CryptoHDKey,
  CryptoKeypath,
  ScriptExpressions,
} from '@keystonehq/bc-ur-registry';

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

console.log(cryptoOutput.toCBOR().toString('hex'));
// 'd90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';
const ur = cryptoOutput.toUREncoder(1000).nextPart();
console.log(ur);
// 'ur:crypto-output/taadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmftpyaaeelb',
```

#### [CryptoHDKey]Construct a public testnet hdKey

```js
import {
  CryptoHDKey,
  CryptoKeypath,
  CryptoCoinInfo,
  PathComponent,
} from '@keystonehq/bc-ur-registry';
const coinInfo = new CryptoCoinInfo(undefined, CryptoCoinInfoNetwork.testnet);
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

console.log(cryptoHDKey.toCBOR().toString('hex').toUpperCase());
// "A5035821026FE2355745BB2DB3630BBC80EF5D58951C963C841F54170BA6E5C12BE7FC12A6045820CED155C72456255881793514EDC5BD9447E7F74ABB88C6D6B6480FD016EE8C8505D90131A1020106D90130A1018A182CF501F501F500F401F4081AE9181CF3"

const ur = cryptoHDKey.toUREncoder(1000).nextPart();
console.log(ur);
// 'ur:crypto-hdkey/onaxhdclaojlvoechgferkdpqdiabdrflawshlhdmdcemtfnlrctghchbdolvwsednvdztbgolaahdcxtottgostdkhfdahdlykkecbbweskrymwflvdylgerkloswtbrpfdbsticmwylklpahtaadehoyaoadamtaaddyoyadlecsdwykadykadykaewkadwkaycywlcscewfihbdaehn',
```

#### [CryptoOutput]Construct a multisig key consists of 2 hdkey

```js
import {
  CryptoHDKey,
  CryptoKeypath,
  CryptoCoinInfo,
  PathComponent,
  ScriptExpressions,
  MultiKey,
} from '@keystonehq/bc-ur-registry';
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
console.log(cryptoOutput.toCBOR().toString('hex'));
// 'd90191d90196a201010282d9012fa403582103cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a704582060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd968906d90130a1030007d90130a1018601f400f480f4d9012fa403582102fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea045820f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c06d90130a2018200f4021abd16bee507d90130a1018600f400f480f4'
const ur = cryptoOutput.toUREncoder(1000).nextPart();
console.log(ur);
// 'ur:crypto-output/taadmetaadmtoeadadaolftaaddloxaxhdclaxsbsgptsolkltkndsmskiaelfhhmdimcnmnlgutzotecpsfveylgrbdhptbpsveosaahdcxhnganelacwldjnlschnyfxjyplrllfdrplpswdnbuyctlpwyfmmhgsgtwsrymtldamtaaddyoyaxaeattaaddyoyadlnadwkaewklawktaaddloxaxhdclaoztnnhtwtpslgndfnwpzedrlomnclchrdfsayntlplplojznslfjejecpptlgbgwdaahdcxwtmhnyzmpkkbvdpyvwutglbeahmktyuogusnjonththhdwpsfzvdfpdlcndlkensamtaaddyoeadlfaewkaocyrycmrnvwattaaddyoyadlnaewkaewklawkkkztdlon',
```
