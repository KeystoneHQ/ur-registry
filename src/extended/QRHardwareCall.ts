import { RegistryTypes } from '../RegistryType';
import { RegistryItem } from '../RegistryItem';
import { decodeToDataItem, DataItem } from '../lib';
import { DataItemMap } from '../types';
import { KeyDerivation } from './KeyDerivation';

enum Keys {
  type = 1,
  params,
  origin,
  version,
}

export enum QRHardwareCallType {
  KeyDerivation,
}

export enum QRHardwareCallVersion {
  V0 = 0,
  V1,
}

type QRHardwareCallParams = KeyDerivation;

export class QRHardwareCall extends RegistryItem {
  getRegistryType = () => RegistryTypes.QR_HARDWARE_CALL;

  constructor(
    private type: QRHardwareCallType,
    private params: QRHardwareCallParams,
    private origin?: string,
    private version?: QRHardwareCallVersion,
  ) {
    super();
  }

  public getType = (): number => this.type;
  public getParams = (): QRHardwareCallParams => this.params;
  public getOrigin = (): string | undefined => this.origin;
  public getVersion = (): QRHardwareCallVersion | undefined => this.version;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    map[Keys.type] = this.type;

    const param = this.params.toDataItem();
    param.setTag(this.params.getRegistryType().getTag());
    map[Keys.params] = param;

    if (this.origin) {
      map[Keys.origin] = this.origin;
    }

    if (this.version) {
      map[Keys.version] = this.version;
    }
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): QRHardwareCall => {
    const map = dataItem.getData();
    const type = map[Keys.type] || QRHardwareCallType.KeyDerivation;
    let params;

    switch (type) {
      case QRHardwareCallType.KeyDerivation:
        params = KeyDerivation.fromDataItem(map[Keys.params]);
    }
    const origin = map[Keys.origin];
    const version = map[Keys.version];
    return new QRHardwareCall(type, params, origin, version);
  };

  public static fromCBOR = (_cborPayload: Buffer): QRHardwareCall => {
    const dataItem = decodeToDataItem(_cborPayload);
    return QRHardwareCall.fromDataItem(dataItem);
  };
}
