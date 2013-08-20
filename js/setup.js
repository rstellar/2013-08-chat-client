window.userName = window.location.search.split('=')[1];
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


$(document).ready(function() {

  $('.button').on('click',function(){
    var message = $('.draft').val();
    var newMessage = makeMessage(window.userName, message);
    console.log('{"userName":'+ newMessage.userName +
          ',"messageText":'+newMessage.messageText+'}');
    $.ajax({
      type: "POST",
      url: "https://api.parse.com/1/classes/messages",
      data: JSON.stringify(newMessage),
      success: function(payload){
        // console.log(payload);
      }

    });
  });


  var makeMessage = function(userName, messageText) {
    var message = {};
    message.userName = userName;
    message.messageText = messageText.toString();
    return message;
  };

  var lastDate = new Date();
  lastDate.setHours(lastDate.getHours()-1);
  lastDate = lastDate.toISOString();




  var serverQuery = function() {
    $.ajax({
      type: 'GET',
      url: 'https://api.parse.com/1/classes/messages?order=-createdAt',
      success: function(data) {
        lastDate2 = lastDate;
        _.each(data.results, function(item){
          if (item.createdAt > lastDate){
            var message = $('<div>').text(item.username + ": " + item.text + " at " + item.createdAt);
            $('#chats').prepend(message);
          }
          lastDate2 = lastDate2 > item.createdAt ? lastDate2 : item.createdAt;
        });
        lastDate = lastDate2;
      }
    });
  };

  setInterval(serverQuery, 1000);
});
