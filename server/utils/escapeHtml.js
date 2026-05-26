const escapeHtml = (str) => {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>\"']/g, (c) => {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c] || c);
  });
};

export default escapeHtml;
