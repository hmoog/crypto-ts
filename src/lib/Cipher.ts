import { BufferedBlockAlgorithm } from './BufferedBlockAlgorithm';
import { WordArray } from './WordArray';
import { SerializableCipher } from './SerializableCipher';
import { PasswordBasedCipher } from './PasswordBasedCipher';
import { BufferedBlockAlgorithmConfig } from './BufferedBlockAlgorithmConfig';
import { CipherParams } from './CipherParams';

export abstract class Cipher extends BufferedBlockAlgorithm {
    /**
     * A constant representing encryption mode.
     */
    public static _ENC_XFORM_MODE = 1;

    /**
     * A constant representing decryption mode.
     */
    public static _DEC_XFORM_MODE = 2;

    /**
     * This cipher's key size. Default: 4 (128 bits / 32 Bits)
     */
    public static keySize = 4;

    /**
     * This cipher's IV size. Default: 4 (128 bits / 32 Bits)
     */
    public static ivSize = 4;

    /**
     * Either the encryption or decryption transformation mode constant.
     */
    public _xformMode: number;

    /**
     * The key.
     */
    public _key: WordArray;

    /**
     * Creates this cipher in encryption mode.
     *
     * @param key The key.
     * @param cfg (Optional) The configuration options to use for this operation.
     *
     * @return A cipher instance.
     *
     * @example
     *
     *     let cipher = AES.createEncryptor(keyWordArray, { iv: ivWordArray });
     */
    public static createEncryptor(key: WordArray, cfg?: BufferedBlockAlgorithmConfig): Cipher {
        // workaround for typescript not being able to create a abstract creator function directly
        const thisClass: any = this;

        return new thisClass(this._ENC_XFORM_MODE, key, cfg);
    }

    /**
     * Creates this cipher in decryption mode.
     *
     * @param key The key.
     * @param cfg (Optional) The configuration options to use for this operation.
     *
     * @return A cipher instance.
     *
     * @example
     *
     *     let cipher = AES.createDecryptor(keyWordArray, { iv: ivWordArray });
     */
    public static createDecryptor(key: WordArray, cfg?: BufferedBlockAlgorithmConfig): Cipher {
        // workaround for typescript not being able to create a abstract creator function directly
        const thisClass: any = this;

        return new thisClass(this._DEC_XFORM_MODE, key, cfg);
    }

    /**
     * Creates shortcut functions to a cipher's object interface.
     *
     * @param cipher The cipher to create a helper for.
     *
     * @return An object with encrypt and decrypt shortcut functions.
     *
     * @example
     *
     *     let AES = Cipher._createHelper(AESAlgorithm);
     */
    public static _createHelper(cipher: typeof Cipher) {
        function encrypt(message: WordArray | string, key: WordArray | string, cfg?: BufferedBlockAlgorithmConfig) {
            if(typeof key === 'string') {
                return PasswordBasedCipher.encrypt(cipher, message, key, cfg);
            } else {
                return SerializableCipher.encrypt(cipher, message, key, cfg);
            }
        }

        function decrypt(ciphertext: CipherParams | string, key: WordArray | string, cfg?: BufferedBlockAlgorithmConfig) {
            if(typeof key === 'string') {
                return PasswordBasedCipher.decrypt(cipher, ciphertext, key, cfg);
            } else {
                return SerializableCipher.decrypt(cipher, ciphertext, key, cfg);
            }
        }

        return {
            encrypt: encrypt,
            decrypt: decrypt
        };
    }

    /**
     * Initializes a newly created cipher.
     *
     * @param xformMode Either the encryption or decryption transormation mode constant.
     * @param key The key.
     * @param cfg (Optional) The configuration options to use for this operation.
     *
     * @example
     *
     *     let cipher = AES.create(AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
     */
    public constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
        // Apply config defaults
        super(Object.assign({
            blockSize: 1
        }, cfg));

        // Store transform mode and key
        this._xformMode = xformMode;
        this._key = key;

        // Set initial values
        this.reset();
    }

    /**
     * Adds data to be encrypted or decrypted.
     *
     * @param dataUpdate The data to encrypt or decrypt.
     *
     * @return The data after processing.
     *
     * @example
     *
     *     let encrypted = cipher.process('data');
     *     let encrypted = cipher.process(wordArray);
     */
    public process(dataUpdate: WordArray | string): WordArray {
        // Append
        this._append(dataUpdate);

        // Process available blocks
        return this._process();
    }

    /**
     * Finalizes the encryption or decryption process.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param dataUpdate The final data to encrypt or decrypt.
     *
     * @return The data after final processing.
     *
     * @example
     *
     *     var encrypted = cipher.finalize();
     *     var encrypted = cipher.finalize('data');
     *     var encrypted = cipher.finalize(wordArray);
     */
    public finalize(dataUpdate?: WordArray | string): WordArray {
        // Final data update
        if(dataUpdate) {
            this._append(dataUpdate);
        }

        // Perform concrete-cipher logic
        const finalProcessedData = this._doFinalize();

        return finalProcessedData;
    }

    /**
     * Cipher specific finalize function explicitly implemented in the derived class.
     */
    public abstract _doFinalize(): WordArray;
}