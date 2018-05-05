import { WordArray } from '../lib/WordArray';
import { CipherParams } from '../lib/CipherParams';

export interface KDF {
    execute: (password: string, keySize: number, ivSize: number, salt?: WordArray | string) => CipherParams;
}