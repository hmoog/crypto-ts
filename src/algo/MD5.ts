import { Hasher } from '../lib/Hasher';
import { WordArray } from '../lib/WordArray';

// Constants table
const T: Array<number> = [];

// Compute constants
for(let i = 0; i < 64; i++) {
    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}

export class MD5 extends Hasher {
    public _hash!: WordArray;

    public static FF(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        const n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    public static GG(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        const n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    public static HH(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        const n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    public static II(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        const n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    public reset() {
        // reset core values
        super.reset();

        this._hash = new WordArray([
            0x67452301, 0xefcdab89,
            0x98badcfe, 0x10325476
        ]);
    }

    public _doProcessBlock(M: Array<number>, offset: number) {
        // Swap endian
        for(let i = 0; i < 16; i++) {
            // Shortcuts
            const offset_i = offset + i;
            const M_offset_i = M[offset_i];

            M[offset_i] = (
                (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
            );
        }

        // Shortcuts
        const H = this._hash.words;

        const M_offset_0  = M[offset + 0];
        const M_offset_1  = M[offset + 1];
        const M_offset_2  = M[offset + 2];
        const M_offset_3  = M[offset + 3];
        const M_offset_4  = M[offset + 4];
        const M_offset_5  = M[offset + 5];
        const M_offset_6  = M[offset + 6];
        const M_offset_7  = M[offset + 7];
        const M_offset_8  = M[offset + 8];
        const M_offset_9  = M[offset + 9];
        const M_offset_10 = M[offset + 10];
        const M_offset_11 = M[offset + 11];
        const M_offset_12 = M[offset + 12];
        const M_offset_13 = M[offset + 13];
        const M_offset_14 = M[offset + 14];
        const M_offset_15 = M[offset + 15];

        // Working variables
        let a = H[0];
        let b = H[1];
        let c = H[2];
        let d = H[3];

        // Computation
        a = MD5.FF(a, b, c, d, M_offset_0,  7,  T[0]);
        d = MD5.FF(d, a, b, c, M_offset_1,  12, T[1]);
        c = MD5.FF(c, d, a, b, M_offset_2,  17, T[2]);
        b = MD5.FF(b, c, d, a, M_offset_3,  22, T[3]);
        a = MD5.FF(a, b, c, d, M_offset_4,  7,  T[4]);
        d = MD5.FF(d, a, b, c, M_offset_5,  12, T[5]);
        c = MD5.FF(c, d, a, b, M_offset_6,  17, T[6]);
        b = MD5.FF(b, c, d, a, M_offset_7,  22, T[7]);
        a = MD5.FF(a, b, c, d, M_offset_8,  7,  T[8]);
        d = MD5.FF(d, a, b, c, M_offset_9,  12, T[9]);
        c = MD5.FF(c, d, a, b, M_offset_10, 17, T[10]);
        b = MD5.FF(b, c, d, a, M_offset_11, 22, T[11]);
        a = MD5.FF(a, b, c, d, M_offset_12, 7,  T[12]);
        d = MD5.FF(d, a, b, c, M_offset_13, 12, T[13]);
        c = MD5.FF(c, d, a, b, M_offset_14, 17, T[14]);
        b = MD5.FF(b, c, d, a, M_offset_15, 22, T[15]);

        a = MD5.GG(a, b, c, d, M_offset_1,  5,  T[16]);
        d = MD5.GG(d, a, b, c, M_offset_6,  9,  T[17]);
        c = MD5.GG(c, d, a, b, M_offset_11, 14, T[18]);
        b = MD5.GG(b, c, d, a, M_offset_0,  20, T[19]);
        a = MD5.GG(a, b, c, d, M_offset_5,  5,  T[20]);
        d = MD5.GG(d, a, b, c, M_offset_10, 9,  T[21]);
        c = MD5.GG(c, d, a, b, M_offset_15, 14, T[22]);
        b = MD5.GG(b, c, d, a, M_offset_4,  20, T[23]);
        a = MD5.GG(a, b, c, d, M_offset_9,  5,  T[24]);
        d = MD5.GG(d, a, b, c, M_offset_14, 9,  T[25]);
        c = MD5.GG(c, d, a, b, M_offset_3,  14, T[26]);
        b = MD5.GG(b, c, d, a, M_offset_8,  20, T[27]);
        a = MD5.GG(a, b, c, d, M_offset_13, 5,  T[28]);
        d = MD5.GG(d, a, b, c, M_offset_2,  9,  T[29]);
        c = MD5.GG(c, d, a, b, M_offset_7,  14, T[30]);
        b = MD5.GG(b, c, d, a, M_offset_12, 20, T[31]);

        a = MD5.HH(a, b, c, d, M_offset_5,  4,  T[32]);
        d = MD5.HH(d, a, b, c, M_offset_8,  11, T[33]);
        c = MD5.HH(c, d, a, b, M_offset_11, 16, T[34]);
        b = MD5.HH(b, c, d, a, M_offset_14, 23, T[35]);
        a = MD5.HH(a, b, c, d, M_offset_1,  4,  T[36]);
        d = MD5.HH(d, a, b, c, M_offset_4,  11, T[37]);
        c = MD5.HH(c, d, a, b, M_offset_7,  16, T[38]);
        b = MD5.HH(b, c, d, a, M_offset_10, 23, T[39]);
        a = MD5.HH(a, b, c, d, M_offset_13, 4,  T[40]);
        d = MD5.HH(d, a, b, c, M_offset_0,  11, T[41]);
        c = MD5.HH(c, d, a, b, M_offset_3,  16, T[42]);
        b = MD5.HH(b, c, d, a, M_offset_6,  23, T[43]);
        a = MD5.HH(a, b, c, d, M_offset_9,  4,  T[44]);
        d = MD5.HH(d, a, b, c, M_offset_12, 11, T[45]);
        c = MD5.HH(c, d, a, b, M_offset_15, 16, T[46]);
        b = MD5.HH(b, c, d, a, M_offset_2,  23, T[47]);

        a = MD5.II(a, b, c, d, M_offset_0,  6,  T[48]);
        d = MD5.II(d, a, b, c, M_offset_7,  10, T[49]);
        c = MD5.II(c, d, a, b, M_offset_14, 15, T[50]);
        b = MD5.II(b, c, d, a, M_offset_5,  21, T[51]);
        a = MD5.II(a, b, c, d, M_offset_12, 6,  T[52]);
        d = MD5.II(d, a, b, c, M_offset_3,  10, T[53]);
        c = MD5.II(c, d, a, b, M_offset_10, 15, T[54]);
        b = MD5.II(b, c, d, a, M_offset_1,  21, T[55]);
        a = MD5.II(a, b, c, d, M_offset_8,  6,  T[56]);
        d = MD5.II(d, a, b, c, M_offset_15, 10, T[57]);
        c = MD5.II(c, d, a, b, M_offset_6,  15, T[58]);
        b = MD5.II(b, c, d, a, M_offset_13, 21, T[59]);
        a = MD5.II(a, b, c, d, M_offset_4,  6,  T[60]);
        d = MD5.II(d, a, b, c, M_offset_11, 10, T[61]);
        c = MD5.II(c, d, a, b, M_offset_2,  15, T[62]);
        b = MD5.II(b, c, d, a, M_offset_9,  21, T[63]);

        // Intermediate hash value
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
    }

    public _doFinalize(): WordArray {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

        const nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
        const nBitsTotalL = nBitsTotal;
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
            (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
        );
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
            (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
        );

        data.sigBytes = (dataWords.length + 1) * 4;

        // Hash final blocks
        this._process();

        // Shortcuts
        const hash = this._hash;
        const H = hash.words;

        // Swap endian
        for (let i = 0; i < 4; i++) {
            // Shortcut
            const H_i = H[i];

            H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                   (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
        }

        // Return final computed hash
        return hash;
    }
}