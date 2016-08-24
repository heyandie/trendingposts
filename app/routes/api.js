var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');
var async = require('async');

/* GET facebook page top posts */
router.get('/search', function(req, res) {
	var id = req.param('id');
	var url = 'https://graph.facebook.com/v2.7/'+id+'/posts?limit=3&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec';
	var posts = {};

	request(url, function (error, response, html) {

		if(!error) {
			var body = JSON.parse(response.body);

			if (body.error) {
				res.json({message: 'Error'})
			} else {
				var data = body.data;
        var posts = {};

				var urls = [];
        for (var i=0; i < data.length; i++) {
          var object_id = data[i].id
          urls.push('https://graph.facebook.com/v2.7/'+object_id+'/likes?summary=true&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec');
        }

        async.mapSeries(urls, function(url, callback) {
          request(url, function (error, response, html) {
            if (error) return callback(error);
            callback(null, url);
          });
        }, function(err, results) {
            res.json({data: posts});
        });


			}


		} else {
			res.json({data: id});
		}
	})

})

module.exports = router
