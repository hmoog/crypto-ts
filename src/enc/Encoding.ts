import { WordArray } from '../lib/WordArray';

export interface Encoding {
    stringify: (wordArray: WordArray) => string;

    parse: (str: string) => WordArray;
}
