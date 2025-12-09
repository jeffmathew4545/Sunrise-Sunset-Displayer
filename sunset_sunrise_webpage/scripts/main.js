document.addEventListener("DOMContentLoaded", () => {
    const addressinput = document.querySelector('.js-address-input');
    const placename = document.querySelector('.js-place-name');
    const countryinput = document.querySelector('.js-country-input');
    const dateinput = document.querySelector('.js-date-input');
    const datefield = document.querySelector('.js-date');
    const latlong = document.querySelector('.js-lat-long');
    const sunrise = document.querySelector('.js-sunrise');
    const sunset = document.querySelector('.js-sunset');
    const btn = document.querySelector('.js-button');

    btn.addEventListener("click", async () => {
        const addressValue = addressinput.value;
        const countryValue = countryinput.value.toUpperCase();
        const dateValue = dateinput.value;

        let lat = 0;
        let long = 0;

        try {
            if (countryValue.length > 2) {
                throw new Error("Country name not in ISO format!");
            }
            placename.textContent = "Place: " + addressValue + ", " + countryValue;
            datefield.textContent = "Date: " + dateValue;

            const fetchNinjaURL = `${apiNinjaURL}?city=${addressValue}&country=${countryValue}`;
            const geoResponse = await fetch(fetchNinjaURL, {
                method: 'GET',
                headers: {
                    'X-Api-Key': apiNinjaKey
                }
            });

            if (!geoResponse.ok) {
                throw new Error("Geoloading failed!");
            }

            const geoData = await geoResponse.json();
            const locationData = geoData[0];

            if (!locationData) {
                throw new Error("Could not find coordinates for the entered place.");
            }

            lat = locationData.latitude;
            long = locationData.longitude;
            latlong.textContent = "Lat and Long: " + lat + ", " + long;

            const fetchSSURL = `${apiSSURL}?lat=${lat}&lng=${long}&date=${dateValue}`;
            const ssResponse = await fetch(fetchSSURL);

            if (!ssResponse.ok) {
                throw new Error("Sunrise/Sunset API failed");
            }

            const ssData = await ssResponse.json();
            const utcSunriseTime = ssData.results.sunrise;
            const utcSunsetTime = ssData.results.sunset;

            const [sunriseTime, sunsetTime] = await UTCConversion(lat, long, utcSunriseTime, utcSunsetTime);
            sunrise.textContent = "Sunrise: " + sunriseTime;
            sunset.textContent = "Sunset: " + sunsetTime;
        } catch (error) {
            console.error("An error occurred during the process:", error);
            latlong.textContent = "Error: " + error.message;
            sunrise.textContent = "Sunrise: Failed";
            sunset.textContent = "Sunset: Failed";
        }
    })
});