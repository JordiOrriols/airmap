export const createPageUrl = (page: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/${page}`;
};
