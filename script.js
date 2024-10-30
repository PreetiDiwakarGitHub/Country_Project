document.addEventListener("DOMContentLoaded", () => {
    const countryList = document.getElementById("country-list");
    const countryModal = document.getElementById("country-modal");
    const countryDetails = document.getElementById("country-details");
    const seeMoreButton = document.getElementById("see-more-button");
    let countriesData = [];
    let favorites = [];
    let visibleCountries = 15; // Number of countries to show initially

    // Fetch country data
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            displayCountries(countriesData.slice(0, visibleCountries)); // Display only the first 15 countries
        })
        .catch(error => console.error("Error fetching data:", error));

    // Display countries
    function displayCountries(countries) {
        countryList.innerHTML = ""; // Clear previous results
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

        // Show/hide the "See More" button
        seeMoreButton.style.display = visibleCountries < countriesData.length ? "block" : "none";
    }

    // Load more countries
    window.loadMoreCountries = function() {
        visibleCountries += 15; // Increment the count
        displayCountries(countriesData.slice(0, visibleCountries)); // Show updated list of countries
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

    // Toggle favorite
    window.toggleFavorite = function(countryName, heartIcon) {
        const isFavorited = favorites.includes(countryName);

        if (isFavorited) {
            favorites = favorites.filter(name => name !== countryName);
            heartIcon.classList.remove("red");
        } else {
            favorites.push(countryName);
            heartIcon.classList.add("red");
        }
    };

    // Show all countries
    window.showAllCountries = function() {
        visibleCountries = 15; // Reset to initial count
        displayCountries(countriesData.slice(0, visibleCountries));
    };

    // Show favorites list
    window.showFavorites = function() {
        const favoriteCountries = countriesData.filter(country => favorites.includes(country.name.common));
        countryList.innerHTML = ""; // Clear the previous list

        favoriteCountries.forEach(country => {
            const countryCard = document.createElement("div");
            countryCard.classList.add("country-card", "favorite-country-card");

            countryCard.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common} Flag">
                <h3>${country.name.common}</h3>
                <button class="remove-button" onclick="removeFromFavorites('${country.name.common}')">Remove</button>
            `;
            countryList.appendChild(countryCard);
        });
    };

    // Remove from favorites
    window.removeFromFavorites = function(countryName) {
        favorites = favorites.filter(name => name !== countryName);
        showFavorites(); // Refresh the favorites list
    };

    // Filter countries based on search input
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
});
