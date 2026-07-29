export class PathComponent {
  public static readonly HARDENED_BIT = 0x80000000;

  private index?: number;
  private wildcard: boolean;
  private hardened: boolean;

  constructor(args: { index?: number; hardened: boolean }) {
    if (typeof args.hardened !== 'boolean') {
      throw new TypeError(
        '#[ur-registry][PathComponent][fn.constructor]: hardened must be a boolean',
      );
    }
    if (
      args.index !== undefined &&
      (!Number.isInteger(args.index) ||
        args.index < 0 ||
        args.index >= PathComponent.HARDENED_BIT)
    ) {
      throw new RangeError(
        `#[ur-registry][PathComponent][fn.constructor]: Invalid index ${args.index}`,
      );
    }
    this.index = args.index;
    this.hardened = args.hardened;

    if (this.index !== undefined) {
      this.wildcard = false;
    } else {
      this.wildcard = true;
    }

  }

  public getIndex = () => this.index;
  public isWildcard = () => this.wildcard;
  public isHardened = () => this.hardened;
}
