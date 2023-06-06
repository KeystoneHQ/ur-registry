import { RegistryTypes } from "../RegistryType";
import { RegistryItem } from "../RegistryItem";
import { DataItem, decodeToDataItem } from '../lib';
import { DataItemMap } from '../types';
import { KeyDerivationSchema } from './DerivationSchema';

enum Keys {
  schemas = 1,
}

export class KeyDerivation extends RegistryItem {
  getRegistryType = () => RegistryTypes.KEY_DERIVATION_CALL;

  constructor(
    private schemas: KeyDerivationSchema[],
  ) {
    super();
  }

  public getSchemas = (): KeyDerivationSchema[] => this.schemas;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    map[Keys.schemas] = this.schemas.map(schema => {
      const dataItem = schema.toDataItem()
      dataItem.setTag(schema.getRegistryType().getTag());
      return dataItem;
    });

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): KeyDerivation => {
    const map = dataItem.getData();
    const schemas = map[Keys.schemas].map(keypath =>
      KeyDerivationSchema.fromDataItem(keypath)
    )
    return new KeyDerivation(schemas);
  };

  public static fromCBOR = (_cborPayload: Buffer): KeyDerivation => {
    const dataItem = decodeToDataItem(_cborPayload);
    return KeyDerivation.fromDataItem(dataItem);
  };
}
