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

        map.setMinZoom(3);

        map.addSource('townships', {
            type: 'geojson',
            data: 'townships.geojson' // Replace with the path to your county boundary JSON file
        });

        map.addSource('schools', {
            type: 'geojson',
            data: 'schools.geojson' // Replace with the path to your county boundary JSON file
        });

        map.addSource('counties', {
            type: 'geojson',
            data: 'county.geojson' // Replace with the path to your county boundary JSON file
        });

        map.addLayer({
            'id': 'townships-fill-layer',
            'type': 'fill',
            'source': 'townships',
            'paint': {
                'fill-color': '#0000FF',
                'fill-opacity': 0
            }
        });

        map.addLayer({
            'id': 'county-fill-layer',
            'type': 'fill',
            'source': 'counties',
            'paint': {
                'fill-color': '#000000',
                'fill-opacity': 0
            }
        });

        map.addLayer({
            'id': 'schools-fill-layer',
            'type': 'fill',
            'source': 'schools',
            'paint': {
                'fill-color': '#FF0000',
                'fill-opacity': 0
            }
        });

        function simulateMapClick(address) {
            // Using Mapbox Geocoding API to convert address to coordinates
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    const coordinates = data.features[0].center; // Extracting coordinates from the geocoding response
                    const [longitude, latitude] = coordinates;

                    const countyFeatures = map.queryRenderedFeatures([longitude, latitude], { layers: ['county-fill-layer'] });
                    const townshipFeatures = map.queryRenderedFeatures([longitude, latitude], { layers: ['townships-fill-layer'] });
                    const schoolFeatures = map.queryRenderedFeatures([longitude, latitude], { layers: ['schools-fill-layer'] });
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
                        const sliderValue = 100;
                        cost = ((500000 / 2000) * rate) / 12;
                        cost = Math.floor(cost);
                        console.log(cost)
                    }
                    }      
                    map.setPaintProperty('townships-fill-layer', 'fill-opacity', ['case', ['==', ['get', 'LABEL'], clickedTwp], 0.4, 0.0]);
                    map.setPaintProperty('county-fill-layer', 'fill-opacity', ['case', ['==', ['get', 'NAME_2'], clickedCounty], 0.0, 0.3]);
                    map.setPaintProperty('schools-fill-layer', 'fill-opacity', ['case', ['==', ['get', 'NAME'], clickedSchool], .25, 0.0]);
                })
                .catch(error => {
                    console.error('Error fetching geocoding data:', error);
                });
        }

        // Example usage of simulateMapClick function with an address
        const providedAddress = '123 Main St, SomeCity, SomeCountry';
        simulateMapClick(providedAddress);
    });
