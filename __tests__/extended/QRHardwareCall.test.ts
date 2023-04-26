import {CryptoKeypath, PathComponent} from "../../src";
import { QRHardwareCall, QRHardwareCallName } from "../../src/extended/QRHardwareCall";
import { KeyDerivation } from "../../src/extended/KeyDerivation";

describe("QRHardwareCall", () => {
  it("should generate QRHardwareCall", () => {
    const keyPath1 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);
    const keyPath2 = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
    ]);

    const keyDerivation = new KeyDerivation([keyPath1, keyPath2]);
    const qrHardwareCall = new QRHardwareCall(QRHardwareCallName.KeyDerivation, keyDerivation)

    const hex = qrHardwareCall.toCBOR().toString("hex");
    expect(hex).toBe(
      "a2016e6b65792d64657269766174696f6e02d90515a30182d90130a10186182cf500f500f5d90130a1018a182cf51901f5f500f500f500f40269736563703235366b310366736c69703130"
    );

    const ur = qrHardwareCall.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:qr-hardware-call/oeadjtjeihkkdpieihjpinkohsjyinjljtaotaahbzotadlftaaddyoyadlncsdwykaeykaeyktaaddyoyadlecsdwykcfadykykaeykaeykaewkaoinjkihiajoeyecenjeehaxiyjkjzinjoehdyfxvainnd"
    );
  });

  it("should decode QRHardwareCall", () => {
    const hex =
      "a2016e6b65792d64657269766174696f6e02d90515a30182d90130a10186182cf500f500f5d90130a1018a182cf51901f5f500f500f500f40269736563703235366b310366736c69703130";
    const qrHardwareCall = QRHardwareCall.fromCBOR(
      Buffer.from(hex, "hex")
    );
    expect(qrHardwareCall.getName()).toBe("key-derivation");

    const keyDerivation = qrHardwareCall.getParams() as KeyDerivation;
    expect(keyDerivation.getCurve()).toBe("secp256k1");
    expect(keyDerivation.getAlgo()).toBe("slip10");
    expect(keyDerivation.getKeypaths()[0].getPath()).toBe(
      "44'/0'/0'"
    );
    expect(keyDerivation.getKeypaths()[1].getPath()).toBe(
      "44'/501'/0'/0'/0"
    );
  });
});
