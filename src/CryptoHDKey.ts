import { CryptoCoinInfo } from './CryptoCoinInfo';
import { CryptoKeypath } from './CryptoKeypath';
import { DataItem } from './DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

enum Keys {
  is_master = 1,
  is_private,
  key_data,
  chain_code,
  use_info,
  origin,
  children,
  parent_fingerprint,
  name,
  note,
}

export class CryptoHDKey extends RegistryItem {
  private master: boolean;
  private privateKey: boolean;
  private key: Buffer;
  private chainCode: Buffer;
  private useInfo: CryptoCoinInfo;
  private origin: CryptoKeypath;
  private children: CryptoKeypath;
  private parentFingerprint: Buffer;
  private name: string;
  private note: string;

  public getRegistryType = () => {
    return RegistryTypes.CRYPTO_HDKEY;
  };

  constructor(args: {
    isMaster?: boolean;
    isPrivateKey?: boolean;
    key?: Buffer;
    chainCode?: Buffer;
    useInfo?: CryptoCoinInfo;
    origin?: CryptoKeypath;
    children?: CryptoKeypath;
    parentFingerprint?: Buffer;
    name?: string;
    note?: string;
  }) {
    super();
    this.master = args.isMaster;
    this.privateKey = args.isPrivateKey;
    this.key = args.key;
    this.chainCode = args.chainCode;
    this.useInfo = args.useInfo;
    this.origin = args.origin;
    this.children = args.children;
    this.parentFingerprint = args.parentFingerprint;
    this.name = args.name;
    this.note = args.note;
  }

  public toDataItem = () => {
    const map = new Map<number, any>();
    if (this.master) {
      map.set(Keys.is_master, true);
      map.set(Keys.key_data, this.key);
      map.set(Keys.chain_code, this.chainCode);
    } else {
      if (this.privateKey) {
        map.set(Keys.is_private, true);
      }
      map.set(Keys.key_data, this.key);
      if (this.chainCode) {
        map.set(Keys.chain_code, this.chainCode);
      }
      if (this.useInfo) {
        const useInfo = this.useInfo.toDataItem();
        useInfo.setTag(this.useInfo.getRegistryType().getTag());
        map.set(Keys.use_info, useInfo);
      }
      if (this.origin) {
        const origin = this.origin.toDataItem();
        origin.setTag(this.origin.getRegistryType().getTag());
        map.set(Keys.origin, origin);
      }
      if (this.children) {
        const children = this.children.toDataItem();
        children.setTag(this.children.getRegistryType().getTag());
        map.set(Keys.children, children);
      }
      if (this.parentFingerprint) {
        map.set(Keys.parent_fingerprint, this.parentFingerprint.readUInt32BE());
      }
      if (this.name) {
        map.set(Keys.name, this.name);
      }
      if (this.note) {
        map.set(Keys.note, this.note);
      }
    }

    return new DataItem(map);
  };
}
