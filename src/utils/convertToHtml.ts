import { words } from 'src/states';
import { marked } from 'marked';

export const convertToHtml = (text: string): string => {
  let wordNames = [] as string[];
  words.subscribe((words) => {
    wordNames = words.filter((word) => word.isLink).map((word) => word.name);
  });
  wordNames = wordNames.filter((name) => name.length > 1);
  wordNames.forEach((name) => {
    const regex = new RegExp(name, 'g');
    text = text.replace(regex, `<a href="#${name}">${name}</a>`);
  });
  return marked(text);
};
