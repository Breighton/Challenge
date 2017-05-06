const bunyan = require('bunyan');
const logger = bunyan.createLogger({name: "Challenge"});

const Client = require('node-rest-client').Client;
const client = new Client();

let res = null;

exports.find = (req, ires) => {
  res = ires;
  res.setHeader("Access-Control-Allow-Origin", "*");
  logger.info({message: "Processing request", tid: req.params.tid});

  fetchTermList(req.params.tid)
  .then( fetchLongestPreview )
  .then( fetchPreviewUrl )
  .catch((errMsg) => {
    logger.error({message: errMsg});
    res.status(500).send(errMsg);
  });
};

//the exports are included here so can unit test each function separately
const fetchTermList = exports.fetchTermList = (initialTid) => {
  return new Promise( function(resolve, reject) {
    let args = {
      path: { "tid": initialTid }, // path substitution var
      headers: { "Accept": "application/json" }
    };
    client.get("http://d6api.gaia.com/vocabulary/1/${tid}", args,
      termListFetch = function(data, response) {
        if (response.statusCode != 200){
          let errMsg = "Internal error while attempting to read d6api.gaia.com/vocabulary/1/${tid}, received code: "
             + response.statusCode;
           reject(errMsg);
        }
        else if (Object.keys(data.terms).length == 0){
          let errMsg = "Internal error while attempting to read d6api.gaia.com/vocabulary/1/${tid}, terms key empty";
          reject(errMsg);
        }
        else {
          // get tid from first term in response
          resolve(data.terms[0].tid);
        }
      }
    )
    .on('error', termListFetchError = (err) => {
      let errMsg = "Internal error while attempting to reach d6api.gaia.com/vocabulary/1/${tid}, received message: "
        + err.message;
      reject(errMsg);
    });
  });
};

const fetchLongestPreview = exports.fetchLongestPreview = ( tid ) => {
  return new Promise( function(resolve, reject) {
    let termArgs = {
        path: { "tid": tid }, // path substitution var
        headers: { "Accept": "application/json" }
    };
    client.get("http://d6api.gaia.com/videos/term/${tid}", termArgs,
      videoListFetch = (data, response) => {
        // iterate through titles in response to find longest duration preview
        if (response.statusCode != 200){
          let errMsg = "Internal error while attempting to read d6api.gaia.com/videos/term/${tid}, received code: "
            + response.statusCode;
          reject(errMsg);
        }
        else if (Object.keys(data.titles).length == 0){
          let errMsg = "Internal error while attempting to d6api.gaia.com/videos/term/${tid}, titles key empty";
          reject(errMsg);
        }
        else {
          // init return object
          let previewData = {
            "longestDuration": 0,
            "previewNid": -1,
            "titleNid": -1,
            "content": ''
          };
          // iterate through titles in response to find longest duration preview
          data.titles.forEach((title) => {
            if (typeof title.preview !== 'undefined') {
              duration = parseInt(title.preview.duration, 10)
              // insure this video has a preview
              if (duration > previewData.longestDuration) {
                  previewData.titleNid = parseInt(title.nid);
                  previewData.longestDuration = duration;
                  previewData.previewNid = parseInt(title.preview.nid);
                  previewData.content = title.preview.contentId;
              }
            }
          });
          resolve(previewData);
        }
      }
    )
    .on('error', videoListFetchError = (err) => {
      let errMsg = "Internal error while attempting to reach d6api.gaia.com/videos/1/${tid}, received message: "
        + err.message;
      reject(errMsg);
    });
  });
};

const fetchPreviewUrl = exports.fetchPreviewUrl = ( longestPreview ) => {
  return new Promise( function(resolve, reject) {
    // read URL of longest preview
    let mediaArgs = {
        path: { "nid": longestPreview.previewNid}, // path substitution var
        headers: { "Accept": "application/json" }
    };
    //return final URL given preview nid
    client.get("http://d6api.gaia.com/media/${nid}", mediaArgs,
      urlFetch = (data, response) => {
        if (response.statusCode != 200){
          let errMsg = "Internal error while attempting to read d6api.gaia.com/media/{nid}, received code: "
            + response.statusCode;
          reject(errMsg);
        }
        else {
          // form and reply with json response
          res.json({
              'bcHLS' : data.mediaUrls.bcHLS,
              'titleNid' : longestPreview.titleNid,
              'previewNid' : longestPreview.previewNid,
              'previewDuration': longestPreview.longestDuration,
              'title' : longestPreview.content
          });
        }
      }
    )
    .on('error', urlFetchError = (err) => {
      let errMsg = "Internal error while attempting to reach d6api.gaia.com/media/{nid, received message: "
        + err.message;
      reject(errMsg);
    });
  });
};
