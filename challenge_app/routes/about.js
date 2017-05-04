
exports.show = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({'Title' : 'Gaia Developer Challenge', 'Version' : 'v0.0.1'})
}

