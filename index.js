// Get the search forms and results elements
const mainSearchBar = document.getElementById("main-search-bar");
const topBarSearchBar = document.getElementById("top-bar-search-bar");
const searchResults = document.getElementById("search-results");

// Function to fetch JSON data
async function loadSearchData() {
  try {
    const response = await fetch("pages.json");
    if (!response.ok) throw new Error("Failed to load search data");
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
    return [];
  }
}

// Function to get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

// Function to display content based on the query
async function displayContent() {
  const query = getQueryParam("q");
  console.log("Current Query:", query); // Debug: Check query value

  // Show or hide search bars based on the presence of the query
  mainSearchBar.style.display = query ? "none" : "block";
  topBarSearchBar.style.display = query ? "block" : "none";

  if (!query) {
    searchResults.innerHTML = ""; // Clear search results
    return;
  }

  try {
    const pages = await loadSearchData();
    console.log("Loaded Pages:", pages); // Debug: Check fetched data

    // FIXED: Use exact matching instead of includes()
    const matchingPage = pages.find(page => 
      page.title.toLowerCase() === query.toLowerCase()
    );

    if (matchingPage) {
      // Replace newline characters with <br> tags
      const formattedDescription = matchingPage.description.replace(/\n/g, "<br>");
      searchResults.innerHTML = `
        <h2>${matchingPage.title}</h2>
        <p>${formattedDescription}</p>
      `;
    } else {
      searchResults.innerHTML = `<p>No results found for "${query}"</p>`;
    }
  } catch (error) {
    console.error("Search error:", error);
    searchResults.innerHTML = `<p>Error loading results. Check console for details.</p>`;
  }
}

// Handle form submissions for both search bars
const searchForms = document.querySelectorAll(".search-form");
searchForms.forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector(".search-input");
    const query = input.value.trim();
    if (query) {
      // Update URL with query parameter
      window.location.search = `?q=${encodeURIComponent(query)}`;
    }
  });
});

// Display content on page load based on URL query
document.addEventListener("DOMContentLoaded", displayContent);

// easter egg :D
document.addEventListener("DOMContentLoaded", () => {
  const homeButton = document.querySelector("a.logo-title");
  const audio = document.getElementById("easter-egg-audio");

  homeButton.addEventListener("click", (event) => {
    const chance = 0.026; // 2.6% chance 10 times the chance of getting a gold in cs. 0.26% or 1 in 384

    if (!audio.paused) {
      // Audio is already playing, prevent navigation to keep playing
      event.preventDefault();
      return;
    }

    if (Math.random() < chance) {
      // Audio not playing, play it and prevent navigation
      event.preventDefault();
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn("Audio play failed:", err);
      });
    }
    // else: allow normal navigation (page reload)
  });
});
