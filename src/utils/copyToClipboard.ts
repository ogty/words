export const copyToClipboard = (text: string) => {
  const textareaForCopy = document.createElement('textarea');
  textareaForCopy.value = text;
  document.body.appendChild(textareaForCopy);
  textareaForCopy.select();
  document.execCommand('copy');
  document.body.removeChild(textareaForCopy);
};
