import { BlockCipher } from '../lib/BlockCipher';
import { BlockCipherMode } from './BlockCipherMode';

export abstract class BlockCipherModeAlgorithm {
    public _cipher!: BlockCipher;

    public _iv: Array<number> | undefined;

    public __creator: ((cipher: BlockCipher, iv: number[]) => BlockCipherMode) | undefined;

    public constructor(cipher: BlockCipher, iv: Array<number>) {
        this.init(cipher, iv);
    }

    /**
     * Initializes a newly created mode.
     *
     * @param cipher A block cipher instance.
     * @param iv The IV words.
     *
     * @example
     *
     *     var mode = CBC.Encryptor.create(cipher, iv.words);
     */
    public init(cipher: BlockCipher, iv?: Array<number>) {
        this._cipher = cipher;
        this._iv = iv;
    }

    public abstract processBlock(words: Array<number>, offset: number): void;
}