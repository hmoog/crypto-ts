import { WordArray } from '../lib/WordArray';
import { Cipher } from '../lib/Cipher';
import { BlockCipherMode } from '../mode/BlockCipherMode';
import { Padding } from '../pad/Padding';
import { Formatter } from '../format/Formatter';

export interface CipherParamsInterface {
    ciphertext?: WordArray;

    key?: WordArray | string;

    iv?: WordArray;

    salt?: WordArray | string;

    algorithm?: typeof Cipher;

    mode?: typeof BlockCipherMode;

    padding?: Padding;

    blockSize?: number;

    formatter?: Formatter;
}