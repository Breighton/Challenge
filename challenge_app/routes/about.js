const version = exports.version = 'v0.0.2';

exports.show = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({'Title' : 'Gaia Developer Challenge', 'Version' : version})
}

