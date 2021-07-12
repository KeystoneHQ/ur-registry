import { EthSignRequest, DataType } from '../src/selfDefined';
import { CryptoKeypath, PathComponent } from '../src'
import * as uuid from 'uuid'

describe('eth-sign-request', () => {
    it('test should genereate eth-sign-reqeust', () => {
        const rlpData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex')

        const signKeyPath = new CryptoKeypath([
            new PathComponent({ index: 44, hardened: true }),
            new PathComponent({ index: 1, hardened: true }),
            new PathComponent({ index: 1, hardened: true }),
            new PathComponent({ index: 0, hardened: false }),
            new PathComponent({ index: 1, hardened: false }),
          ]);

        // const ethRequestId = uuid.v4(); 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d as example
        const ethRequestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
        const idBuffer = uuid.parse(ethRequestId) as Uint8Array

        const ethSignRequest = new EthSignRequest({
            signData: rlpData,
            dataType: DataType.transaction,
            chainId: 1,
            derivationPath: signKeyPath,
            requestId: Buffer.from(idBuffer)
        })

        const cborHex = ethSignRequest.toCBOR().toString('hex');
        const ur = ethSignRequest.toUREncoder(1000).nextPart();
        expect(ur).toBe('ur:eth-sign-request/onadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdgryagalalnascsgljpnbaelfdibemwaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaelaoxlbjyihjkjyeyaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaehnaehglalalaaxadaaadahtaaddyoyadlecsdwykadykadykaewkadwkknztwfje')
        const ethSignRequstDecoded = EthSignRequest.fromCBOR(Buffer.from(cborHex, 'hex'));
        expect(uuid.stringify(ethSignRequest.getRequestId())).toBe(ethRequestId);
        expect(ethSignRequstDecoded.getChainId()).toBe(1);
        expect(ethSignRequstDecoded.getDataType()).toBe(1);
        expect(ethSignRequstDecoded.getSignData().toString("hex")).toEqual("f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080");    
    })
})