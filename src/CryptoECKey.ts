import { decodeToDataItem, DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

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
    this.curve = args.curve;
    this.privateKey = args.privateKey;
  }

  public getCurve = () => this.curve || 0;
  public isPrivateKey = () => this.privateKey || false;
  public getData = () => this.data;

  getRegistryType = () => {
    return RegistryTypes.CRYPTO_ECKEY;
  };

  toDataItem = () => {
    const map = {};
    if (this.curve) {
      map[Keys.curve] = this.curve;
    }
    if (this.privateKey !== undefined) {
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
        `#[ur-registry][CryptoECKey][fn.fromDataItem]: decoded [dataItem][#data.data] is undefined: ${dataItem}`,
      );
    }
    return new CryptoECKey({ data, curve, privateKey });
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoECKey.fromDataItem(dataItem);
  };
}
