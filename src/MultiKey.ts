import { CryptoECKey } from './CryptoECKey';
import { CryptoHDKey } from './CryptoHDKey';
import { DataItem } from './DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryType, RegistryTypes } from './RegistryType';

enum Keys {
  threshold = 1,
  keys,
}

export class MultiKey extends RegistryItem {
  getRegistryType: () => RegistryType;

  constructor(
    private threshold: number,
    private ecKeys: RegistryItem[],
    private hdKeys: RegistryItem[],
  ) {
    super();
  }

  getThreshold = () => this.threshold;
  getEcKeys = () => this.ecKeys;
  getHdKeys = () => this.hdKeys;

  toDataItem = () => {
    const map = {};
    map[Keys.threshold] = this.threshold;
    const keys = [];
    this.ecKeys.concat(this.hdKeys).forEach((k) => {
      const dataItem = k.toDataItem();
      dataItem.setTag(k.getRegistryType().getTag());
      keys.push(dataItem);
    });
    map[Keys.keys] = keys;
    return new DataItem(map);
  };

  static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const threshold = map[Keys.threshold];
    const keys = map[Keys.keys] as DataItem[];
    const ecKeys = [];
    const hdKeys = [];
    keys.forEach((k) => {
      if (k.getTag() === RegistryTypes.CRYPTO_HDKEY.getTag()) {
        hdKeys.push(CryptoHDKey.fromDataItem(k));
      } else if (k.getTag() === RegistryTypes.CRYPTO_ECKEY.getTag()) {
        ecKeys.push(CryptoECKey.fromDataItem(k));
      }
    });
    return new MultiKey(threshold, ecKeys, hdKeys);
  };
}
