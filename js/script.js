$(document).ready(function(){
  var global = {};
  global.lastTweetUpdate = 0;
  global.totalTweets = 0;
  global.isLoading = 0;

  streams.users.shawndrost.photo = 'images/dog.jpg';
  streams.users.sharksforcheap.photo = 'images/cat.jpg';
  streams.users.marcus.photo = 'images/fish.jpg';
  streams.users.douglascalhoun.photo = 'images/turtle.jpg';

  var $tweets = $('#tweets');

  var init = function() {
    $("#count-button").hide();
    $("#load-count").hide();
    getTweets();
    getConstantUpdate();

    $('#count-button').on('click', function(event){
      event.preventDefault();
      if(global.isLoading === 0) {
        insertNewTweet(this);
      }
    });

    $(".top").on('click', function(e){
      e.preventDefault();

      $('html, body').animate({scrollTop:0}, 'slow');
    });

  };

  var newTweetBox = function(user, msg, created, img) {
    return $('<div class="tweet">' +
      '<h2><a href="#'+ user +'">@' + user + '</a></h2>' +
      '<p>' + msg + '</p>' +
      '<span class="created">' + created + '</span>' +
      '<div class="img"><a href="#' + user + '"><img src="' + img + '"></a></div>' +
      '</div>');
  };

  var insertNewTweet = function(that) {
      var $this = $(that),
          tweet = streams.home,
          lastTweet = global.lastTweetUpdate,
          length = tweet.length-1,
          delta = length - lastTweet,
          timer;

      $("#load-count").slideDown("fast"); 

      timer = setInterval(function(){
        global.isLoading = 1;
        $("#load-count").text('Loading Tweets: ' + delta);
        if(lastTweet <= length) {
          $tweets.prepend( newTweetBox( tweet[lastTweet].user, tweet[lastTweet].message, tweet[lastTweet].created_at, streams.users[tweet[lastTweet].user].photo) );
          lastTweet++
        } else {
          clearInterval(timer);
          $("#load-count").slideUp("slow");
          global.isLoading = 0;
        }
        delta = length+1 - lastTweet;
        console.log(delta);
      }, 100);

      global.lastTweetUpdate = streams.home.length-1;
      $this.hide();
  };

  var getConstantUpdate = function() {
    setInterval(function() {
      var last = +global.lastTweetUpdate + 1,
          total = +streams.home.length,
          delta = total - last,
          text;

      if(delta === 1){
        text = 'new tweet';
      } else {
        text = 'new tweets';
      }

      if(delta > 0 && global.isLoading === 0){
        $('#count-button').slideDown("slow").text(delta + ' ' + text);
      }
    }, 400);
  };

  var getTweets = function() {
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];

      $tweets.append( newTweetBox( tweet.user, tweet.message, tweet.created_at, streams.users[tweet.user].photo) );
      index -= 1;
    }
    global.lastTweetUpdate = streams.home.length;
  };

  init(); // onload

});