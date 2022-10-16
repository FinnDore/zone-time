import { atom } from 'jotai';

export const firstAndLastAtom = atom<{ first: Date; last: Date } | null>(null);
