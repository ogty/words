type Markdown = string;

export type Word = {
  name: string;
  isAct: boolean;
  isLink: boolean;
  detail?: Markdown;
  aliases?: string[];
  fullName?: string;
  groupName?: string;
  isMultiple: boolean;
  isUndefined?: boolean;
};
