mapboxgl.accessToken = 'pk.eyJ1Ijoic2dvZXJnZW4iLCJhIjoiY2xxOGh3NXNmMWRpbDJybGt0M3dlaWhuaCJ9._cf-BoBhMT2C5-sHnyHqeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-85, 43], // Center the map on Michigan
    zoom: 8 // Adjust the zoom level as needed
});

fetch('michigan.json')
.then(response => response.json())
.then(data => {
    const mapInfo = data;

    map.setMaxBounds(bounds);
    map.setMinZoom(3);

    map.addSource('townships', {
        type: 'geojson',
        data: 'townships.geojson' // Replace with the path to your county boundary JSON file
    });   

            // Load county boundary data
    map.addSource('schools', {
        type: 'geojson',
        data: 'schools.geojson' // Replace with the path to your county boundary JSON file
    });   

                    // Load county boundary data
    map.addSource('counties', {
        type: 'geojson',
        data: 'county.geojson' // Replace with the path to your county boundary JSON file
    });   

    map.addLayer({
        'id': 'townships-fill-layer',
        'type': 'fill',
        'source': 'townships',
        'paint': {
        'fill-color': '#0000FF', // Adjust the default fill color of the counties as needed
        'fill-opacity': 0 // Adjust the fill opacity of the counties
        }
    });
    map.addLayer({
        'id': 'county-fill-layer',
        'type': 'fill',
        'source': 'counties',
        'paint': {
        'fill-color': '#000000', // Adjust the default fill color of the counties as needed
        'fill-opacity': 0 // Adjust the fill opacity of the counties
        }
    });
    map.addLayer({
        'id': 'schools-fill-layer',
        'type': 'fill',
        'source': 'schools',
        'paint': {
        'fill-color': '#FF0000', // Adjust the default fill color of the counties as needed
        'fill-opacity': 0 // Adjust the fill opacity of the counties
        }
    });

map.on('click', (e) => {
    const countyFeatures = map.queryRenderedFeatures(e.point, { layers: ['county-fill-layer'] });
    const townshipFeatures = map.queryRenderedFeatures(e.point, { layers: ['townships-fill-layer'] });
    const schoolFeatures = map.queryRenderedFeatures(e.point, { layers: ['schools-fill-layer'] });
    let clickedCounty = '';
    let clickedTwp = '';
    let clickedSchool = '';
    let cost = '';
    let totalMonthly = '';
    let rate = '';
    if (countyFeatures.length > 0) {
        clickedCounty = countyFeatures[0].properties.NAME_2;
    }
    if (townshipFeatures.length > 0) {
        clickedTwp = townshipFeatures[0].properties.LABEL;
    }
    if (schoolFeatures.length > 0 && mapInfo) {
    let clickedSchoolName = schoolFeatures[0].properties.NAME.toLowerCase().split(' ');
    clickedSchool = schoolFeatures[0].properties.NAME
    const wordsToRemove = ['comm', 'community', 'school', 'schools'];
    clickedSchoolName = clickedSchoolName.filter(word => !wordsToRemove.includes(word));
    clickedSchoolName = clickedSchoolName.flatMap(word => word.split('-'));

    const countyData = mapInfo[clickedCounty];
    if (countyData && countyData[clickedTwp]) {
        const schoolsInTownship = countyData[clickedTwp][0];
        Object.keys(schoolsInTownship).forEach(school => {
            const lowercaseSchool = school.toLowerCase();
            const schoolWords = lowercaseSchool.split(/[\s-]+/);
            schoolWords.forEach(clickedWord => {
                if (clickedSchoolName.includes(clickedWord)) {
                    rate = schoolsInTownship[school].Rate;
                }
            });
        });
        const sliderValue = 100
        cost = ((sliderValue / 2000) * rate) / 12;
        const monthlyPayment = calculateMonthlyPayment();
        totalMonthly = monthlyPayment + cost;
        totalMonthly = Math.floor(totalMonthly); 
        cost = Math.floor(cost);
    }
    console.log(cost)
    }        
    map.setPaintProperty('townships-fill-layer', 'fill-opacity', ['case',['==', ['get', 'LABEL'], clickedTwp], 0.4, 0.0]);
    map.setPaintProperty('county-fill-layer', 'fill-opacity', ['case',['==', ['get', 'NAME_2'], clickedCounty],0.0, 0.3]);
    map.setPaintProperty('schools-fill-layer', 'fill-opacity', ['case',['==', ['get', 'NAME'], clickedSchool],.25,0.0]);
});
})