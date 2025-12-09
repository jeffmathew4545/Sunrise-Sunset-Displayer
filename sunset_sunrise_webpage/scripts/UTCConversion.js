async function UTCConversion(lat, lng, sunrise, sunset) {

    const fetchTZDBURL = `${apiTZDBURL}?key=${apiTZDBKey}&format=json&by=position&lat=${lat}&lng=${lng}`;

    try {
        const response = await fetch(fetchTZDBURL);

        if (!response.ok) {
            throw new Error("Timezone API lookup failed!");
        }

        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(`Timezone API error: ${data.message}`);
        }

        const gmtOffset = data.gmtOffset;
        const sunriseTime = UTCTimeStampCreate(sunrise);
        const sunsetTime = UTCTimeStampCreate(sunset);

        if (isNaN(sunriseTime.getTime()) || isNaN(sunsetTime.getTime())) {
            throw new Error("Invalid UTC time input provided.");
        }

        const gmtOffsetInMilli = gmtOffset * 1000;
        
        const actualSunriseTimeInMilli = sunriseTime.getTime() + gmtOffsetInMilli;
        const actualSunsetTimeInMilli = sunsetTime.getTime() + gmtOffsetInMilli;

        const actualSunriseTime = new Date(actualSunriseTimeInMilli);
        const actualSunsetTime = new Date(actualSunsetTimeInMilli);

        return [
            actualSunriseTime.toLocaleString('en-US', {
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                timeZone: 'UTC' 
            }),
            actualSunsetTime.toLocaleString('en-US', {
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true,
                timeZone: 'UTC' 
            })
        ];
    } catch (error) {
        console.error("Error in UTCConversion:", error);
        return ['Error', 'Error']; 
    }
}

function UTCTimeStampCreate(time) {
    const date = document.querySelector('.js-date-input');

    const timeIn24 = convert12to24hrs(time);

    const fullUTCString = `${date.value}T${timeIn24}Z`;

    const UTCDate = new Date(fullUTCString);

    return UTCDate;
}

function convert12to24hrs(timeIn12) {
    const [time, modifier] = timeIn12.split(' ');
    let [hrs, minu, sec] = time.split(':');

    if (hrs === '12'){
        hrs = '00';
    }
    if (modifier === 'PM') {
        hrs = parseInt(hrs, 10) + 12;
    }

    return `${hrs.toString().padStart(2, '0')}:${minu}:${sec}`;
}