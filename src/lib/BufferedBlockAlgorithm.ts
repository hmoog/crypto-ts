import { WordArray } from '../lib/WordArray';
import { Utf8 } from '../enc/Utf8';
import { BufferedBlockAlgorithmConfig } from './BufferedBlockAlgorithmConfig';

export abstract class BufferedBlockAlgorithm {
    public _minBufferSize = 0;

    public _data: WordArray;

    public _nDataBytes: number;

    public cfg: BufferedBlockAlgorithmConfig;

    abstract _doProcessBlock(wordArray: Array<number>, offset: number): void;

    constructor(cfg?: BufferedBlockAlgorithmConfig) {
        this.cfg = Object.assign({
            blockSize: 1
        }, cfg);

        // Initial values
        this._data = new WordArray();
        this._nDataBytes = 0;
    }

    /**
     * Resets this block algorithm's data buffer to its initial state.
     *
     * @example
     *
     *     bufferedBlockAlgorithm.reset();
     */
    reset() {
        // Initial values
        this._data = new WordArray();
        this._nDataBytes = 0;
    }

    /**
     * Adds new data to this block algorithm's buffer.
     *
     * @param data The data to append. Strings are converted to a WordArray using UTF-8.
     *
     * @example
     *
     *     bufferedBlockAlgorithm._append('data');
     *     bufferedBlockAlgorithm._append(wordArray);
     */
    _append(data: string | WordArray) {
        // Convert string to WordArray, else assume WordArray already
        if(typeof data === 'string') {
            data = Utf8.parse(data);
        }

        // Append
        this._data.concat(data);
        this._nDataBytes += data.sigBytes;
    }

    /**
     * Processes available data blocks.
     *
     * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
     *
     * @param doFlush Whether all blocks and partial blocks should be processed.
     *
     * @return The processed data.
     *
     * @example
     *
     *     let processedData = bufferedBlockAlgorithm._process();
     *     let processedData = bufferedBlockAlgorithm._process(!!'flush');
     */
    _process(doFlush?: boolean): WordArray {
        if(!this.cfg.blockSize) {
            throw new Error('missing blockSize in config');
        }

        // Shortcuts
        const blockSizeBytes = this.cfg.blockSize * 4;

        // Count blocks ready
        let nBlocksReady = this._data.sigBytes / blockSizeBytes;
        if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
        } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
        }

        // Count words ready
        const nWordsReady = nBlocksReady * this.cfg.blockSize;

        // Count bytes ready
        const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);

        // Process blocks
        let processedWords;
        if (nWordsReady) {
            for (let offset = 0; offset < nWordsReady; offset += this.cfg.blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(this._data.words, offset);
            }

            // Remove processed words
            processedWords = this._data.words.splice(0, nWordsReady);
            this._data.sigBytes -= nBytesReady;
        }

        // Return processed words
        return new WordArray(processedWords, nBytesReady);
    }

    /**
     * Creates a copy of this object.
     *
     * @return The clone.
     *
     * @example
     *
     *     let clone = bufferedBlockAlgorithm.clone();
     */
    clone(): BufferedBlockAlgorithm {
        const clone = this.constructor();

        for(const attr in this) {
            if(this.hasOwnProperty(attr)) {
                clone[attr] = this[attr];
            }
        }

        clone._data = this._data.clone();

        return clone;
    }
}