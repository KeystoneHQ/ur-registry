import { RegistryTypes } from "../RegistryType";
import { RegistryItem } from "../RegistryItem";
import { DataItem, decodeToDataItem } from '../lib';
import { DataItemMap } from '../types';
import { CryptoKeypath } from "../CryptoKeypath";

enum Keys {
  keyPaths = 1,
  curve,
  algo,
  origin,
}

export enum Curve {
  secp256k1 = "secp256k1",
  ed25519 = "ed25519"
}

export enum DerivationAlgorithm {
  slip10 = "slip10",
  bip32ed25519 = "bip32ed25519"
}

export class KeyDerivation extends RegistryItem {
  getRegistryType = () => RegistryTypes.KEY_DERIVATION_CALL;

  constructor(
    private keypaths: CryptoKeypath[],
    private curve: Curve = Curve.secp256k1,
    private algo: DerivationAlgorithm = DerivationAlgorithm.slip10,
    private origin?: string
  ) {
    super();
  }

  public getKeypaths = (): CryptoKeypath[] => this.keypaths;
  public getCurve = (): Curve => this.curve;
  public getAlgo = (): DerivationAlgorithm => this.algo;
  public getOrigin = (): string | undefined => this.origin;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    map[Keys.keyPaths] = this.keypaths.map(keyPath => {
      const dataItem = keyPath.toDataItem()
      dataItem.setTag(keyPath.getRegistryType().getTag());
      return dataItem;
    });

    map[Keys.curve] = this.curve;
    map[Keys.algo] = this.algo;
    if (this.origin) {
      map[Keys.origin] = this.origin;
    }
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): KeyDerivation => {
    const map = dataItem.getData();
    const keypaths = map[Keys.keyPaths].map(keypath =>
      CryptoKeypath.fromDataItem(keypath)
    )
    const curve = map[Keys.curve];
    const algo = map[Keys.algo];
    const origin = map[Keys.origin];
    return new KeyDerivation(keypaths, curve, algo, origin);
  };

  public static fromCBOR = (_cborPayload: Buffer): KeyDerivation => {
    const dataItem = decodeToDataItem(_cborPayload);
    return KeyDerivation.fromDataItem(dataItem);
  };
}
