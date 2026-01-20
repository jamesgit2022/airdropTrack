export const normalizeText = (text: string): string => {
  return text.normalize('NFKC');
};

export const createSlug = (text: string): string => {
  return normalizeText(text)
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};
