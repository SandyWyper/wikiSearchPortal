
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
  console.log(wikiUrl);
  return wikiUrl;
}

//makes the API get call
function getWikiSearchJson(url) {
  $.getJSON(url, searchResults);
}

//takes the JSON data and sends HTML fields
function searchResults(info) {
  console.log(info);
  for (x = 0; x <= 25; x++) {
    if (info.query.search[x] && info.query.search[x].title) {
      $("#snippet" + x).html("<b>" + info.query.search[x].title + "</b><br>" + info.query.search[0].snippet + " ...");
//unbinds the liostener in case this fiel had previously
//been filled by another search.
      $(".amen" + x).unbind("click");
      $(".amen" + x).on("click", {
        wikiId: info.query.search[x].pageid
      }, topicExplained);
    } else {
      $("#snippet" + x).html('');
    }
  }
//if there is another possible topic suggested then
// it is displayed as a clickable button
  if (info.query.searchinfo.suggestionsnippet) {
    $("#suggestion").html("Or did you actually mean : <button class='correction'>" + info.query.searchinfo.suggestionsnippet + "</button>");
    $(".correction").on("click", {
      correction: info.query.searchinfo.suggestion
    }, suggestedSearch);
  } else {
    $("#suggestion").html('');
  }
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

// takes the unique ID for selected topic and links to that page in a new tab
function topicExplained(event) {
  let wikiId = event.data.wikiId;
  let wikiHref = goToWikiPage(wikiId);
  window.open(wikiHref);
}
//compiles wiki ID with url 
function goToWikiPage(id) {
  return "https://en.wikipedia.org/?curid=" + id;
}
