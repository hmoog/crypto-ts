import { BlockCipher } from '../lib/BlockCipher';
import { WordArray } from '../lib/WordArray';
import { BufferedBlockAlgorithmConfig } from '../lib/BufferedBlockAlgorithmConfig';

// Define lookup tables
const SBOX: Array<number> = [];
const INV_SBOX: Array<number> = [];
const SUB_MIX_0: Array<number> = [];
const SUB_MIX_1: Array<number> = [];
const SUB_MIX_2: Array<number> = [];
const SUB_MIX_3: Array<number> = [];
const INV_SUB_MIX_0: Array<number> = [];
const INV_SUB_MIX_1: Array<number> = [];
const INV_SUB_MIX_2: Array<number> = [];
const INV_SUB_MIX_3: Array<number> = [];

// Compute lookup tables
(function () {
    // Compute double table
    const d = [];
    for (let i = 0; i < 256; i++) {
        if (i < 128) {
            d[i] = i << 1;
        } else {
            d[i] = (i << 1) ^ 0x11b;
        }
    }

    // Walk GF(2^8)
    let x = 0;
    let xi = 0;
    for (let i = 0; i < 256; i++) {
        // Compute sbox
        let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
        sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
        SBOX[x] = sx;
        INV_SBOX[sx] = x;

        // Compute multiplication
        const x2 = d[x];
        const x4 = d[x2];
        const x8 = d[x4];

        // Compute sub bytes, mix columns tables
        let t = (d[sx] * 0x101) ^ (sx * 0x1010100);
        SUB_MIX_0[x] = (t << 24) | (t >>> 8);
        SUB_MIX_1[x] = (t << 16) | (t >>> 16);
        SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
        SUB_MIX_3[x] = t;

        // Compute inv sub bytes, inv mix columns tables
        t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
        INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
        INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
        INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
        INV_SUB_MIX_3[sx] = t;

        // Compute next counter
        if (!x) {
            x = xi = 1;
        } else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
        }
    }
}());

// Precomputed Rcon lookup
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

export class AES extends BlockCipher {
    // 256 / 32
    public static keySize = 8;

    _nRounds!: number;

    _key!: WordArray;

    _keyPriorReset!: WordArray;

    _keySchedule!: Array<number>;

    _invKeySchedule!: Array<number>;

    constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
        super(xformMode, key, cfg);
    }

    reset() {
        // reset core values
        super.reset();

        // Skip reset of nRounds has been set before and key did not change
        if (this._nRounds && this._keyPriorReset === this._key) {
            return;
        }

        // Shortcuts
        const key = this._keyPriorReset = this._key;
        const keyWords = key.words;
        const keySize = key.sigBytes / 4;

        // Compute number of rounds
        const nRounds = this._nRounds = keySize + 6;

        // Compute number of key schedule rows
        const ksRows = (nRounds + 1) * 4;

        // Compute key schedule
        const keySchedule: Array<number> = this._keySchedule = [];
        for (let ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
            } else {
                let t = keySchedule[ksRow - 1];

                if (!(ksRow % keySize)) {
                    // Rot word
                    t = (t << 8) | (t >>> 24);

                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                    // Mix Rcon
                    t ^= RCON[(ksRow / keySize) | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize === 4) {
                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                }

                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
            }
        }

        // Compute inv key schedule
        const invKeySchedule: Array<number> = this._invKeySchedule = [];
        for (let invKsRow = 0; invKsRow < ksRows; invKsRow++) {
            const ksRow = ksRows - invKsRow;

            let t;
            if (invKsRow % 4) {
                t = keySchedule[ksRow];
            } else {
                t = keySchedule[ksRow - 4];
            }

            if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
            } else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                           INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
            }
        }
    }

    encryptBlock(M: Array<number>, offset: number) {
        this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
    }

    decryptBlock(M: Array<number>, offset: number) {
        // Swap 2nd and 4th rows
        let t = M[offset + 1];
        M[offset + 1] = M[offset + 3];
        M[offset + 3] = t;

        this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

        // Inv swap 2nd and 4th rows
        t = M[offset + 1];
        M[offset + 1] = M[offset + 3];
        M[offset + 3] = t;
    }

    _doCryptBlock(
        M: Array<number>,
        offset: number,
        keySchedule: Array<number>,
        sub_mix_0: Array<number>,
        sub_mix_1: Array<number>,
        sub_mix_2: Array<number>,
        sub_mix_3: Array<number>,
        sbox: Array<number>
    ) {
        // Get input, add round key
        let s0 = M[offset]     ^ keySchedule[0];
        let s1 = M[offset + 1] ^ keySchedule[1];
        let s2 = M[offset + 2] ^ keySchedule[2];
        let s3 = M[offset + 3] ^ keySchedule[3];

        // Key schedule row counter
        let ksRow = 4;

        // Rounds
        for (let round = 1; round < this._nRounds; round++) {
            // Shift rows, sub bytes, mix columns, add round key
            const t0 = sub_mix_0[s0 >>> 24] ^ sub_mix_1[(s1 >>> 16) & 0xff] ^ sub_mix_2[(s2 >>> 8) & 0xff] ^ sub_mix_3[s3 & 0xff] ^
                     keySchedule[ksRow++];
            const t1 = sub_mix_0[s1 >>> 24] ^ sub_mix_1[(s2 >>> 16) & 0xff] ^ sub_mix_2[(s3 >>> 8) & 0xff] ^ sub_mix_3[s0 & 0xff] ^
                     keySchedule[ksRow++];
            const t2 = sub_mix_0[s2 >>> 24] ^ sub_mix_1[(s3 >>> 16) & 0xff] ^ sub_mix_2[(s0 >>> 8) & 0xff] ^ sub_mix_3[s1 & 0xff] ^
                     keySchedule[ksRow++];
            const t3 = sub_mix_0[s3 >>> 24] ^ sub_mix_1[(s0 >>> 16) & 0xff] ^ sub_mix_2[(s1 >>> 8) & 0xff] ^ sub_mix_3[s2 & 0xff] ^
                     keySchedule[ksRow++];

            // Update state
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
        }

        // Shift rows, sub bytes, add round key
        const t0g = ((sbox[s0 >>> 24] << 24) | (sbox[(s1 >>> 16) & 0xff] << 16) | (sbox[(s2 >>> 8) & 0xff] << 8) | sbox[s3 & 0xff]) ^
                    keySchedule[ksRow++];
        const t1g = ((sbox[s1 >>> 24] << 24) | (sbox[(s2 >>> 16) & 0xff] << 16) | (sbox[(s3 >>> 8) & 0xff] << 8) | sbox[s0 & 0xff]) ^
                    keySchedule[ksRow++];
        const t2g = ((sbox[s2 >>> 24] << 24) | (sbox[(s3 >>> 16) & 0xff] << 16) | (sbox[(s0 >>> 8) & 0xff] << 8) | sbox[s1 & 0xff]) ^
                    keySchedule[ksRow++];
        const t3g = ((sbox[s3 >>> 24] << 24) | (sbox[(s0 >>> 16) & 0xff] << 16) | (sbox[(s1 >>> 8) & 0xff] << 8) | sbox[s2 & 0xff]) ^
                    keySchedule[ksRow++];

        // Set output
        M[offset]     = t0g;
        M[offset + 1] = t1g;
        M[offset + 2] = t2g;
        M[offset + 3] = t3g;
    }
}