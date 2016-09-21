var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');
var async = require('async');
var url = require('url');
var og = require('open-graph');
/* GET facebook page top posts */
router.get('/search', function(req, res) {
	var id = req.param('id');
	var endpoint = 'https://graph.facebook.com/v2.7/'+id+'/posts?fields=id,link,message,name,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec&limit=50';
	var posts = {};


	request(endpoint, function (error, response, html) {

		if(!error) {
			var body = JSON.parse(response.body);

			if (body.error) {
				res.json({message: 'Error'})
			} else {
				var data = body.data;
        var posts = [];

        async.map(data, function(item, callback) {
          var shares = 'shares' in item ? item.shares.count : 0;
          var likes = 'likes' in item ? item.likes.summary.total_count : 0;
          var comments = 'comments' in item ? item.comments.summary.total_count : 0;
          var link = 'link' in item ? item.link : '';
          var message = 'message' in item ? item.message : '';
          var name = 'name' in item ? item.name : '';

          var object = {
            id: item.id,
            likes: likes,
            shares: shares,
            comments: comments,
            link: link,
            message: message,
            name: name,
            image_url: ''
          }


          og(link, function(er, res){
            if(res) {
              if('image' in res) {
                object.title = res.title;
                object.image_url = res.image.url;
              }
            }
            posts.push(object);
            callback(null, res);
          });


        }, function (err, results) {
          res.json({data: posts});
        });
			}


		} else {
			res.json({data: id});
		}
	})

})

router.get('/page', function(req, res) {
  var id = req.param('id');
  var endpoint = 'https://graph.facebook.com/v2.7/'+id+'?fields=name,cover{source},picture{url},fan_count&access_token=224598357874885|f40ac5f404146d8286bd081fd3eb6eec';

  request(endpoint, function(error, response, html) {
    if(!error) {
      var body = JSON.parse(response.body);
      if(body.error) {
        res.status(404);
        res.json({message: 'The page alias you requested does not exist.'});
      } else {
        var data = {
          name: body.name,
          fan_count: body.fan_count,
          picture_url: body.picture.data.url,
          cover_url: body.cover.source
        }
        res.json({data: data});
      }
    } else {
      res.status(404);
      res.json({message: 'The page alias you requested does not exist.'});
    }
  });
});

module.exports = router
