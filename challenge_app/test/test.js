const chai = require('chai');
const chaiHttp = require('chai-http');
const challenge = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('about', function() {
    it('should report Version on /about GET', function(done) {
        chai.request(challenge)
          .get('/about')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('Version');
            res.body.Version.should.equal('v0.0.1')
            done();
          })
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
            res.body.previewNid.should.equal(41096)
            res.body.should.have.property('titleNid');
            res.body.titleNid.should.equal(34871)
            res.body.should.have.property('previewDuration');
            res.body.previewDuration.should.equal(314)
            done();
          })
    });
});
/*
describe('preview URL bad code', function() {
    this.timeout(5000);
    it('should return not found error', function(done) {
        chai.request(challenge)
          .get('/terms/xxx/longest-preview-media-url')
          .end(function(err, res){
            res.should.have.status(500);
            done();
          })
    });
});
*/