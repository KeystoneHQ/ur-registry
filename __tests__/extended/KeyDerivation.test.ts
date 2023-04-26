import {CryptoKeypath, PathComponent} from "../../src";
import { KeyDerivation } from "../../src/extended/KeyDerivation";

describe("KeyDerivation", () => {
  it("should generate KeyDerivation", () => {
    const keyPath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    const keyDerivation = new KeyDerivation([keyPath]);
    const hex = keyDerivation.toCBOR().toString("hex");
    expect(hex).toBe(
      "a30181d90130a10186182cf500f500f50269736563703235366b310366736c69703130"
    );

    const ur = keyDerivation.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:key-derivation-call/otadlytaaddyoyadlncsdwykaeykaeykaoinjkihiajoeyecenjeehaxiyjkjzinjoehdyeospdlmn"
    );
  });

  it("should decode KeyDerivation", () => {
    const hex =
      "a30181d90130a10186182cf500f500f50269736563703235366b310366736c69703130";
    const keyDerivation = KeyDerivation.fromCBOR(
      Buffer.from(hex, "hex")
    );
    expect(keyDerivation.getCurve()).toBe("secp256k1");
    expect(keyDerivation.getAlgo()).toBe("slip10");
    expect(keyDerivation.getKeypaths()[0].getPath()).toBe(
      "44'/0'/0'"
    );
  });
});
