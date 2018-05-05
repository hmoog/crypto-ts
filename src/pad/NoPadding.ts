import { WordArray } from '../lib/WordArray';
import { Padding } from '../pad/Padding';

export class NoPadding {
    /**
     * Doesn't pad the data provided.
     *
     * @param data The data to pad.
     * @param blockSize The multiple that the data should be padded to.
     *
     * @example
     *
     *     NoPadding.pad(wordArray, 4);
     */
    public static pad(data: WordArray, blockSize: number): void {
    }

    /**
     * Doesn't unpad the data provided.
     *
     * @param data The data to unpad.
     *
     * @example
     *
     *     NoPadding.unpad(wordArray);
     */
    public static unpad(data: WordArray): void {
    }
}

// type guard for the padding (to ensure it has the required static methods)
const _: Padding = NoPadding;