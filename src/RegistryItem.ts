import { UR } from '@apocentre/bc-ur';
import { encode } from 'cbor-sync';
import { DataItem } from './DataItem';
import { RegistryType } from './RegistryType';

export abstract class RegistryItem{
  abstract getRegistryType: () => RegistryType;
  abstract toDataItem: () => DataItem;
  public toUR = () => {
    if (this.toDataItem() === undefined) {
      throw new Error(
        `#ur-registry_error: registry ${this.getRegistryType()}'s method toCbor returns undefined`,
      );
    }
    return new UR(encode(this.toDataItem()), this.getRegistryType().getType());
  };
}
