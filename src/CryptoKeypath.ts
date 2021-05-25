import { DataItem } from './DataItem';
import { PathComponent } from './PathComponent';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

enum Keys {
  components = 1,
  source_fingerprint,
  depth,
}

export class CryptoKeypath extends RegistryItem {
  getRegistryType = () => {
    return RegistryTypes.CRYPTO_KEYPATH;
  };

  constructor(
    private components: PathComponent[],
    private sourceFingerprint: Buffer,
    private depth: number = 0,
  ) {
    super();
  }

  public getPath = () => {
    if (this.components.length === 0) {
      return undefined;
    }

    const components = this.components.map((component) => {
      return `${component.isWildcard() ? '*' : component.getIndex()}${
        component.isHardened() ? "'" : ''
      }`;
    });
    return components.join('/');
  };

  public getComponents = () => this.components;
  public getSourceFingerprint = () => this.sourceFingerprint;
  public getDepth = () => this.depth;

  toDataItem = () => {
    const map: Record<string, any> = {};
    const components = [];
    this.components.forEach((component) => {
      if (component.isWildcard()) {
        components.push([]);
      } else {
        components.push(component.getIndex());
      }
      components.push(component.isHardened() ? true : false);
    });

    if (components.length > 0) {
      map[Keys.components] = components;
    }
    if (this.sourceFingerprint) {
      map[Keys.source_fingerprint] = this.sourceFingerprint.readUInt32BE();
    }
    if (this.depth) {
      map[Keys.depth] = this.depth;
    }
    return new DataItem(map);
  };

  static fromDataItem = (dataItem: DataItem) => {
    const map: Record<string, any> = dataItem.getData();
    const pathComponents: PathComponent[] = [];
    const components = map[Keys.components] as any[];
    if (components) {
      for (let i = 0; i < components.length; i += 2) {
        const isHardened = components[i + 1];
        const path = components[i];
        if (typeof path === 'number') {
          pathComponents.push(
            new PathComponent({ index: path, hardened: isHardened }),
          );
        } else {
          pathComponents.push(new PathComponent({ hardened: isHardened }));
        }
      }
    }
    const _sourceFingerprint = map[Keys.source_fingerprint];
    let sourceFingerprint: Buffer;
    if (_sourceFingerprint) {
      sourceFingerprint = Buffer.alloc(4);
      sourceFingerprint.writeUInt32BE(_sourceFingerprint);
    }
    const depth = map[Keys.depth];
    return new CryptoKeypath(pathComponents, sourceFingerprint, depth);
  };
}
