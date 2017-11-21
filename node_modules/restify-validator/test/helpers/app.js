// Sample app
var restify = require('restify');
var restifyValidator = require('../../index');

function App(port, validation) {
  this.app = null;
  this.port = port;
  this.validation = validation;
}
module.exports = App;

App.prototype.start = function() {
  var self = this;
  self.app = restify.createServer();

  self.app.use(restify.queryParser());
  self.app.use(restify.bodyParser());
  
  self.app.use(restifyValidator);

  self.app.get(/\/test(\d+)/, self.validation);
  self.app.get('/', self.validation);
  self.app.post('/', self.validation);
  self.app.get('/:testparam?', self.validation);
  self.app.post('/:testparam?', self.validation);

  self.app.listen(this.port);
};

App.prototype.stop = function() {
  this.app.close();
};
