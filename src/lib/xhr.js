exports.getJSON = (url, cb) => {
    var req = new XMLHttpRequest();
    req.onload = function () {
        if (req.status === 404) {
            cb(new Error('not found'), null);
        } else {
            cb(null, JSON.parse(req.response));
        }
    };
    req.timeout = 15000;
    req.ontimeout = function () { cb(new Error('not found'), null); }
    req.open('GET', url);
    req.send();
};

exports.postJSON = (url, obj, cb) => {
  var req = new XMLHttpRequest();
  req.onload = function () {
    cb(JSON.parse(req.response));
  };
  req.open('POST', url);
  req.send(JSON.stringify(obj));
};

exports.deleteJSON = (url, cb) => {
  var req = new XMLHttpRequest();
  req.onload = cb;
  req.open('DELETE', url);
  req.send();
};