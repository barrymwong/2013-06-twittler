$(document).ready(function(){
  var global = {};
  global.lastTweetUpdate = 0;
  global.totalTweets = 0;

  var $tweets = $('#tweets');

  var init = function() {
    getTweets();
    getConstantUpdate();

    $('#update').on('click', function(){
      var tweet = streams.home;

      for (var i=global.lastTweetUpdate; i<streams.home.length-1; i++){
        console.log(i + ' | ' + streams.home[i]);
        $tweets.prepend( newTweetBox(tweet[i].user, tweet[i].message, tweet[i].created_at) );
      }
      //console.log(global.lastTweetUpdate);
      global.lastTweetUpdate = streams.home.length-1;
      $('#count').text('');
    });
  };

  var newTweetBox = function(user, msg, created) {
    return '<div class="tweet">' +
      '<h2><a href="#'+ user +'">@' + user + '</a></h2>' +
      '<p>' + msg + '</p>' +
      '<p>' + created + '</p>' +
      '</div>';
  };

  var getConstantUpdate = function() {
    setInterval(function() {
      var last = +global.lastTweetUpdate + 1,
          total = +streams.home.length,
          delta = total - last;

      if(delta > 0){
        $('#count').text(delta + ' new tweets');
      }
    },1000);
  };

  var getTweets = function() {
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index],
          $tweet = $('<div></div>');

      //$tweet.text('@' + user + ': ' + message + ' -- ' + created);
      $tweets.prepend( newTweetBox(tweet.user, tweet.message, tweet.created_at) );
      //$tweet.prependTo($tweets);
      index -= 1;
    }
    global.lastTweetUpdate = streams.home.length-1;
  }

  init(); // onload

});