import { writable } from 'svelte/store';
import type { Word } from 'src/types';

export const now = writable('');
export const wordsMemorized = writable(
  (JSON.parse(localStorage.getItem('wordsMemorized') || '[]') as string[]) || ([] as string[]),
);
export const isOpen = writable(false);
export const layout = writable('grid grid-cols-2 gap-2');
export const isDisplayNumber = writable(false);

export const words = writable(JSON.parse(localStorage.getItem('words') || '[]') as Word[]);

export const isPreview = writable(false);
export const isFilesOpen = writable(false);
export const selectedFile = writable(localStorage.getItem('selectedFile') || '');
export const targetDirectory = writable(localStorage.getItem('path') || '/Users');
