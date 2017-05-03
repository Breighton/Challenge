var Client = require('node-rest-client').Client;

var client = new Client();

exports.find = function (req, res) {
  console.log("Processing request: " + req.params.tid)
    let args = {
        path: { "tid": req.params.tid }, // path substitution var
        headers: { "Accept": "application/json" }
    };

    client.get("http://d6api.gaia.com/vocabulary/1/${tid}", args,
      function (data, response) {
        if (response.statusCode != 200){
          console.log('Error on reponse from /vocabulary', response.statusCode);
          res.status(500).send('Internal error while attempting to read d6api.gaia.com/vocabulary/1/${tid}!')
          return
        }
        // get tid from first term in response
        let firstTermTid = data.terms[0].tid
        //console.log(data);

        let term_args = {
            path: { "tid": firstTermTid }, // path substitution var
            headers: { "Accept": "application/json" }
        };
        client.get("http://d6api.gaia.com/videos/term/${tid}", term_args,
          function (data, response) {
            // iterate through titles in response to find longest duration preview
            if (response.statusCode != 200){
              console.log('Error on reponse from /videos', response.statusCode);
              res.status(500).send('Internal error while attempting to read d6api.gaia.com/videos/term/${tid}!')
              return
            }
            // iterate through titles in response to find longest duration preview
            let longestDuration = 0
            let previewNid = -1
            let titleNid = -1
            let content = ''
            data.titles.forEach(function(title) {
              if (typeof title.preview !== 'undefined') {
                duration = parseInt(title.preview.duration, 10)
                if (duration > longestDuration) {
                    titleNid = parseInt(title.nid)
                    longestDuration = duration
                    previewNid = parseInt(title.preview.nid)
                    content = title.preview.contentId
                }
              }
            });

            // read URL of longest preview
            let media_args = {
                path: { "nid": previewNid}, // path substitution var
                headers: { "Accept": "application/json" }
            };
            client.get("http://d6api.gaia.com/media/${nid}", media_args,
              function (data, response) {
                if (response.statusCode != 200){
                  console.log('Error on reponse from /media', response.statusCode);
                  res.status(500).send('Internal error while attempting to read d6api.gaia.com/media/{nid}!')
                  return
                }
                // form and reply with json response
                res.json({
                    'bcHLS' : data.mediaUrls.bcHLS,
                    'titleNid' : titleNid,
                    'previewNid' : previewNid,
                    'previewDuration': longestDuration,
                    'title' : content
                })
              }).on('error', function (err) {
                console.log('Error on request to /media', err.request.options);
                res.status(500).send('Internal error while attempting to reach d6api.gaia.com/media/{nid}!')
              });
          }).on('error', function (err) {
            console.log('Error on request to /videos', err.request.options);
            res.status(500).send('Internal error while attempting to reach d6api.gaia.com/videos/term/${tid}!')
          });
      }).on('error', function (err) {
        console.log('Error on request to /vocabulary', err.request.options);
        res.status(500).send('Internal error while attempting to reach d6api.gaia.com/vocabulary/1/${tid}!')
      });
};

