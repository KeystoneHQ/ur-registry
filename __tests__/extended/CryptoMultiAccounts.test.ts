import {CryptoKeypath, PathComponent, CryptoHDKey} from "../../src";
import { CryptoMultiAccounts } from '../../src';

describe("CryptoMultiAccount", () => {
  it("should generate CryptoMultiAccount", () => {
    const originKeyPath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        "02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b",
        "hex"
      ),
      origin: originKeyPath,
    });

    const multiAccounts = new CryptoMultiAccounts(
      Buffer.from("e9181cf3", "hex"),
      [cryptoHDKey],
      "keystone"
    );
    const hex = multiAccounts.toCBOR().toString("hex");
    expect(hex).toBe(
      "a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f503686b657973746f6e65"
    );
    const ur = multiAccounts.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:crypto-multi-accounts/otadcywlcscewfaolytaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaxisjeihkkjkjyjljtiheokkkgkt"
    );
  });

  it("should decode CryptoMultiAccount", () => {
    const hex =
      "a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f503686b657973746f6e65";
    const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(
      Buffer.from(hex, "hex")
    );
    expect(cryptoMultiAccounts.getDevice()).toBe("keystone");
    expect(cryptoMultiAccounts.getMasterFingerprint().toString("hex")).toBe(
      "e9181cf3"
    );
    expect(cryptoMultiAccounts.getKeys()[0].getKey().toString("hex")).toBe(
      "02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b"
    );
    expect(cryptoMultiAccounts.getKeys()[0].getOrigin().getPath()).toBe(
      "44'/501'/0'/0'"
    );
  });
});
