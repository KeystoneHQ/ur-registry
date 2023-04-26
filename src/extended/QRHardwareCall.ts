import {RegistryTypes} from "../RegistryType";
import {RegistryItem} from "../RegistryItem";
import {decodeToDataItem,DataItem} from '../lib';
import {DataItemMap} from '../types';
import { KeyDerivation } from "./KeyDerivation";

enum Keys {
  name = 1,
  params,
}

export enum QRHardwareCallName {
  KeyDerivation = "key-derivation"
}

type QRHardwareCallParams = KeyDerivation

export class QRHardwareCall extends RegistryItem {
  getRegistryType = () => RegistryTypes.QR_HARDWARE_CALL;

  constructor(
    private name: QRHardwareCallName,
    private params: QRHardwareCallParams,
  ) {
    super();
  }

  public getName = (): string => this.name;
  public getParams = (): QRHardwareCallParams => this.params;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    map[Keys.name] = this.name;

    const param = this.params.toDataItem()
    param.setTag(this.params.getRegistryType().getTag())
    map[Keys.params] = param

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): QRHardwareCall => {
    const map = dataItem.getData();
    const name = map[Keys.name] || QRHardwareCallName.KeyDerivation;
    let params;

    switch (name) {
      case QRHardwareCallName.KeyDerivation:
        params = KeyDerivation.fromDataItem(map[Keys.params])
    }
    return new QRHardwareCall(name, params);
  };

  public static fromCBOR = (_cborPayload: Buffer): QRHardwareCall => {
    const dataItem = decodeToDataItem(_cborPayload);
    return QRHardwareCall.fromDataItem(dataItem);
  };
}
