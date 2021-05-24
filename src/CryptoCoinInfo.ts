import { DataItem } from './DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

enum Keys {
  type = 1,
  network,
}

export enum Type {
  bitcoin = 0,
}

export enum Network {
  mainnet,
  testnet,
}

export class CryptoCoinInfo extends RegistryItem {
  getRegistryType = () => {
    return RegistryTypes.CRYPTO_COIN_INFO;
  };

  constructor(private type?: Type, private network?: Network) {
    super();
  }

  public getType = () => {
    return this.type || Type.bitcoin;
  };

  public getNetwork = () => {
    return this.network || Network.mainnet;
  };

  public toDataItem = () => {
    const map = new Map();
    if (this.type) {
      map.set(Keys.type, this.type);
    }
    if (this.network) {
      map.set(Keys.network, this.network);
    }
    return new DataItem(map);
  };
}
