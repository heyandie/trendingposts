var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var https = require('https');

/* GET facebook page top posts */
router.get('/search', function(req, res) {
	var id = req.param('id');
	var url = 'https://graph.facebook.com/v2.7/'+id+'/posts?limit=10&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec';
	var posts = {};

	request(url, function (error, response, html) {

		if(!error) {
			var body = JSON.parse(response.body);
			
			if (body.error) {
				res.json({message: 'Error'})
			} else {
				var data = body.data;
				

				var urls = []

				for (var i=0; i < data.length; i++) {
					var object_id = data[i].id
					var object_endpoint = 'https://graph.facebook.com/v2.7/'+object_id+'/likes?summary=true&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec';
					urls.push(object_endpoint);


				}

				async.mapSeries(urls, https.get, function(err, responses) {
					try {
						console.log(err);
					}
					catch (ex){
						console.log('a');
					}
				});
			}

			
		} else {
			res.json({data: id});
		}
	})
	
})

module.exports = router