function decodeEntities(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}

function formatFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let i = 0
  for(;;) {
    if(size < 1024) break
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}

module.exports = {
  decodeEntities,
  formatFileSize
}