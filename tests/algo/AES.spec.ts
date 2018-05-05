import { TestBed } from '@angular/core/testing';

import { AES, SHA256, enc, mode, pad, lib, algo } from './../../crypto-ts';

describe('AES', () => {

    it('EncryptKeySize128', () => {
        expect(
            AES.encrypt(
                enc.Hex.parse('00112233445566778899aabbccddeeff'),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).ciphertext!.toString()
        ).toEqual('69c4e0d86a7b0430d8cdb78070b4c55a');
    });

    it('EncryptKeySize192', () => {
        expect(
            AES.encrypt(
                enc.Hex.parse('00112233445566778899aabbccddeeff'),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f1011121314151617'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).ciphertext!.toString()
        ).toEqual('dda97ca4864cdfe06eaf70a0ec0d7191');
    });

    it('EncryptKeySize256', () => {
        expect(
            AES.encrypt(
                enc.Hex.parse('00112233445566778899aabbccddeeff'),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).ciphertext!.toString()
        ).toEqual('8ea2b7ca516745bfeafc49904b496089');
    });

    it('DecryptKeySize128', () => {
        expect(
            AES.decrypt(
                new lib.CipherParams({
                    ciphertext: enc.Hex.parse('69c4e0d86a7b0430d8cdb78070b4c55a')
                }),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).toString()
        ).toEqual('00112233445566778899aabbccddeeff');
    });

    it('DecryptKeySize192', () => {
        expect(
            AES.decrypt(
                new lib.CipherParams({
                    ciphertext: enc.Hex.parse('dda97ca4864cdfe06eaf70a0ec0d7191')
                }),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f1011121314151617'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).toString()
        ).toEqual('00112233445566778899aabbccddeeff');
    });

    it('DecryptKeySize256', () => {
        expect(
            AES.decrypt(
                new lib.CipherParams({
                    ciphertext: enc.Hex.parse('8ea2b7ca516745bfeafc49904b496089')
                }),
                enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'),
                {
                    mode: mode.ECB,
                    padding: pad.NoPadding
                }
            ).toString()
        ).toEqual('00112233445566778899aabbccddeeff');
    });

    it('MultiPart', () => {
        const aes = algo.AES.createEncryptor(enc.Hex.parse('000102030405060708090a0b0c0d0e0f'), { mode: mode.ECB, padding: pad.NoPadding });
        const ciphertext1 = aes.process(enc.Hex.parse('001122334455'));
        const ciphertext2 = aes.process(enc.Hex.parse('66778899aa'));
        const ciphertext3 = aes.process(enc.Hex.parse('bbccddeeff'));
        const ciphertext4 = aes.finalize();

        expect(
            ciphertext1.concat(ciphertext2).concat(ciphertext3).concat(ciphertext4).toString()
        ).toEqual('69c4e0d86a7b0430d8cdb78070b4c55a');
    });

    it('InputIntegrity', () => {
        const message = enc.Hex.parse('00112233445566778899aabbccddeeff');
        const key = enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
        const iv = enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

        const expectedMessage = message.toString();
        const expectedKey = key.toString();
        const expectedIv = iv.toString();

        AES.encrypt(message, key, { iv: iv });

        expect(expectedMessage).toEqual(message.toString());
        expect(expectedKey).toEqual(key.toString());
        expect(expectedIv).toEqual(iv.toString());
    });

    it('Helper', () => {
        // Save original random method
        const random = lib.WordArray.random;

        // Replace random method with one that returns a predictable value
        lib.WordArray.random = function(nBytes) {
            const words = [];
            for(let i = 0; i < nBytes; i += 4) {
                words.push(0x11223344);
            }

            return new lib.WordArray(words, nBytes);
        };

        // Test
        expect(
            algo.AES.createEncryptor(
                SHA256('Jefe'), { mode: mode.ECB, padding: pad.NoPadding }
            ).finalize('Hi There').toString()
        ).toEqual(
            AES.encrypt(
                'Hi There', SHA256('Jefe'), { mode: mode.ECB, padding: pad.NoPadding }
            ).ciphertext!.toString()
        );

        expect(
            lib.SerializableCipher.encrypt(
                algo.AES, 'Hi There', SHA256('Jefe'), { mode: mode.ECB, padding: pad.NoPadding }
            ).toString()
        ).toEqual(
            AES.encrypt('Hi There', SHA256('Jefe'), { mode: mode.ECB, padding: pad.NoPadding }).toString()
        );

        expect(
            lib.PasswordBasedCipher.encrypt(algo.AES, 'Hi There', 'Jefe', { mode: mode.ECB, padding: pad.NoPadding }).toString()
        ).toEqual(
            AES.encrypt('Hi There', 'Jefe', { mode: mode.ECB, padding: pad.NoPadding }).toString()
        );

        // Restore random method
        lib.WordArray.random = random;
    });
});
