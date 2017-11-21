var util = require('util'),
    restify = require('restify'),
    restifyValidator = require('../../index'),
    app = restify.createServer();

app.use(restify.bodyParser());
app.use(restifyValidator);

app.post('/:urlparam', function(req, res) {

  req.assert('postparam', 'Invalid postparam').notEmpty().isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('urlparam', 'Invalid urlparam').isAlpha();

  req.sanitize('postparam').toBoolean();

  var errors = req.validationErrors();
  if (errors) {
    res.send('There have been validation errors: ' + util.inspect(errors), 500);
    return;
  }
  res.send({
    urlparam: req.params['urlparam'],
    getparam: req.params['getparam'],
    postparam: req.params['postparam']
  });
});

app.listen(8888);
