document.addEventListener("DOMContentLoaded", () => {
    const countryList = document.getElementById("country-list");
    const countryModal = document.getElementById("country-modal");
    const countryDetails = document.getElementById("country-details");
    const seeMoreButton = document.getElementById("see-more-button");
    const favoritesCountElement = document.getElementById("favorites-count");
    const suggestions = document.getElementById("suggestions");
    const countrySearch = document.getElementById("country-search");

    let countriesData = [];
    let favorites = [];
    let visibleCountries = 15;

    // Fetch country data
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            displayCountries(countriesData.slice(0, visibleCountries));
        })
        .catch(error => console.error("Error fetching data:", error));

    // Display countries
    function displayCountries(countries) {
        countryList.innerHTML = "";
        countries.forEach(country => {
            const countryCard = document.createElement("div");
            countryCard.classList.add("country-card");

            countryCard.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common} Flag" onclick="showCountryDetails('${country.name.common}')">
                <h3>${country.name.common}</h3>
                <span class="heart-icon ${favorites.includes(country.name.common) ? 'red' : ''}" onclick="toggleFavorite('${country.name.common}', this)">&#9829;</span>
            `;
            countryList.appendChild(countryCard);
        });

        seeMoreButton.style.display = visibleCountries < countriesData.length ? "block" : "none";
    }

    // Load more countries
    window.loadMoreCountries = function() {
        visibleCountries += 15;
        displayCountries(countriesData.slice(0, visibleCountries));
    };

    // Show country details in modal
    window.showCountryDetails = function(countryName) {
        const country = countriesData.find(c => c.name.common === countryName);
        countryDetails.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common} Flag" class="modal-flag">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
        `;
        countryModal.style.display = "block";
    };

    // Close modal
    window.closeModal = function() {
        countryModal.style.display = "none";
    };

    // Toggle favorite country
    window.toggleFavorite = function(countryName, heartIcon) {
        const isFavorited = favorites.includes(countryName);

        if (isFavorited) {
            favorites = favorites.filter(name => name !== countryName);
            heartIcon.classList.remove("red");
        } else {
            if (favorites.length < 5) {
                favorites.push(countryName);
                heartIcon.classList.add("red");
                updateFavoritesCount();
            } else {
                alert("You can only add up to 5 favorite countries!");
            }
        }
    };

    // Update favorites count
    function updateFavoritesCount() {
        favoritesCountElement.innerText = favorites.length;
    }

    // Show favorite countries
    window.showFavorites = function() {
        const favoriteCountries = countriesData.filter(country => favorites.includes(country.name.common));
        displayCountries(favoriteCountries);
    };

    // Filter countries based on input
    window.filterCountries = function() {
        const countryInput = document.getElementById("country-search").value.toLowerCase();
        const languageInput = document.getElementById("language-search").value.toLowerCase();
        const regionInput = document.getElementById("region-search").value.toLowerCase();

        const filteredCountries = countriesData.filter(country => {
            const matchesCountry = country.name.common.toLowerCase().includes(countryInput);
            const matchesLanguage = country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(languageInput));
            const matchesRegion = country.region.toLowerCase().includes(regionInput);

            return matchesCountry && matchesLanguage && matchesRegion;
        });

        displayCountries(filteredCountries);
    };

    // Show suggestions when input is focused
    window.showSuggestions = function () {
        suggestions.style.display = "block";
        displaySuggestions(countriesData.map(c => c.name.common));
    };

    // Filter suggestions based on input
    window.filterSuggestions = function () {
        const searchValue = countrySearch.value.toLowerCase();
        const filteredCountries = countriesData
            .map(c => c.name.common)
            .filter(country => country.toLowerCase().includes(searchValue));
        displaySuggestions(filteredCountries);
    };

    // Display suggestions in the dropdown, limited to five names
    function displaySuggestions(list) {
        suggestions.innerHTML = ""; // Clear previous suggestions

        list.slice(0, 4).forEach(country => { // Limit to 5 suggestions
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = country;

            // When a suggestion is clicked, set it as the input value
            suggestionItem.addEventListener("click", () => {
                countrySearch.value = country;
                suggestions.style.display = "none"; // Hide suggestions after selection
                filterCountries(); // Trigger filtering based on selected suggestion
            });

            suggestions.appendChild(suggestionItem);
        });
    }

    // Hide suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!countrySearch.contains(event.target) && !suggestions.contains(event.target)) {
            suggestions.style.display = "none";
        }
    });
});
