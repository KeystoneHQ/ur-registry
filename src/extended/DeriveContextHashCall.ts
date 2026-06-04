import { RegistryTypes } from '../RegistryType';
import { RegistryItem } from '../RegistryItem';
import { DataItem, decodeToDataItem } from '../lib';
import { DataItemMap } from '../types';
import { CryptoKeypath } from '../CryptoKeypath';

enum Keys {
  appName = 1,
  network,
  keyPath,
  context,
}

/**
 * Parameters for a `derive-context-hash` qr-hardware-call.
 *
 * - `appName`: lowercase `[a-z0-9-]`, 1-64 bytes; the wallet may enforce an allow-list.
 * - `network`: one of `bitcoin-mainnet` | `bitcoin-testnet` | `bitcoin-signet` | `bitcoin-regtest`.
 * - `keypath`: derivation path of the connected key (the wallet derives the pubkey + address).
 * - `context`: lowercase hex (even length, no `0x`), 1-1024 bytes once decoded.
 */
export class DeriveContextHashCall extends RegistryItem {
  getRegistryType = () => RegistryTypes.DERIVE_CONTEXT_HASH_CALL;

  constructor(
    private appName: string,
    private network: string,
    private keypath: CryptoKeypath,
    private context: string,
  ) {
    super();
  }

  public getAppName = (): string => this.appName;
  public getNetwork = (): string => this.network;
  public getKeypath = (): CryptoKeypath => this.keypath;
  public getContext = (): string => this.context;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    map[Keys.appName] = this.appName;
    map[Keys.network] = this.network;

    const keypath = this.getKeypath().toDataItem();
    keypath.setTag(this.getKeypath().getRegistryType().getTag());
    map[Keys.keyPath] = keypath;

    map[Keys.context] = this.context;
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): DeriveContextHashCall => {
    const map = dataItem.getData();
    const appName = map[Keys.appName];
    const network = map[Keys.network];
    const keypath = CryptoKeypath.fromDataItem(map[Keys.keyPath]);
    const context = map[Keys.context];
    return new DeriveContextHashCall(appName, network, keypath, context);
  };

  public static fromCBOR = (_cborPayload: Buffer): DeriveContextHashCall => {
    const dataItem = decodeToDataItem(_cborPayload);
    return DeriveContextHashCall.fromDataItem(dataItem);
  };
}
