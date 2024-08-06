import { RegistryTypes } from '../RegistryType';
import { RegistryItem } from '../RegistryItem';
import { DataItem, decodeToDataItem } from '../lib';
import { DataItemMap } from '../types';
import { CryptoKeypath } from '../CryptoKeypath';

enum Keys {
  keyPath = 1,
  curve,
  algo,
  chainType,
}

export enum Curve {
  secp256k1,
  ed25519,
}

export enum DerivationAlgorithm {
  slip10,
  bip32ed25519,
}

export enum ChainType {
  BTC,
  ETH,
  SOL,
  XRP,
  ADA,
  TRX,
  LTC,
  BCH,
  APT,
  SUI,
  DASH,
  AR,
  XLM,
  TIA,
  ATOM,
  DYM,
  OSMO,
  INJ,
  CRO,
  KAVA,
  LUNC,
  AXL,
  LUNA,
  AKT,
  STRD,
  SCRT,
  BLD,
  CTK,
  EVMOS,
  STARS,
  XPRT,
  SOMM,
  JUNO,
  IRIS,
  DVPN,
  ROWAN,
  REGEN,
  BOOT,
  GRAV,
  IXO,
  NGM,
  IOV,
  UMEE,
  QCK,
  TGD,
}

export const chainTypeToString = (chainType: ChainType): string => {
  switch (chainType) {
    case ChainType.BTC:
      return 'BTC';
    case ChainType.ETH:
      return 'ETH';
    case ChainType.SOL:
      return 'SOL';
    case ChainType.XRP:
      return 'XRP';
    case ChainType.ADA:
      return 'ADA';
    case ChainType.TRX:
      return 'TRX';
    case ChainType.LTC:
      return 'LTC';
    case ChainType.BCH:
      return 'BCH';
    case ChainType.APT:
      return 'APT';
    case ChainType.SUI:
      return 'SUI';
    case ChainType.DASH:
      return 'DASH';
    case ChainType.AR:
      return 'AR';
    case ChainType.XLM:
      return 'XLM';
    case ChainType.TIA:
      return 'TIA';
    case ChainType.ATOM:
      return 'ATOM';
    case ChainType.DYM:
      return 'DYM';
    case ChainType.OSMO:
      return 'OSMO';
    case ChainType.INJ:
      return 'INJ';
    case ChainType.CRO:
      return 'CRO';
    case ChainType.KAVA:
      return 'KAVA';
    case ChainType.LUNC:
      return 'LUNC';
    case ChainType.AXL:
      return 'AXL';
    case ChainType.LUNA:
      return 'LUNA';
    case ChainType.AKT:
      return 'AKT';
    case ChainType.STRD:
      return 'STRD';
    case ChainType.SCRT:
      return 'SCRT';
    case ChainType.BLD:
      return 'BLD';
    case ChainType.CTK:
      return 'CTK';
    case ChainType.EVMOS:
      return 'EVMOS';
    case ChainType.STARS:
      return 'STARS';
    case ChainType.XPRT:
      return 'XPRT';
    case ChainType.SOMM:
      return 'SOMM';
    case ChainType.JUNO:
      return 'JUNO';
    case ChainType.IRIS:
      return 'IRIS';
    case ChainType.DVPN:
      return 'DVPN';
    case ChainType.ROWAN:
      return 'ROWAN';
    case ChainType.REGEN:
      return 'REGEN';
    case ChainType.BOOT:
      return 'BOOT';
    case ChainType.GRAV:
      return 'GRAV';
    case ChainType.IXO:
      return 'IXO';
    case ChainType.NGM:
      return 'NGM';
    case ChainType.IOV:
      return 'IOV';
    case ChainType.UMEE:
      return 'UMEE';
    case ChainType.QCK:
      return 'QCK';
    case ChainType.TGD:
      return 'TGD';
    default:
      throw new Error(`Unknown ChainType: ${chainType}`);
  }
};

export class KeyDerivationSchema extends RegistryItem {
  getRegistryType = () => RegistryTypes.KEY_DERIVATION_SCHEMA;

  constructor(
    private keypath: CryptoKeypath,
    private curve: Curve = Curve.secp256k1,
    private algo: DerivationAlgorithm = DerivationAlgorithm.slip10,
    private chainType?: ChainType,
  ) {
    super();
  }

  public getKeypath = (): CryptoKeypath => this.keypath;
  public getCurve = (): Curve => this.curve;
  public getAlgo = (): DerivationAlgorithm => this.algo;
  public getChainType = (): ChainType => this.chainType;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    const dataItem = this.getKeypath().toDataItem();
    dataItem.setTag(this.getKeypath().getRegistryType().getTag());
    map[Keys.keyPath] = dataItem;
    map[Keys.curve] = this.curve;
    map[Keys.algo] = this.algo;
    if (this.chainType) {
      map[Keys.chainType] = chainTypeToString(this.chainType);
    }
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): KeyDerivationSchema => {
    const map = dataItem.getData();
    const keypaths = CryptoKeypath.fromDataItem(map[Keys.keyPath]);
    const curve = map[Keys.curve];
    const algo = map[Keys.algo];
    const chainType = map[Keys.chainType];
    return new KeyDerivationSchema(keypaths, curve, algo, chainType);
  };

  public static fromCBOR = (_cborPayload: Buffer): KeyDerivationSchema => {
    const dataItem = decodeToDataItem(_cborPayload);
    return KeyDerivationSchema.fromDataItem(dataItem);
  };
}
