export function capitalize(str: string) {
  const splittedStr = str.split("");
  const firstLetterUppercased = splittedStr[0].toUpperCase();

  splittedStr[0] = firstLetterUppercased;
  return splittedStr.join("");
}
