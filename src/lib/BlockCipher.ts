import { Cipher } from './Cipher';
import { WordArray } from './WordArray';
import { BufferedBlockAlgorithmConfig } from './BufferedBlockAlgorithmConfig';
import { BlockCipherModeAlgorithm } from '../mode/BlockCipherModeAlgorithm';
import { CBC } from '../mode/CBC';
import { PKCS7 } from '../pad/PKCS7';

export abstract class BlockCipher extends Cipher {
    public _mode!: BlockCipherModeAlgorithm;

    constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
        super(xformMode, key, Object.assign({
            // default: 128 / 32
            blockSize: 4,
            mode: CBC,
            padding: PKCS7
        }, cfg));
    }

    public reset() {
        // Reset cipher
        super.reset();

        // Check if we have a blockSize
        if(this.cfg.mode === undefined) {
            throw new Error('missing mode in config');
        }

        // Reset block mode
        let modeCreator;
        if (this._xformMode === (<typeof BlockCipher> this.constructor)._ENC_XFORM_MODE) {
            modeCreator = this.cfg.mode.createEncryptor;
        } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            modeCreator = this.cfg.mode.createDecryptor;
            // Keep at least one block in the buffer for unpadding
            this._minBufferSize = 1;
        }

        if (this._mode && this._mode.__creator === modeCreator) {
            this._mode.init(this, this.cfg.iv && this.cfg.iv.words);
        } else {
            this._mode = modeCreator.call(this.cfg.mode, this, this.cfg.iv && this.cfg.iv.words);
            this._mode.__creator = modeCreator;
        }
    }

    _doProcessBlock(words: Array<number>, offset: number) {
        this._mode.processBlock(words, offset);
    }

    _doFinalize() {
        // Check if we have a padding strategy
        if(this.cfg.padding === undefined) {
            throw new Error('missing padding in config');
        }

        // Finalize
        let finalProcessedBlocks;
        if(this._xformMode === (<typeof BlockCipher> this.constructor)._ENC_XFORM_MODE) {
            // Check if we have a blockSize
            if(this.cfg.blockSize === undefined) {
                throw new Error('missing blockSize in config');
            }

            // Pad data
            this.cfg.padding.pad(this._data, this.cfg.blockSize);

            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');
        } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');

            // Unpad data
            this.cfg.padding.unpad(finalProcessedBlocks);
        }

        return finalProcessedBlocks;
    }

    public abstract encryptBlock(M: Array<number>, offset: number): void;

    public abstract decryptBlock(M: Array<number>, offset: number): void;
}