export const getPublicId = (url) => {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return `safecity_reports/${lastPart.split(".")[0].split("?")[0]}`;
};
