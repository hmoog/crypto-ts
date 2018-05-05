import { BlockCipherMode } from './BlockCipherMode';
import { ECBEncryptor } from './ECBEncryptor';
import { ECBDecryptor } from './ECBDecryptor';

/**
 * Cipher Block Chaining mode.
 */
export abstract class ECB extends BlockCipherMode {
    public static Encryptor: typeof ECBEncryptor = ECBEncryptor;

    public static Decryptor: typeof ECBDecryptor = ECBDecryptor;
}