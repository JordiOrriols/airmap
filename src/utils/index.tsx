export const createPageUrl = (page: string): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/${page}`;
};
