document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze-btn");
  const btnText = analyzeBtn.querySelector(".btn-text");
  const btnLoader = analyzeBtn.querySelector(".btn-loader");
  const resultsSection = document.getElementById("results");
  const moodInput = document.getElementById("mood-input");
  const movieLangSelect = document.getElementById("movie-lang-select");

  let currentMovieRawTitle = "";
  let currentMovieAction = "";


  // DOM Elements for Results
  const detectedIcon = document.getElementById("detected-icon");
  const detectedText = document.getElementById("detected-text");
  
  const foodRec = document.getElementById("food-rec");
  const movieRec = document.getElementById("movie-rec");
  const musicRec = document.getElementById("music-rec");
  
  const actionBtns = resultsSection.querySelectorAll(".action-btn");

  const renderMovie = () => {
    if (!currentMovieRawTitle) return;
    const language = movieLangSelect.value;
    
    let finalTitle = currentMovieRawTitle;
    if (currentMovieRawTitle.includes("|")) {
      const options = currentMovieRawTitle.split("|").map(s => s.trim());
      let selectedOption = options.find(o => o.includes(`(${language})`));
      if (!selectedOption) selectedOption = options[0];
      finalTitle = selectedOption.replace(/\s*\([^)]*\)\s*/g, '');
    }
    
    movieRec.textContent = finalTitle;
    actionBtns[1].textContent = currentMovieAction;
    actionBtns[1].onclick = () => window.open(`https://www.google.com/search?q=Watch+${encodeURIComponent(finalTitle)}`, '_blank');
  };

  movieLangSelect.addEventListener("change", renderMovie);

  analyzeBtn.addEventListener("click", async () => {
    const text = moodInput.value.trim();
    if (!text) {
      alert("Please share how you are feeling first!");
      return;
    }

    // UI State: Loading
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
    analyzeBtn.disabled = true;
    resultsSection.classList.add("hidden");

    try {
      // Connect to the backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      
      const moodData = await response.json();

      // Populate UI
      detectedIcon.textContent = moodData.icon;
      detectedText.textContent = moodData.text;
      
      foodRec.textContent = moodData.food.title;
      actionBtns[0].textContent = moodData.food.action;
      actionBtns[0].onclick = () => window.open(`https://www.google.com/search?q=Order+${encodeURIComponent(moodData.food.title)}`, '_blank');

      currentMovieRawTitle = moodData.movie.title;
      currentMovieAction = moodData.movie.action;
      renderMovie();

      musicRec.textContent = moodData.music.title;
      actionBtns[2].textContent = moodData.music.action;
      actionBtns[2].onclick = () => window.open(`https://open.spotify.com/search/${encodeURIComponent(moodData.music.title)}`, '_blank');

      // Show results
      resultsSection.classList.remove("hidden");
      resultsSection.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error('Error fetching mood mapping:', error);
      alert("Failed to analyze mood. Is the backend running?");
    } finally {
      // UI State: Done
      btnText.classList.remove("hidden");
      btnLoader.classList.add("hidden");
      analyzeBtn.disabled = false;
    }
  });
});
