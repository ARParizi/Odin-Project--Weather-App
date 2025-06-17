// Get DOM elements
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const fahrenheitOption = document.getElementById('fahrenheit');
const celsiusOption = document.getElementById('celsius');

let currentUnit = 'metric'; // Default to Celsius

// Function to handle the search
async function handleSearch() {
    const city = searchInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${currentUnit}&key=VDSQK2MW4GBBNU4X8N8SKREH&contentType=json`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        console.log('Weather data:', data);
        // TODO: Display the weather data in the UI
        
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Function to handle unit toggle
function handleUnitToggle(unit) {
    // Update active state
    if (unit === 'metric') {
        celsiusOption.classList.add('active');
        fahrenheitOption.classList.remove('active');
    } else {
        fahrenheitOption.classList.add('active');
        celsiusOption.classList.remove('active');
    }

    // Update current unit
    currentUnit = unit;
    
    // If we have a city searched, refresh the weather data
    if (searchInput.value.trim()) {
        handleSearch();
    }
}

// Add event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Add click listeners for unit options
fahrenheitOption.addEventListener('click', () => handleUnitToggle('us'));
celsiusOption.addEventListener('click', () => handleUnitToggle('metric'));