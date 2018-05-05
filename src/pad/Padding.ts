import { WordArray } from '../lib/WordArray';

export interface Padding {
    pad: (data: WordArray, blockSize: number) => void;

    unpad: (data: WordArray) => void;
}