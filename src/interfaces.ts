export interface ICryptoKey {
  isECKey: () => boolean;
  getOutputDescriptorContent: () => string;
}
