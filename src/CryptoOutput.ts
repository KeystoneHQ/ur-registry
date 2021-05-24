import { CryptoHDKey } from './CryptoHDKey';
import { DataItem } from './DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';
import { ScriptExpression } from './ScriptExpression';

export class CryptoOutput extends RegistryItem {
  public getRegistryType = () => {
    return RegistryTypes.CRYPTO_OUTPUT;
  };

  constructor(
    private scriptExpressions: ScriptExpression[],
    private cryptoKey: CryptoHDKey,
  ) {
    super();
  }

  public getCryptoKey = () => this.cryptoKey;

  toDataItem = () => {
    let dataItem = this.cryptoKey.toDataItem();
    dataItem.setTag(this.cryptoKey.getRegistryType().getTag() || undefined);

    this.scriptExpressions.reverse().forEach((se) => {
      const tagValue = se.getTag();
      if (dataItem.getTag() === undefined) {
        dataItem.setTag(tagValue);
      } else {
        dataItem = new DataItem(dataItem, tagValue);
      }
    });
    return dataItem;
  };
}
