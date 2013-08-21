
if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}


// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

var userName = window.location.search.split('=')[1];
var myFriends = {};



$(document).ready(function() {

  $('.button').on('click',function(){
    var messageToSend = $('.draft').val();

    var newMessage = makeMessage(userName, messageToSend);


    $.ajax({
      type: "POST",
      url: "https://api.parse.com/1/classes/messages",
      contentType: 'application/json',
      data: JSON.stringify(newMessage),

      success: function(results){
        console.log("success");
      },

      error: function(error){
        alert(error.code);
      }
    });
  });


  var makeMessage = function(userName, messageText) {
    var message = {};
    message.username = userName;
    message.text = messageText.toString();
    return message;
  };

  var lastDate = new Date();
  lastDate.setHours(lastDate.getHours()-1);
  lastDate = lastDate.toISOString();

//jQuery expression that on click of a user name stores it to an object.
$('#chats')
  .delegate('.status','click',function(){
    if( myFriends[ $(this).attr('id') ] ){
      delete myFriends[$(this).attr('id')]; 
    } else {
      myFriends[$(this).attr('id')] = true;
    }
  console.log(myFriends); 
});




  var fetch = function() {
    $.ajax({
      type: 'GET',
      url: 'https://api.parse.com/1/classes/messages?order=-createdAt',
      success: function(data) {
        lastDate2 = lastDate;
        _.each(data.results.reverse(), function(item){
          if (item.createdAt > lastDate){
            var message = $('<div id=' + item.username + '>')
                .addClass('status')
                .text(item.username + ": " + item.text + " at " + item.createdAt);
            $('#chats').prepend(message);
          }

          if(myFriends[item.username]){
            $('#' + item.username).addClass("friend");
          }

          lastDate2 = lastDate2 > item.createdAt ? lastDate2 : item.createdAt;
        });
        lastDate = lastDate2;
      }
    });
  };

  setInterval(fetch, 1000);
});
