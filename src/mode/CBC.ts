import { BlockCipherMode } from './BlockCipherMode';
import { CBCEncryptor } from './CBCEncryptor';
import { CBCDecryptor } from './CBCDecryptor';

/**
 * Cipher Block Chaining mode.
 */
export abstract class CBC extends BlockCipherMode {
    public static Encryptor: any = CBCEncryptor;

    public static Decryptor: any = CBCDecryptor;
}