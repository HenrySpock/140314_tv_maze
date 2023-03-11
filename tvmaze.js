"use strict";

const $showsList = $("#shows-list"); 
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows(query, limit = 100) {
  const pageSize = Math.min(limit, 250);
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}&page=1&pageSize=${pageSize}`);
  const shows = response.data.map(result => result.show);
  return shows.map(({ id, name, summary, image }) => ({
    id,
    name,
    summary,
    image: image?.medium || "https://tinyurl.com/tv-missing"
  }));
}

async function getShowsByTerm(term, numResults = 100) {
  const shows = await searchShows(term, numResults);
  return shows;
}

/** Given list of shows, create markup for each and add to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(`
      <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
        <div class="media">
          <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
          <div class="media-body">
            <h5 class="text-primary">${show.name}</h5>
            <div><small>${show.summary}</small></div>
            <button class="btn btn-primary btn-sm Show-getEpisodes">
              Episodes
            </button>
            <button class="btn btn-primary btn-sm Show-getCast">
              Cast
            </button>
            <button class="btn btn-primary btn-sm Show-getCrew">
              Crew
            </button>
          </div>
        </div>
      </div>
    `);

    $showsList.append($show);
  } 
 

}


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(showId) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  return response.data.map(({ id, name, season, number }) => ({
    id,
    name,
    season: season.toString(),
    number: number.toString(),
  }));
}

/** Given a show ID, get from API and return (promise) array of cast members:
 *      { id, name }
 */

async function getCastOfShow(showId) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${showId}/cast`);
  let res = response.data;
  console.log(res);
  return response.data.map(({ person }) => ({ 
    id: person.id,
    name: person.name 
  }));
}

/** Given a show ID, get from API and return (promise) array of crew members:
 *      { id, name }
 */

async function getCrewOfShow(showId) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${showId}/crew`);
  return response.data.map(({ person }) => ({
    id: person.id,
    name: person.name
  }));
}

/** Given an array of episodes info, populate that into the #episodes-list part of the DOM */

// function populateEpisodes(episodes) {
//   const $episodesList = $("#episodes-list");
//   $episodesList.empty();

//   for (let episode of episodes) {
//     const $episode = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
//     $episodesList.append($episode);
//   }
 
// }

function populateEpisodes(episodes) {
  const $modal = $('<div class="modal fade" tabindex="-1" role="dialog">');
  const $modalDialog = $('<div class="modal-dialog" role="document">');
  const $modalContent = $('<div class="modal-content">');
  const $modalHeader = $('<div class="modal-header">');
  const $modalTitle = $('<h5 class="modal-title">').text('Episodes');
  const $closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">');
  const $closeIcon = $('<span aria-hidden="true">&times;</span>');
  const $modalBody = $('<div class="modal-body">');
  const $episodeList = $('<ul>');

  $modalHeader.append($modalTitle, $closeButton.append($closeIcon));
  $modalContent.append($modalHeader, $modalBody.append($episodeList));
  $modalDialog.append($modalContent);
  $modal.append($modalDialog);

  for (let episode of episodes) {
    const $episode = $('<li>').text(`${episode.name} (season ${episode.season}, number ${episode.number})`);
    $episodeList.append($episode);
  }

  $('body').append($modal);
  $modal.modal('show');

  $modal.on('hidden.bs.modal', function () {
    $(this).remove();
  });
}

function populateCast(cast) {
  const $modal = $('<div class="modal fade" tabindex="-1" role="dialog">');
  const $modalDialog = $('<div class="modal-dialog" role="document">');
  const $modalContent = $('<div class="modal-content">');
  const $modalHeader = $('<div class="modal-header">');
  const $modalTitle = $('<h5 class="modal-title">').text('Cast');
  const $closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">');
  const $closeIcon = $('<span aria-hidden="true">&times;</span>');
  const $modalBody = $('<div class="modal-body">');
  const $castList = $('<ul>');

  $modalHeader.append($modalTitle, $closeButton.append($closeIcon));
  $modalContent.append($modalHeader, $modalBody.append($castList));
  $modalDialog.append($modalContent);
  $modal.append($modalDialog);

  for (let person of cast) {
    const $person = $('<li>').text(person.name);
    $castList.append($person); 
  }

  $('body').append($modal);
  $modal.modal('show');

  $modal.on('hidden.bs.modal', function () {
    $(this).remove();
  });
}

function populateCrew(crew) {
  const $modal = $('<div class="modal fade" tabindex="-1" role="dialog">');
  const $modalDialog = $('<div class="modal-dialog" role="document">');
  const $modalContent = $('<div class="modal-content">');
  const $modalHeader = $('<div class="modal-header">');
  const $modalTitle = $('<h5 class="modal-title">').text('Crew');
  const $closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">');
  const $closeIcon = $('<span aria-hidden="true">&times;</span>');
  const $modalBody = $('<div class="modal-body">');
  const $crewList = $('<ul>');

  $modalHeader.append($modalTitle, $closeButton.append($closeIcon));
  $modalContent.append($modalHeader, $modalBody.append($crewList));
  $modalDialog.append($modalContent);
  $modal.append($modalDialog);

  for (let member of crew) {
    const $crewMember = $('<li>').text(`${member.name}`);
    $crewList.append($crewMember);
  }

  $('body').append($modal);
  $modal.modal('show');

  $modal.on('hidden.bs.modal', function () {
    $(this).remove();
  });
}


/** Handle search form submission: get shows from API and display. 
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const numResults = parseInt($("#num-returns").val()) || 100;
  const shows = await getShowsByTerm(term, numResults);
 
  populateShows(shows);


}

  // add click handler to get episodes for a show when "Episodes" button is clicked
  $showsList.on("click", ".Show-getEpisodes", async function () {
    const showId = $(this).closest(".Show").data("show-id");
    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
  });
  
  // add click handler to get cast for a show when "Cast" button is clicked
  $showsList.on("click", ".Show-getCast", async function () {
    const showId = $(this).closest(".Show").data("show-id");
    const cast = await getCastOfShow(showId);
    populateCast(cast);
  });

  // add click handler to get crew for a show when "Crew" button is clicked
  $showsList.on("click", ".Show-getCrew", async function () {
    const showId = $(this).closest(".Show").data("show-id");
    const crew = await getCrewOfShow(showId);
    populateCrew(crew);
  });

async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = response.data.map(({ id, name, season, number }) => ({ id, name, season, number }));
  return episodes;
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
