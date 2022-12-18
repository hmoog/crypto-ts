// DEPENDENCIES ////////////////////////////////////////////////////////////////////////////////////

// import indirectly referenced declarations
import {BufferedBlockAlgorithmConfig} from './lib/BufferedBlockAlgorithmConfig';

// LIB /////////////////////////////////////////////////////////////////////////////////////////////

import {WordArray} from './lib/WordArray';
import {BlockCipher} from './lib/BlockCipher';
import {CipherParams} from './lib/CipherParams';
import {Hasher} from './lib/Hasher';
import {SerializableCipher} from './lib/SerializableCipher';
import {PasswordBasedCipher} from './lib/PasswordBasedCipher';

export const lib = {
    BlockCipher: BlockCipher,
    WordArray: WordArray,
    CipherParams: CipherParams,
    Hasher: Hasher,
    SerializableCipher: SerializableCipher,
    PasswordBasedCipher: PasswordBasedCipher
};

// ALGORITHMS //////////////////////////////////////////////////////////////////////////////////////

import {AES as AESAlgorithm} from './algo/AES';
import {SHA256 as SHA256Algorithm} from './algo/SHA256';
import {MD5 as MD5Algorithm} from './algo/MD5';

export const algo = {
    AES: AESAlgorithm,
    SHA256: SHA256Algorithm,
    MD5: MD5Algorithm
};

// ENCODINGS ///////////////////////////////////////////////////////////////////////////////////////

import {Utf8} from './enc';
import {Hex} from './enc/Hex';
import {Base64} from './enc/Base64';

export const enc = {
    Utf8,
    Hex,
    Base64
};

// PADDING /////////////////////////////////////////////////////////////////////////////////////////

import {NoPadding} from './pad/NoPadding';
import {PKCS7} from './pad/PKCS7';

export const pad = {
    NoPadding: NoPadding,
    PKCS7: PKCS7
};

// MODES ///////////////////////////////////////////////////////////////////////////////////////////

import {CBC} from './mode/CBC';
import {ECB} from './mode/ECB';

export const mode = {
    CBC: CBC,
    ECB: ECB
};

// HELPERS /////////////////////////////////////////////////////////////////////////////////////////

export const AES = lib.BlockCipher._createHelper(algo.AES);
export const SHA256 = lib.Hasher._createHelper(algo.SHA256);
export const MD5 = lib.Hasher._createHelper(algo.MD5);

export default {lib, algo, enc, pad, mode, AES, SHA256, MD5};
