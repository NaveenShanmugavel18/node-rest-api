module.exports = function(server, restify, restifyValidator) {
	server.use(restify.plugins.acceptParser(server.acceptable));
	server.use(restify.plugins.bodyParser());
	server.use(restify.plugins.queryParser());
	server.use(restifyValidator);
}