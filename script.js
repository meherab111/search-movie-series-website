let body = document.body;

let sectionHero = document.querySelector(".section-hero");

let sectionHeroMovies = document.querySelector(".section-hero--movies");

let sectionHeroMovie = document.querySelector(".section-hero--movie");

let inputFieldForm = document.getElementById("input-field--form");

let inputMovieName = document.getElementById("input-field--movie");

let multiMovieContainer = document.querySelector(
  ".section-multimovie .container"
);

let posterCount = 1;

let movieName;

// Poster Dynamic Rotation Functionality

setInterval(() => {
  body.style.transition = "all 2s ease-in-out";

  body.style.backgroundImage = `url(images/poster-${posterCount}.jpg)`;

  posterCount++;

  if (posterCount === 5) {
    posterCount = 1;
  }
}, 3000);

// User Input Functionality

inputFieldForm.addEventListener("submit", (event) => {
  event.preventDefault();

  movieName = inputMovieName.value;

  if (movieName !== "") {
    sectionHeroMovies.innerHTML = "";
    sectionHeroMovie.innerHTML = "";

    multiMovieContainer.style.padding = "6rem 3rem 10rem 3rem";

    multiMovieInfoFunc();
  }
});

// Multiple Movie Click Functionality

sectionHeroMovies.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    event.preventDefault();

    let targetAnchorTag = event.target.closest("a");

    let movieNameFound = targetAnchorTag
      .querySelector(".movies-heading--name")
      .childNodes[2].textContent.trim();

    let movieYearFound = targetAnchorTag
      .querySelector(".movies-heading--year")
      .childNodes[2].textContent.trim();

    singleMovieInfoFunc(movieNameFound, movieYearFound);
  }
});

// Single Movie Info Functionality

const singleMovieInfoFunc = async (name, year) => {
  window.scrollTo(0, 0);

  const fetchApiSingleMovie = `https://www.omdbapi.com/?t=${name}&y=${year}&apikey=2611174b`;

  try {
    let resultSingleMovie = await fetch(fetchApiSingleMovie);

    let fetchedSingleMovieData = await resultSingleMovie.json();

    const {
      Title,
      Released,
      Runtime,
      Genre,
      Director,
      Writer,
      Actors,
      Plot,
      Poster,
      imdbRating,
    } = fetchedSingleMovieData;

    multiMovieContainer.style.padding = "0rem";

    sectionHeroMovies.innerHTML = "";

    sectionHeroMovie.innerHTML = `
      <div class="movies-info--div flex-box">
        <div class="movies-image--div">
          <img
            src="${Poster}"
            alt="Movie Image" onerror="this.onerror=null;this.src='images/no-image-available-icon-.jpg';"
          />
        </div>
        <div>
          <h2 class="movies-heading--name">
            <span>Title:</span> ${Title}
          </h2>
          <h2 class="movies-heading--year"><span>Released:</span> ${Released}</h2>
          <h2 class="movies-heading"><span>Runtime:</span> ${Runtime}</h2>
          <h2 class="movies-heading">
            <span>Genre:</span> ${Genre}
          </h2>
          <h2 class="movies-heading"><span>Director:</span> ${Director}</h2>
          <h2 class="movies-heading">
            <span>Writer:</span> ${Writer}
          </h2>
          <h2 class="movies-heading">
            <span>Actors:</span> ${Actors}
          </h2>
          <h2 class="movies-heading">
            <span>Plot:</span> ${Plot}
          </h2>
          <h2 class="movies-heading"><span>Imdb rating:</span> ${imdbRating}/10</h2>

        </div>
      </div>
      <button id="go-back--btn">Go Back</button>
    `;
    let goBackButton = document.getElementById("go-back--btn");

    // Go back Functionality

    goBackButton.addEventListener("click", () => {
      sectionHeroMovie.innerHTML = "";

      multiMovieContainer.style.padding = "6rem 3rem 10rem 3rem";

      multiMovieInfoFunc();
    });
  } catch (error) {
    sectionHero.innerHTML = `<div class="section-hero--contents container">
        <div class="section-hero--texts flex-box flex-box--col">
          <h1 class="section-hero-heading">Welcome to Cine Query</h1>
          <h2 class="section-hero-subheading">
            Where you can search and get info about specific movie.
          </h2>
        </div>
      </div>`;
    alert("Ops! Data Fetch Failed");
  }
};

// Multiple Movie Info Functionality

const multiMovieInfoFunc = async () => {
  window.scrollTo(0, 0);

  const fetchApiMultiMovie = `https://www.omdbapi.com/?s=${movieName}&apikey=2611174b`;

  try {
    let resultMultiMovie = await fetch(fetchApiMultiMovie);

    let fetchedMultiMovieData = await resultMultiMovie.json();

    const { Search, Title, Year, Poster, Type } = fetchedMultiMovieData;

    sectionHero.innerHTML = "";

    Search.forEach((elem) => {
      sectionHeroMovies.innerHTML += `<a class="section-hero--anchor">
            <div class="flex-box flex-box--col">
              <div class="movies-image--div">
                <img
                  src="${elem.Poster}"
                  alt="Movie Image" onerror="this.onerror=null;this.src='images/no-image-available-icon-.jpg';"
                />
              </div>
              <div class="movies-info--div">
                <h2 class="movies-heading--name">
                  <span>Movie Name:</span> ${elem.Title}
                </h2>
                <h2 class="movies-heading--year">
                <span>Release Year:</span> ${elem.Year}
                </h2>
                <h2 class="movies-heading"><span>Type:</span> ${elem.Type}</h2>
              </div>
            </div>
          </a>`;
    });
  } catch (error) {
    sectionHero.innerHTML = `<div class="section-hero--contents container">
          <div class="section-hero--texts flex-box flex-box--col">
            <h1 class="section-hero-heading">Welcome to Cine Query</h1>
            <h2 class="section-hero-subheading">
              Where you can search and get info about specific movie.
            </h2>
          </div>
        </div>`;
    alert("Ops! Wrong input");
    inputMovieName.value = "";
  }
};
