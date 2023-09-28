import {RegistryTypes} from "../RegistryType";
import {CryptoHDKey} from "../CryptoHDKey";
import {RegistryItem} from "../RegistryItem";
import {decodeToDataItem,DataItem} from '../lib';
import {DataItemMap} from '../types';
enum Keys {
  masterFingerprint = 1,
  keys,
  device,
  deviceId,
  version,
}

export class CryptoMultiAccounts extends RegistryItem {
  getRegistryType = () => RegistryTypes.CRYPTO_MULTI_ACCOUNTS;

  constructor(
    private masterFingerprint: Buffer,
    private keys: CryptoHDKey[],
    private device?: string,
    private deviceId?: string,
    private version?: string
  ) {
    super();
  }

  public getMasterFingerprint = () => this.masterFingerprint;
  public getKeys = () => this.keys;
  public getDevice = () => this.device;
  public getDeviceId = () => this.deviceId;
  public getVersion = () => this.version;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    if (this.masterFingerprint) {
      map[Keys.masterFingerprint] = this.masterFingerprint.readUInt32BE(0);
    }
    if (this.keys) {
      map[Keys.keys] = this.keys.map((item) => {
        const dataItem = item.toDataItem();
        dataItem.setTag(item.getRegistryType().getTag());
        return dataItem;
      });
    }
    if (this.device) {
      map[Keys.device] = this.device;
    }
    if (this.deviceId) {
      map[Keys.deviceId] = this.deviceId;
    }
    if (this.version) {
      map[Keys.version] = this.version;
    }
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const masterFingerprint = Buffer.alloc(4);
    const _masterFingerprint = map[Keys.masterFingerprint];
    if (_masterFingerprint) {
      masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
    }
    const keys = map[Keys.keys] as DataItem[];
    const cryptoHDKeys = keys.map((item) => CryptoHDKey.fromDataItem(item));
    const device = map[Keys.device];
    const deviceId = map[Keys.deviceId];
    const version = map[Keys.version];
    return new CryptoMultiAccounts(masterFingerprint, cryptoHDKeys, device, deviceId, version);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoMultiAccounts.fromDataItem(dataItem);
  };
}
