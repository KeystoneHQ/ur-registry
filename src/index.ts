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
};

export default URlib;
