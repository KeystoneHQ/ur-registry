export class PathComponent {
  public static readonly HARDENED_BIT = 0x80000000;

  private wildcard: boolean;

  constructor(private index: number, private hardened: boolean) {
    this.index = index;
    this.wildcard = false;
    this.hardened = hardened;

    if ((this.index & PathComponent.HARDENED_BIT) !== 0) {
      throw new Error(
        `#ur-registry_error: Invalid index ${index} - most significant bit cannot be set`,
      );
    }
  }

  public getIndex = () => this.index;
  public isWildcard = () => this.wildcard;
  public isHardened = () => this.hardened;
}
