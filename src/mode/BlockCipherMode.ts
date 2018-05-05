import { BlockCipher } from '../lib/BlockCipher';
import { BlockCipherModeAlgorithm } from './BlockCipherModeAlgorithm';

export abstract class BlockCipherMode {
    public static Encryptor: any = BlockCipherModeAlgorithm;

    public static Decryptor: any = BlockCipherModeAlgorithm;

    /**
     * Creates this mode for encryption.
     *
     * @param cipher A block cipher instance.
     * @param iv The IV words.
     *
     * @example
     *
     *     var mode = CBC.createEncryptor(cipher, iv.words);
     */
    public static createEncryptor(cipher: BlockCipher, iv: Array<number>): BlockCipherModeAlgorithm {
        // workaround for typescript not being able to create a abstract creator function directly
        const encryptorClass: any = this.Encryptor;

        return new encryptorClass(cipher, iv);
    }

    /**
     * Creates this mode for decryption.
     *
     * @param cipher A block cipher instance.
     * @param iv The IV words.
     *
     * @example
     *
     *     var mode = CBC.createDecryptor(cipher, iv.words);
     */
    public static createDecryptor(cipher: BlockCipher, iv: Array<number>): BlockCipherModeAlgorithm {
        // workaround for typescript not being able to create a abstract creator function directly
        const decryptorClass: any = this.Decryptor;

        return new decryptorClass(cipher, iv);
    }
}