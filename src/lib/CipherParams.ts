import { Base } from '../lib/Base';
import { CipherParamsInterface } from './CipherParamsInterface';
import { WordArray } from '../lib/WordArray';
import { Cipher } from '../lib/Cipher';
import { BlockCipherMode } from '../mode/BlockCipherMode';
import { Padding } from '../pad/Padding';
import { Formatter } from '../format/Formatter';

export class CipherParams extends Base implements CipherParamsInterface {
    ciphertext?: WordArray;

    key?: WordArray | string;

    iv?: WordArray;

    salt?: WordArray | string;

    algorithm?: typeof Cipher;

    mode?: typeof BlockCipherMode;

    padding?: Padding;

    blockSize?: number;

    formatter?: Formatter;

    /**
     * Initializes a newly created cipher params object.
     *
     * @param cipherParams An object with any of the possible cipher parameters.
     *
     * @example
     *
     *     let cipherParams = CipherParams.create({
     *         ciphertext: ciphertextWordArray,
     *         key: keyWordArray,
     *         iv: ivWordArray,
     *         salt: saltWordArray,
     *         algorithm: AESAlgorithm,
     *         mode: CBC,
     *         padding: PKCS7,
     *         blockSize: 4,
     *         formatter: OpenSSLFormatter
     *     });
     */
    public constructor(cipherParams: CipherParamsInterface) {
        super();

        this.ciphertext = cipherParams.ciphertext;
        this.key = cipherParams.key;
        this.iv = cipherParams.iv;
        this.salt = cipherParams.salt;
        this.algorithm = cipherParams.algorithm;
        this.mode = cipherParams.mode;
        this.padding = cipherParams.padding;
        this.blockSize = cipherParams.blockSize;
        this.formatter = cipherParams.formatter;
    }

    public extend(additionalParams: CipherParams): CipherParams {
        if(additionalParams.ciphertext !== undefined) {
            this.ciphertext = additionalParams.ciphertext;
        }

        if(additionalParams.key !== undefined) {
            this.key = additionalParams.key;
        }

        if(additionalParams.iv !== undefined) {
            this.iv = additionalParams.iv;
        }

        if(additionalParams.salt !== undefined) {
            this.salt = additionalParams.salt;
        }

        if(additionalParams.algorithm !== undefined) {
            this.algorithm = additionalParams.algorithm;
        }

        if(additionalParams.mode !== undefined) {
            this.mode = additionalParams.mode;
        }

        if(additionalParams.padding !== undefined) {
            this.padding = additionalParams.padding;
        }

        if(additionalParams.blockSize !== undefined) {
            this.blockSize = additionalParams.blockSize;
        }

        if(additionalParams.formatter !== undefined) {
            this.formatter = additionalParams.formatter;
        }


        return this;
    }

    /**
     * Converts this cipher params object to a string.
     *
     * @param formatter (Optional) The formatting strategy to use.
     *
     * @return The stringified cipher params.
     *
     * @throws Error If neither the formatter nor the default formatter is set.
     *
     * @example
     *
     *     let string = cipherParams + '';
     *     let string = cipherParams.toString();
     *     let string = cipherParams.toString(CryptoJS.format.OpenSSL);
     */
    public toString(formatter?: Formatter): string {
        if(formatter) {
            return formatter.stringify(this);
        } else if(this.formatter) {
            return this.formatter.stringify(this);
        } else {
            throw new Error('cipher needs a formatter to be able to convert the result into a string');
        }
    }
}