import { CryptoECKey } from './CryptoECKey';
import { CryptoHDKey } from './CryptoHDKey';
import { DataItem } from './DataItem';
import { MultiKey } from './MultiKey';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';
import { ScriptExpression, ScriptExpressions } from './ScriptExpression';

export class CryptoOutput extends RegistryItem {
  public getRegistryType = () => {
    return RegistryTypes.CRYPTO_OUTPUT;
  };

  constructor(
    private scriptExpressions: ScriptExpression[],
    private cryptoKey: CryptoHDKey | CryptoECKey | MultiKey,
  ) {
    super();
  }

  public getCryptoKey = () => this.cryptoKey;
  public getHDKey = () => {
    if (this.cryptoKey instanceof CryptoHDKey) {
      return this.cryptoKey as CryptoHDKey;
    } else
      throw new Error(
        `#[ur-registry][CryptoOutput][fn.getHDKey]: cryptoKey is not an instance of [CryptoHDKey]!`,
      );
  };
  public getScriptExpressions = () => this.scriptExpressions;

  toDataItem = () => {
    let dataItem = this.cryptoKey.toDataItem();
    if (
      this.cryptoKey instanceof CryptoECKey ||
      this.cryptoKey instanceof CryptoHDKey
    ) {
      dataItem.setTag(this.cryptoKey.getRegistryType().getTag());
    }

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

  public static fromDataItem = (dataItem: DataItem) => {
    const scriptExpressions: ScriptExpression[] = [];
    let _dataItem = dataItem;
    let _tag = _dataItem.getTag() || undefined;
    do {
      if (_tag !== RegistryTypes.CRYPTO_HDKEY.getTag()) {
        scriptExpressions.push(ScriptExpression.fromTag(_tag));
        _dataItem = _dataItem.getData();
        _tag = _dataItem.getTag();
      } else {
        _tag = undefined;
      }
    } while (_tag !== undefined);

    const isMultiKey =
      scriptExpressions.length > 0 &&
      (scriptExpressions[0].getExpression() ===
        ScriptExpressions.MULTISIG.getExpression() ||
        scriptExpressions[0].getExpression() ===
          ScriptExpressions.SORTED_MULTISIG.getExpression());
    //TODO: judge is multi key by scriptExpressions

    if (isMultiKey) {
      const multiKey = MultiKey.fromDataItem(_dataItem);
      return new CryptoOutput(scriptExpressions, multiKey);
    }

    if (_dataItem.getTag() === RegistryTypes.CRYPTO_HDKEY.getTag()) {
      const cryptoHDKey = CryptoHDKey.fromDataItem(_dataItem);
      return new CryptoOutput(scriptExpressions, cryptoHDKey);
    } else {
      const cryptoECKey = CryptoECKey.fromDataItem(_dataItem);
      return new CryptoOutput(scriptExpressions, cryptoECKey);
    }
  };
}
