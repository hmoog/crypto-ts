import { CipherParams } from '../lib/CipherParams';

export interface Formatter {
    stringify: (cipherParams: CipherParams) => string;

    parse: (paramsStr: string) => CipherParams;
}