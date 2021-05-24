import { DataItem } from './DataItem';
import { PathComponent } from './pathComponent';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

enum Keys {
  components = 1,
  source_fingerprint = 2,
  depth = 3,
}

export class CryptoKeypath extends RegistryItem {
  getRegistryType = () => {
    return RegistryTypes.CRYPTO_KEYPATH;
  };

  constructor(
    private components: PathComponent[],
    private sourceFingerprint: Buffer,
    private depth: number,
  ) {
    super();
  }

  public getComponents = () => this.components;

  public getPath = () => {
    if (this.components.length === 0) {
      return undefined;
    }

    const components = this.components.map((component) => {
      return `${component.isWildcard() ? '*' : component.getIndex()}${
        component.isHardened ? "'" : ''
      }`;
    });
    return components.join('/');
  };

  public getSourceFingerprint = () => this.sourceFingerprint;
  public getDepth = () => this.depth;

  toDataItem = () => {
    const map = new Map();
    const components = [];
    this.components.forEach((component) => {
      if (component.isWildcard()) {
        components.push([]);
      } else {
        components.push(component.getIndex());
      }
      components.push(component.isHardened ? true : false);
    });

    if (components.length > 0) {
      map.set(Keys.components, components);
    }
    if (this.sourceFingerprint) {
      map.set(Keys.source_fingerprint, this.sourceFingerprint.readInt32BE());
    }
    if (this.depth) {
      map.set(Keys.depth, this.depth);
    }
    return new DataItem(map);
  };
}
