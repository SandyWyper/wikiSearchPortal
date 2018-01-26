
//readies the input field to recieve your wiki queary on button click
$(document).ready(function() {
  const answers = ".want-for-answers";
  const $wantForAnswers = $(answers);
  $wantForAnswers.on("click", askGod);
});

//main program control function
function askGod() {
  let interest = takeSearchString(event);
  let interestFormatted = formatSearchString(interest);
  let apiUrl = makeWikiSearchUrl(interestFormatted);
  getWikiSearchJson(apiUrl);
}

//takes the string from text input
function takeSearchString(event) {
  event.preventDefault();
  let topic = document.getElementById("searchString").value;
  return topic;
}

//formats the search string ready for the .get request
function formatSearchString(topic) {
  let formattedTopic = topic.replace(' ', '%20');
  return formattedTopic;
}

//compiles the formatted search string and the wiki API url
function makeWikiSearchUrl(formattedTopic) {
  let wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=" + formattedTopic + "&utf8=&format=json";
  return wikiUrl;
}

//makes the API get call
function getWikiSearchJson(url) {
  $.getJSON(url, searchResults);
}

//empties previos results if there
//takes each JSON instance and creates HTML mark-up
//according to how many results come back from the API call.
//creates a listener that makes each div a clickable link.
function searchResults(info) {
  $('.searchResults').empty();
  for (x=0 ; x<=25 ; x++) {
    if (info.query.search[x] && info.query.search[x].title) {
      $('.searchResults').append($('<div class="topic"><a id=' + info.query.search[x].pageid +'>' +
    '<b>' + info.query.search[x].title + '</b><br>' +
    info.query.search[x].snippet +
    '......</div>'));
  }
}
$('.topic').on('click', topicExplained);
wikiSuggestion(info);
}

// if there is another possible topic suggested in the returned JSON then
// it is displayed as a clickable div
function wikiSuggestion(info) {
  $('.suggestion').empty();
  if (info.query.searchinfo.suggestionsnippet) {
    $('.suggestion').append($('<div class="correction"><em><b>Did you mean =  ' +
      info.query.searchinfo.suggestionsnippet + '?</b></em></div>'));
  }
    $('.correction').on('click',{
          correction: info.query.searchinfo.suggestion
        }, suggestedSearch);
}


//takes the suggested topic from JSON, reformats it
//makes a new wiki api url and then sends a new api call
function suggestedSearch(event) {
  let correction = event.data.correction;
  let interestFormatted = formatSearchString(correction);
  let apiUrl = makeWikiSearchUrl(interestFormatted);
  getWikiSearchJson(apiUrl);

  // clears the search input-field
  document.getElementById("searchString").value = "";
}

//takes the id from the clicked div, combines it with an href to make
//a new tab open with the selected topic in more detail
function topicExplained() {
  let wikiId = $(this).find("a").attr("id");
  let wikiHref = goToWikiPage(wikiId);
  window.open(wikiHref);
}

//compiles wiki ID with url
function goToWikiPage(id) {
  return "https://en.wikipedia.org/?curid=" + id;
}
