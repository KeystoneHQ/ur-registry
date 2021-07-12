import {ETHSignature} from '../src/selfDefined';
import * as uuid from 'uuid'

describe('eth-sign-request', () => {
    it('test should genereate eth-signature', () => {
        const rlpSignatureData = Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713', 'hex')
        // r,v,s
        // const ethRequestId = uuid.v4(); 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d as example
        const ethRequestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
        const idBuffer = uuid.parse(ethRequestId) as Uint8Array

        const ethSignature = new ETHSignature(
            rlpSignatureData,
            Buffer.from(idBuffer)
        )

        const cborHex = ethSignature.toCBOR().toString('hex');
        const ur = ethSignature.toUREncoder(1000).nextPart();
        expect(ur).toBe('ur:eth-signature/oeadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfptywtosrftahprdctrkbegylogdghjkbafhflamfwlohghtpsseaozorsimnybbtnnbiynlckenbtfmeeamsabnaeoxasjkwswfkekiieckhpecckssptndzelnwfecylbwdlsgvazt')
        const ethSignatureDecoded = ETHSignature.fromCBOR(Buffer.from(cborHex, 'hex'));
        expect(uuid.stringify(ethSignatureDecoded.getRequestId())).toBe(ethRequestId);
        expect(ethSignatureDecoded.getSignature().toString("hex")).toEqual("d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713");    
    })
})