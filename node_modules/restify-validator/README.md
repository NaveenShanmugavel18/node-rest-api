# restify-validator

A [restify.js]( https://github.com/mcavage/node-restify ) middleware for
[node-validator]( https://github.com/chriso/node-validator ).

This is basically a copy of a [gist]( https://gist.github.com/752126 ) by
node-validator author [chriso]( https://github.com/chriso ).

## Installation

```
npm install restify-validator
```

## Usage

```javascript
var util = require('util'),
    restify = require('restify'),
    restifyValidator = require('restify-validator'),
    app = restify.createServer();

app.use(restify.bodyParser());
app.use(restify.queryParser());
app.use(restifyValidator);

app.post('/:urlparam', function(req, res) {

  req.assert('postparam', 'Invalid postparam').notEmpty().isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('urlparam', 'Invalid urlparam').isAlpha();

  req.sanitize('postparam').toBoolean();

  var errors = req.validationErrors();
  if (errors) {
    res.send(500 ,'There have been validation errors: ' + util.inspect(errors));
    return;
  }
  res.json({
    urlparam: req.params['urlparam'],
    getparam: req.params['getparam'],
    postparam: req.params['postparam']
  });
});

app.listen(8888);
```

Which will result in:

```
$ curl -d 'postparam=1' http://localhost:8888/test?getparam=1
{"urlparam":"test","getparam":"1","postparam":true}

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1
There have been validation errors: [
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1ab
There have been validation errors: [
  { param: 'getparam', msg: 'Invalid getparam', value: '1ab' },
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]
```