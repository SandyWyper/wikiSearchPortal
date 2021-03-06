$(document).ready(function() {
  const answers = ".want-for-answers";
  const $wantForAnswers = $(answers);
  $wantForAnswers.on("click", askGod);
});

function askGod() {
  let interest = takeSearchString(event);
  let interestFormatted = formatSearchString(interest);
  let apiUrl = makeWikiSearchUrl(interestFormatted);
  getWikiSearchJson(apiUrl);
}

function takeSearchString(event) {
  event.preventDefault();
  let topic = document.getElementById("searchString").value;
  return topic;
}

function formatSearchString(topic) {
  let formattedTopic = topic.replace(' ', '%20');
  return formattedTopic;
}

function makeWikiSearchUrl(formattedTopic) {
  let wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=" + formattedTopic + "&utf8=&format=json";
  console.log(wikiUrl);
  return wikiUrl;
}

function getWikiSearchJson(url) {
  $.getJSON(url, searchResults);
}


function searchResults(info) {
  for (x = 0; x <= 5; x++) {
    if (info.query.search[x] && info.query.search[x].title) {
      $("#snippet" + x).html("<b>" + info.query.search[x].title + "</b><br>" + info.query.search[0].snippet + " ...");
      $(".amen" + x).unbind("click");
      $(".amen" + x).on("click", {
        wikiId: info.query.search[x].pageid
      }, topicExplained);
    } else {
      $("#snippet" + x).html('');
    }
  }
  if (info.query.searchinfo.suggestionsnippet) {
    $("#suggestion").html("Or did you actually mean : <button class='correction'>" + info.query.searchinfo.suggestionsnippet + "</button>");
    $(".correction").on("click", {
      correction: info.query.searchinfo.suggestion
    }, suggestedSearch);
  } else {
    $("#suggestion").html('');
  }
}

function suggestedSearch(event) {
  let correction = event.data.correction;
  let interestFormatted = formatSearchString(correction);
  let apiUrl = makeWikiSearchUrl(interestFormatted);
  getWikiSearchJson(apiUrl);

  // clears the search input-field
  document.getElementById("searchString").value = "";
}


function topicExplained(event) {
  let wikiId = event.data.wikiId;
  let wikiHref = goToWikiPage(wikiId);
  window.open(wikiHref);
}

function goToWikiPage(id) {
  return "https://en.wikipedia.org/?curid=" + id;
}