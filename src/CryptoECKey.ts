import { DataItem } from './DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryType, RegistryTypes } from './RegistryType';

enum Keys {
  curve = 1,
  private,
  data,
}

export class CryptoECKey extends RegistryItem {
  private data: Buffer;
  private curve: number;
  private privateKey: boolean;
  constructor(args: { data: Buffer; curve?: number; privateKey?: boolean }) {
    super();
    this.data = args.data;
    this.curve = args.curve || 0;
    this.privateKey = args.privateKey || false;
  }

  public getCurve = () => this.curve;
  public isPrivateKey = () => this.privateKey;
  public getData = () => this.data;

  getRegistryType = () => {
    return RegistryTypes.CRYPTO_ECKEY;
  };

  toDataItem = () => {
    const map = {};
    if (this.curve) {
      map[Keys.curve] = this.curve;
    }
    if (this.isPrivateKey !== undefined) {
      map[Keys.private] = this.privateKey;
    }
    map[Keys.data] = this.data;
    return new DataItem(map);
  };

  static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const curve = map[Keys.curve];
    const privateKey = map[Keys.private];
    const data = map[Keys.data];
    if (!data) {
      throw new Error(
        `#[ur-registry][CryptoECKey][fn.fromDataItem]: decoded [dataItem]#data is undefined: ${dataItem}`,
      );
    }
    return new CryptoECKey({ data, curve, privateKey });
  };
}
