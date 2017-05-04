const chai = require('chai');
const chaiHttp = require('chai-http');
const challenge = require('../app');
const should = chai.should();
const lp = require('../routes/longestPreview')

chai.use(chaiHttp);

describe('about', function() {
    it('should report Version on /about GET', function(done) {
        chai.request(challenge)
          .get('/about')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('Version');
            res.body.Version.should.equal('v0.0.2')
            done();
          })
    });
});

describe('preview function tests', function() {
  this.timeout(5000);
  it('fetchTermList should return a resolve promise with tid', function() {
    return lp.fetchTermList(26681).then((result) => {
      result.should.equal('26686');
    });
  });
  it('fetchTermList should return an internal error reject promise given bogus tid', function() {
    return lp.fetchTermList(1234567).catch(function(errMsg) {
      errMsg.should.include('Internal error');
    });
  });
  it('fetchLongestPreview should return a resolve promise with term nid', function() {
    return lp.fetchLongestPreview(26686).then((result) => {
      result.titleNid.should.equal(34871);
      result.previewNid.should.equal(41096);
      result.longestDuration.should.equal(314);
    });
  });
  it('fetchLongestPreview should return an internal error reject promise given bogus nid', function() {
    return lp.fetchLongestPreview(1234567).catch(function(errMsg) {
      errMsg.should.include('Internal error');
    });
  });
  // Note: good result tested in other tests, only need test error case here
  it('fetchPreviewUrl should return an internal error reject promise given bogus tid', function() {
    return lp.fetchPreviewUrl(1234567).catch(function(errMsg) {
      errMsg.should.include('Internal error');
    });
  });
});

describe('preview URL return', function() {
    this.timeout(5000);
    it('should return URL and data about longest preview', function(done) {
        chai.request(challenge)
          .get('/terms/26681/longest-preview-media-url')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('previewNid');
            res.body.previewNid.should.equal(41096);
            res.body.should.have.property('titleNid');
            res.body.titleNid.should.equal(34871);
            res.body.should.have.property('previewDuration');
            res.body.previewDuration.should.equal(314);
            done();
          })
    });
});

describe('preview URL bad id', function() {
    this.timeout(5000);
    it('should return internal error', function(done) {
        chai.request(challenge)
          .get('/terms/1234567/longest-preview-media-url')
          .end(function(err, res){
            res.should.have.status(500);
            done();
          })
    });
});
