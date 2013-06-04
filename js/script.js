$(document).ready(function(){
  var global = {};
  global.lastTweetUpdate = 0;
  global.totalTweets = 0;
  global.isLoading = 0;
  global.homeStream = streams.home;
  global.currentStream = global.homeStream;
  global.currentStreamName = '';
  global.timer;

  // set photos
  streams.users.shawndrost.photo = 'images/dog.jpg';
  streams.users.sharksforcheap.photo = 'images/cat.jpg';
  streams.users.marcus.photo = 'images/fish.jpg';
  streams.users.douglascalhoun.photo = 'images/turtle.jpg';

  var $tweets = $('#tweets');

  // On load
  var init = function() {
    clearHash();
    $("#count-button").hide();
    $("#load-count").hide();
    tweetLoad(global.currentStream);

    //Events:

    $('#count-button').on('click', function(event){
      event.preventDefault();
      if(global.isLoading === 0) {
        insertNewTweet(this);
      }
    });

    $(".top").on('click', function(e){
      e.preventDefault();
      scrollTop();
    });

    $(window).on('hashchange', function(){
      getHash();
    });

    $("#stop").on('click', function(){
      clearInterval(global.timer);
    });

  };

  var scrollTop = function(){
    $('html, body').animate({scrollTop:0}, 'slow');
  };

  var clearHash = function() {
    var href = location.href,
        hash = location.hash;

    if(hash){
      href = href.split('#');
      location.href = href[0];
    }
  };

  var tweetLoad = function(id) {
    scrollTop();
    clearInterval(global.timer);
    global.lastTweetUpdate = 0;
    global.totalTweets = 0;
    global.isLoading = 0;
    global.currentStream = id;
    $tweets.html('');
    $('#count').html('');
    $('#count-button').hide();
    $('#load-count').hide();
    getTweets(global.currentStream);
    getConstantUpdate(global.currentStream);

    if($('.page').hasClass('slide-left')){
      $('.page').removeClass('slide-left').addClass('slide-right');
    } else {
      $('.page').removeClass('slide-right').addClass('slide-left');
    }
  };

  var getHash = function(){
    var hash = location.hash,
        id = hash.substring(1,hash.length);

    global.currentStreamName = id;

    if(id) {
      $('#title').text('@' + id);
      tweetLoad(streams.users[id]); 
    } else {
      $('#title').text('Twittler');
      tweetLoad(global.homeStream); 
    }       
  };

  var newTweetBox = function(user, msg, created, img) {
    if(global.currentStreamName !== ''){
      var name = '<span class="user">@' + user + '</span>',
          photo = '<img src="' + img + '">';
    } else {
      var name = '<a href="#'+ user +'">@' + user + '</a>',s
          photo = '<a href="#' + user + '"><img src="' + img + '">';
    }
    return $('<div class="tweet">' +
      '<h2>'+ name +'</h2>' +
      '<p>' + msg + '</p>' +
      '<span class="created">' + created + '</span>' +
      '<div class="img">'+ photo +'</div>' +
      '</div>');
  };

  var insertNewTweet = function(that) {
    var $this = $(that),
        stream = global.currentStream,
        lastTweet = global.lastTweetUpdate,
        length = stream.length-1,
        delta = length - lastTweet,
        duration = 100, 
        timer;

    $("#load-count").slideDown("fast"); 

    timer = setInterval(function(){
      global.isLoading = 1;
      $("#load-count").text('Loading Tweets: ' + delta);
      if(lastTweet <= length) {
        stream[lastTweet].photo = streams.users[stream[lastTweet].user].photo;
        $tweets.prepend( newTweetBox( stream[lastTweet].user, stream[lastTweet].message, stream[lastTweet].created_at, stream[lastTweet].photo ) );
        lastTweet++;
      } else {
        clearInterval(timer);
        $("#load-count").slideUp("slow");
        global.isLoading = 0;
      }
      delta = length+1 - lastTweet;
    }, duration);

    global.lastTweetUpdate = stream.length-1;
    $this.hide();
  };

  var getConstantUpdate = function(id) {
    global.timer = setInterval(function() {
      var last = +global.lastTweetUpdate + 1,
          total = +id.length,
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

  var getTweets = function(id) {
    var index = id.length - 1;

    while(index >= 0){
      var tweet = id[index];

      tweet.photo = streams.users[tweet.user].photo;
      $tweets.append( newTweetBox( tweet.user, tweet.message, tweet.created_at, tweet.photo) );
      index -= 1;
    }
    global.lastTweetUpdate = id.length;
  };

  init(); // onload
});

