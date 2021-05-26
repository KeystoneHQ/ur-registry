import { DataItem } from './lib/DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

export class CryptoPSBT extends RegistryItem {
  getRegistryType = () => RegistryTypes.CRYPTO_PSBT;

  constructor(private psbt: Buffer) {
    super();
  }

  getPSBT = () => this.psbt;

  toDataItem = () => {
    return new DataItem(this.psbt);
  };

  static fromDataItem = (dataItem: DataItem) => {
    const psbt = dataItem.getData();
    if (!psbt) {
      throw new Error(
        `#[ur-registry][CryptoPSBT][fn.fromDataItem]: decoded [dataItem][#data] is undefined: ${dataItem}`,
      );
    }
    return new CryptoPSBT(psbt);
  };
}
