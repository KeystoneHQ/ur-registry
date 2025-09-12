import { decodeToDataItem, DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';
import { DataItemMap } from './types';

enum Keys {
  psbt = 1,
  coinId,
}

export enum CoinIds {
  Litecoin = 2,
  Dogecoin = 3,
  Dash = 4,
  BitcoinCash = 145,
}

export class CryptoPSBTExtend extends RegistryItem {
  getRegistryType = () => RegistryTypes.CRYPTO_PSBT_EXTEND;

  constructor(private psbt: Buffer, private coinId: CoinIds) {
    super();
  }

  public getPSBT = () => this.psbt;

  public getCoinId = () => this.coinId;

  public toDataItem = () => {
    const map: DataItemMap = {};
    map[Keys.psbt] = this.psbt;
    map[Keys.coinId] = this.coinId;
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const psbt = map[Keys.psbt];
    const coinId = map[Keys.coinId];
    if (!coinId) {
      throw new Error(
        `#[ur-registry][CryptoPSBTExtend][fn.fromDataItem]: decoded [dataItem][#data][coinId] is undefined: ${dataItem}`,
      );
    }
    if (!psbt) {
      throw new Error(
        `#[ur-registry][CryptoPSBTExtend][fn.fromDataItem]: decoded [dataItem][#data] is undefined: ${dataItem}`,
      );
    }
    return new CryptoPSBTExtend(psbt, coinId);
  };

  public static fromCBOR = (_cborPayload: Buffer): CryptoPSBTExtend => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoPSBTExtend.fromDataItem(dataItem);
  };
}
