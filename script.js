// Get DOM elements
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const fahrenheitOption = document.getElementById('fahrenheit');
const celsiusOption = document.getElementById('celsius');

let currentUnit = 'metric'; // Default to Celsius
let currentUnitString = '°C';
let currentUnitDistance = 'km';


//window.setInterval(handleSearch, 15 * 60 * 1000);
// Function to handle the search
async function handleSearch() {
    const city = searchInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${currentUnit}&key=3AWSCAXB72MWJZ7T3YBJFDL9T&contentType=json`);
        
        if (!response.ok) {
            if (response.status === 429) {
                const reader = response.body.getReader();
                const { done, value } = await reader.read();
                if (!done) {
                    console.log('Response body:', new TextDecoder().decode(value));
                }
                throw new Error('Error 429');
            }
            throw new Error('City not found');
        }

        const data = await response.json();
        console.log('Weather data:', data);

        const weatherIcon = document.querySelector('.weather-icon img');
        weatherIcon.src = `icons/${data.currentConditions.icon}.svg`;

        const cityName = document.querySelector('.city-name');
        cityName.textContent = data.resolvedAddress;

        const temperature = document.querySelector('.temperature');
        temperature.textContent = `${data.currentConditions.temp}${currentUnitString}`;

        const rainChance = document.querySelector('.rain-chance');
        rainChance.textContent = `Chance of Rain: ${data.currentConditions.precipprob}%`;
        
        const uvIndex = document.querySelector('#uv-card p');
        uvIndex.textContent = data.currentConditions.uvindex;

        const humidity = document.querySelector('#humidity-card p');
        humidity.textContent = `${data.currentConditions.humidity}%`;

        const visibility = document.querySelector('#visibility-card p');
        visibility.textContent = `${data.currentConditions.visibility}${currentUnitDistance}`;

        const feelsLike = document.querySelector('#feel-card p');
        feelsLike.textContent = `${data.currentConditions.feelslike}${currentUnitString}`;

        const sunrise = document.querySelector('#sunrise-card p');
        sunrise.textContent = data.currentConditions.sunrise;

        const sunset = document.querySelector('#sunset-card p');
        sunset.textContent = data.currentConditions.sunset;

        // Populate 24-hour weather overview
        const weatherOverviewContainer = document.querySelector('.weather-overview-cards-container');
        weatherOverviewContainer.innerHTML = '';
        
        for (let i = 0; i < data.days[0].hours.length; i++) {
            const hour = data.days[0].hours[i];
            
            // Only generate card if this hour is in the future
            if (hour.datetimeEpoch <= data.currentConditions.datetimeEpoch) {
                continue;
            }
            
            // Create card div
            const cardDiv = document.createElement('div');
            cardDiv.className = 'weather-overview-card';
            
            // Extract time am/pm
            let time;
            let hour24 = parseInt(hour.datetime.split(':')[0]);
            let ampm = hour24 >= 12 ? 'PM' : 'AM';
            let hour12 = hour24 % 12;
            if (hour12 === 0) hour12 = 12;
            time = `${hour12}${ampm}`;
            
            // Create card content
            cardDiv.innerHTML = `
                <div class="time">${time}</div>
                <div class="icon">
                    <img src="icons/${hour.icon}.svg" alt="${hour.icon}">
                </div>
                <div class="temperature">${hour.temp}${currentUnitString}</div>
            `;
            
            weatherOverviewContainer.appendChild(cardDiv);
        }

        // Populate 5-day forecast
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = ''; // Clear existing content
        
        for (let i = 1; i <= 5; i++) {
            const day = data.days[i];
            
            // Create forecast card div
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            // Get day name (tomorrow, day after tomorrow, etc.)
            const dayNames = ['Tomorrow', '2 days from now', '3 days from now', '4 days from now', '5 days from now'];
            const dayName = dayNames[i - 1];
            
            // Create card content
            forecastCard.innerHTML = `
                <div class="day">${dayName}</div>
                <div class="icon">
                    <img src="icons/${day.icon}.svg" alt="${day.icon}">
                </div>
                <div class="temperature">
                    <span class="current">${day.temp}${currentUnitString}</span>
                    <span class="range">${day.tempmin}${currentUnitString} / ${day.tempmax}${currentUnitString}</span>
                </div>
            `;
            
            forecastContainer.appendChild(forecastCard);
        }

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Add click listeners for unit options
fahrenheitOption.addEventListener('click', () => handleUnitToggle('us'));
celsiusOption   .addEventListener('click', () => handleUnitToggle('metric'));

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
    setCurrentUnitString();
    
    // If we have a city searched, refresh the weather data
    if (searchInput.value.trim()) {
        handleSearch();
    }
}

function setCurrentUnitString() {
    if (currentUnit === 'metric') {
        currentUnitString = '°C';
        currentUnitDistance = 'km';
    }
    else if (currentUnit === 'us') {
        currentUnitString = '°F';
        currentUnitDistance = 'mi';
    }
    else {
        throw new Error('Wrong current unit');
    }
}

// Add event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});


