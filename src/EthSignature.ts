import { decodeToDataItem } from './lib/cbor-sync';
import { DataItem } from './lib/DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';

enum Keys {
    requestId = 1,
    signature,
}

export class ETHSignature extends RegistryItem {
    private requestId: Buffer;
    private signature: Buffer;

    getRegistryType = () => RegistryTypes.ETH_SIGNATAURE;

    constructor(signature: Buffer, requestId?: Buffer) {
        super();
        this.signature = signature
        this.requestId = requestId
    }

    public getRequestId = () => this.requestId;
    public getSignature = () => this.signature;

    public toDataItem = () => {
        const map = {};
        if (this.requestId) {
            map[Keys.requestId] = new DataItem(this.requestId, RegistryTypes.UUID.getTag())
        }
        map[Keys.signature] = this.signature;
        return new DataItem(map);
    };

    public static fromDataItem = (dataItem: DataItem) => {
        const map = dataItem.getData();
        const signature = map[Keys.signature];
        const requestId = map[Keys.requestId] ? map[Keys.requestId].getData() : undefined;

        return new ETHSignature(
            signature, requestId
        )
    };

    public static fromCBOR = (_cborPayload: Buffer) => {
        const dataItem = decodeToDataItem(_cborPayload);
        return ETHSignature.fromDataItem(dataItem);
    };
}
