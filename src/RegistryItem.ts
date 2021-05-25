import { UR } from '@apocentre/bc-ur';
import { encode } from './lib/cbor-sync';
import { DataItem } from './DataItem';
import { RegistryType } from './RegistryType';

export abstract class RegistryItem{
  abstract getRegistryType: () => RegistryType;
  abstract toDataItem: () => DataItem;
  public toUR = () => {
    if (this.toDataItem() === undefined) {
      throw new Error(
        `#[ur-registry][RegistryItem][fn.toUR]: registry ${this.getRegistryType()}'s method toDataItem returns undefined`,
      );
    }
    return new UR(encode(this.toDataItem()), this.getRegistryType().getType());
  };
}
