const config = {
    twitter: {
      username: process.env.BOT_USERNAME,
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }
  };
const Twit =require('twit');
const T = new Twit(config.twitter);

module.exports = {
  tweet: function(text, cb){
    T.post('statuses/update', { status: text }, function(err, data, response) {
      cb(err, data, response);
    });
  },
  post_image: function(text, image_base64, cb) {
   T.post('media/upload', { media_data: image_base64 }, function (err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err);
        }
      }
      else{
        console.log('tweeting the image...');
        T.post('statuses/update', {
          status: text,
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err);
            }
          }
          else{
            console.log('tweeted');
            if (cb){
              cb(null);
            }
          }
        });
      }
    });
  }
};
