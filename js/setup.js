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

var makeMessage = function(userName, messageText, roomName) {
  var message = {};
  message.userName = userName;
  message.messageText = messageText.toString();
  message.roomName = roomName;
  return message.toString();
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
