const OMDB_API_KEY = "9c298128";
const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzMxNTBlMzkzMWI5ZTJmNTc2ZWQ3NjNhZjg5YjFiNiIsInN1YiI6IjY2MTU0ZDU4MDQ4NjM4MDE3YzFjNGQ2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G70lSLnsxqaS4GgkMsfaT9BQQKTPsmja565xuxUg1P4";
async function searchMovie() {
  const movieTitle = document.getElementById("searchInput").value.trim();
  if (!movieTitle) {
    document.getElementById("results").innerHTML = "Please enter a movie title.";
    return;
  }

  try {
    document.getElementById("results").innerHTML = "Searching...";
    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`
    );
    const omdbData = await omdbResponse.json();

    if (omdbData.Search && omdbData.Search.length > 0) {
      displayPosters(omdbData.Search);
    } else {
      document.getElementById("results").innerHTML = "No results found.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("results").innerHTML =
      "An error occurred while searching for the movie.";
  }
}
function displayPosters(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = movies
    .map(
      (movie) => `
            <div class="movie-poster" onclick="loadMovie('${movie.Title}')">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}" alt="${movie.Title}" />
                <p>${movie.Title} (${movie.Year})</p>
            </div>
            `
    )
    .join("");
}
async function loadMovie(movieTitle) {
  try {
    document.getElementById("results").innerHTML = "Loading video...";
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const tmdbData = await tmdbResponse.json();

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movieId = tmdbData.results[0].id;
      const embedUrl = `https://vidsrc.icu/embedv2/movie/${movieId}`;
      displayVideo(embedUrl);
    } else {
      document.getElementById("results").innerHTML = "No video found for this movie.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("results").innerHTML =
      "An error occurred while loading the video.";
  }
}
function displayVideo(embedUrl) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
        <div class="iframe-container">
            <iframe src="${embedUrl}" allowfullscreen></iframe>
        </div>
    `;
}
document.getElementById("searchInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});
