import './patchCBOR';

import { CryptoHDKey } from './CryptoHDKey';
import { CryptoKeypath } from './CryptoKeypath';
import {
  CryptoCoinInfo,
  Type as CryptoCoinInfoType,
  Network as CryptoCoinInfoNetwork,
} from './CryptoCoinInfo';
import { CryptoECKey } from './CryptoECKey';
import { Bytes } from './Bytes';
import { CryptoOutput } from './CryptoOutput';
import { CryptoPSBT } from './CryptoPSBT';
import { CryptoAccount } from './CryptoAccount';
import { URRegistryDecoder } from './Decoder';

import { MultiKey } from './MultiKey';

import { ScriptExpressions } from './ScriptExpression';
import { PathComponent } from './PathComponent';

import { RegistryTypes, RegistryType } from './RegistryType';

import {
  addReader,
  addSemanticDecode,
  addSemanticEncode,
  addWriter,
  decodeToDataItem,
  encodeDataItem,
} from './lib';

export { DataItem } from './lib';
export { RegistryItem } from './RegistryItem';

import { patchTags } from './utils';

const URlib = {
  URRegistryDecoder,
  Bytes,
  CryptoAccount,
  CryptoHDKey,
  CryptoKeypath,
  CryptoCoinInfo,
  CryptoCoinInfoType,
  CryptoCoinInfoNetwork,
  CryptoECKey,
  CryptoOutput,
  CryptoPSBT,
  MultiKey,
  ScriptExpressions,
  PathComponent,
};

const cbor = {
  addReader,
  addSemanticDecode,
  addSemanticEncode,
  addWriter,
  patchTags,
};

const extend = {
  RegistryTypes,
  RegistryType,
  decodeToDataItem,
  encodeDataItem,
  cbor,
};

export {
  URRegistryDecoder,
  Bytes,
  CryptoAccount,
  CryptoHDKey,
  CryptoKeypath,
  CryptoCoinInfo,
  CryptoCoinInfoType,
  CryptoCoinInfoNetwork,
  CryptoECKey,
  CryptoOutput,
  CryptoPSBT,
  MultiKey,
  ScriptExpressions,
  PathComponent,
  extend,
};

export default URlib;
