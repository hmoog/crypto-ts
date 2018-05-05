import { BlockCipherModeAlgorithm } from './BlockCipherModeAlgorithm';

export class CBCDecryptor extends BlockCipherModeAlgorithm {
    public _prevBlock: Array<number> | undefined;

    /**
     * Processes the data block at offset.
     *
     * @param words The data words to operate on.
     * @param offset The offset where the block starts.
     *
     * @example
     *
     *     mode.processBlock(data.words, offset);
     */
    public processBlock(words: Array<number>, offset: number) {
        // Check if we have a blockSize
        if(this._cipher.cfg.blockSize === undefined) {
            throw new Error('missing blockSize in cipher config');
        }

        // Remember this block to use with next block
        const thisBlock = words.slice(offset, offset + this._cipher.cfg.blockSize);

        // Decrypt and XOR
        this._cipher.decryptBlock(words, offset);
        this.xorBlock(words, offset, this._cipher.cfg.blockSize);

        // This block becomes the previous block
        this._prevBlock = thisBlock;
    }

    public xorBlock(words: Array<number>, offset: number, blockSize: number) {
        // Choose mixing block
        let block;
        if(this._iv) {
            block = this._iv;

            // Remove IV for subsequent blocks
            this._iv = undefined;
        } else {
            block = this._prevBlock;
        }

        // block should never be undefined but we want to make typescript happy
        if(block !== undefined) {
            // XOR blocks
            for(let i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }
    }
}