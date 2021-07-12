import { EthSignRequest, DataType } from '../src/EthSignRequest';
import { CryptoKeypath, PathComponent } from '../src'

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

        const ethSignRequest = new EthSignRequest({
            signData: rlpData,
            dataType: DataType.transaction,
            chainId: 1,
            derivationPath: signKeyPath,
        })

        const cborHex = ethSignRequest.toCBOR().toString('hex');
        const ur = ethSignRequest.toUREncoder(1000).nextPart();
        expect(ur).toBe('ur:eth-sign-request/oxaohdgryagalalnascsgljpnbaelfdibemwaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaelaoxlbjyihjkjyeyaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaehnaehglalalaaxadaaadahtaaddyoyadlecsdwykadykadykaewkadwkfspakoia');
        const ethSignRequstDecoded = EthSignRequest.fromCBOR(Buffer.from(cborHex, 'hex'));
        expect(ethSignRequstDecoded.getChainId()).toBe(1);
        expect(ethSignRequstDecoded.getDataType()).toBe(1);
        expect(ethSignRequstDecoded.getSignData().toString("hex")).toEqual("f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080");    
    })
})