import { UR, UREncoder } from '@apocentre/bc-ur';
import { encodeDataItem } from './lib/cbor-sync';
import { DataItem } from './lib/DataItem';
import { RegistryType } from './RegistryType';

export abstract class RegistryItem {
  abstract getRegistryType: () => RegistryType;
  abstract toDataItem: () => DataItem;
  public toUR = () => {
    if (this.toDataItem() === undefined) {
      throw new Error(
        `#[ur-registry][RegistryItem][fn.toUR]: registry ${this.getRegistryType()}'s method toDataItem returns undefined`,
      );
    }
    return new UR(
      encodeDataItem(this.toDataItem()),
      this.getRegistryType().getType(),
    );
  };

  public toUREncoder = (
    maxFragmentLength?: number,
    firstSeqNum?: number,
    minFragmentLength?: number,
  ) => {
    const ur = this.toUR();
    const urEncoder = new UREncoder(
      ur,
      maxFragmentLength,
      firstSeqNum,
      minFragmentLength,
    );
    return urEncoder;
  };
}
