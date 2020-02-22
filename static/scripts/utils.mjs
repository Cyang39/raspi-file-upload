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

export function changeURLPar(destiny, par, par_value) {
  var pattern = par + '=([^&]*)';
  var replaceText = par + '=' + par_value;
  if (destiny.match(pattern)) {
    var tmp = '/\\' + par + '=[^&]*/';
    tmp = destiny.replace(eval(tmp), replaceText);
    return (tmp);
  }
  else {
    if (destiny.match('[\?]')) {
      return destiny + '&' + replaceText;
    }
    else {
      return destiny + '?' + replaceText;
    }
  }
  return destiny + '\n' + par + '\n' + par_value;
}