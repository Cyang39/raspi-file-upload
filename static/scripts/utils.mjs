export function get(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4)
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
        callback(JSON.parse(xhr.responseText))
  }
  xhr.send()
}

export function pGet(url) {
  return new Promise(function (resolve, reject) {
    get(url, function (data) {
      resolve(data)
    })
  })
}

export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}