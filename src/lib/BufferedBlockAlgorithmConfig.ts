import { Formatter } from '../format/Formatter';
import { WordArray } from '../lib/WordArray';
import { KDF } from '../kdf/KDF';
import { BlockCipherMode } from '../mode/BlockCipherMode';
import { Padding } from '../pad/Padding';

export interface BufferedBlockAlgorithmConfig {
    // requires at least a blockSize
    blockSize?: number;

    iv?: WordArray;

    format?: Formatter;

    kdf?: KDF;

    mode?: typeof BlockCipherMode;

    padding?: Padding;
}