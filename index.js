"use strict";

const apiKey = "tswVcFZkuSmJBiHlRj8NUaRtVk1N57mDvfmPG6Ga";
const searchURL = "https://api.nps.gov/api/v1/parks";

function formatQueryString(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results-list").append(
      `<li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p><a href=${responseJson.data[i].url} target="_blank">Visit Website</a></p>
        <p>${responseJson.data[i].description}</p>
      </li>`
    );
  }
  $("#results").removeClass("hidden");
}

function getParks(query, limit) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit,
  };
  const queryString = formatQueryString(params);
  const url = searchURL + "?" + queryString;
  console.log(url);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchState = $("#js-search").val();
    const maxResults = $("#js-max-results").val();
    getParks(searchState, maxResults);
  });
}

$(watchForm);
