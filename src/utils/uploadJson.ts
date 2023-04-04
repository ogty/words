import { words } from 'src/states';

export const uploadJson = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const json = event.target?.result as string;
    localStorage.setItem('words', json);
    words.set(JSON.parse(json));
  };
  reader.readAsText(file);
};
