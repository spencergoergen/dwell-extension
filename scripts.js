const inputs = document.querySelectorAll('input[type="text"]');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    // Save the input value to localStorage
    localStorage.setItem(input.id, input.value);
  });

  // Retrieve and set the stored value when the page loads
  const storedValue = localStorage.getItem(input.id);
  if (storedValue) {
    input.value = storedValue;
  }
});

// Get references to the search button and search input field
const downpaymentButton = document.getElementById('downpaymentButton');
 
// Event listener for typing in the search field
searchField.addEventListener('input', () => {
// Handle input changes, perform search operations, etc.
// You can access the search input value using: searchField.value
});

const resetButton = document.getElementById('resetButton');

function resetMap() {
        map.setPaintProperty('county-line-layer', 'line-opacity', 0);
        map.setPaintProperty('county-fill-layer', 'fill-opacity', 0);
        map.setPaintProperty('townships-line-layer', 'line-opacity', 0);
        map.setPaintProperty('townships-fill-layer', 'fill-opacity', 0);
        map.setPaintProperty('schools-line-layer', 'line-opacity', 0);
        map.setPaintProperty('schools-fill-layer', 'fill-opacity', 0);
        const infoDiv = document.getElementById('info');
        infoDiv.innerHTML = ''; // Clear previous content
        infoDiv.innerHTML += `Change price and select an area`;
}

resetButton.addEventListener('click', function() {
    resetMap()
});


function getCheckedOptions() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkedOptions = Array.from(checkboxes).map((checkbox) => checkbox.value);
    console.log(checkedOptions);
} 

const countyCheckbox = document.getElementById('countyCheckbox');
const townshipCheckbox = document.getElementById('townshipCheckbox');
const schoolsCheckbox = document.getElementById('schoolsCheckbox');

countyCheckbox.addEventListener('change', function() {
    if (countyCheckbox.checked) {
      map.setPaintProperty('county-line-layer', 'line-opacity', 0.3);
    } else {
      map.setPaintProperty('county-line-layer', 'line-opacity', 0);
    }
  });

townshipCheckbox.addEventListener('change', function() {
    if (townshipCheckbox.checked) {
      map.setPaintProperty('townships-line-layer', 'line-opacity', 0.3);
    } else {
      map.setPaintProperty('townships-line-layer', 'line-opacity', 0);
    }
  });

schoolsCheckbox.addEventListener('change', function() {
    if (schoolsCheckbox.checked) {
      map.setPaintProperty('schools-line-layer', 'line-opacity', 0.3);
    } else {
      map.setPaintProperty('schools-line-layer', 'line-opacity', 0);
    }
  });

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.options-dropdown');
    const dropdownContent = document.querySelector('.options-dropdown-content');
    
  
    dropdown.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
      console.log("Clicked")
    });
  
    dropdownContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  
    document.addEventListener('click', () => {
      dropdownContent.style.display = 'none';
    });

    
});

// Logic for Multiple Dropdowns with Class .dropdown
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropdown.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
            console.log(`Clicked ${dropdown.classList[1]} Dropdown`);
        });

        dropdownContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const priceButton = document.getElementById('priceButton');
    const priceContent = document.getElementById('priceContent');
  
    priceButton.addEventListener('click', () => {
      if (priceContent.style.display === 'block') {
        priceContent.style.display = 'none';
      } else {
        priceContent.style.display = 'block';
      }
    });

});

mapboxgl.accessToken = 'pk.eyJ1Ijoic2dvZXJnZW4iLCJhIjoiY2xxOGh3NXNmMWRpbDJybGt0M3dlaWhuaCJ9._cf-BoBhMT2C5-sHnyHqeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-85, 43], // Center the map on Michigan
    zoom: 8 // Adjust the zoom level as needed
});

function goBack() {
        window.history.back();
}

function calculateMonthlyPayment() {
    const hoa = parseFloat(document.getElementById('hoa').value);
    const homeInsurance = parseFloat(document.getElementById('homeInsurance').value);
    const pmiMIP = parseFloat(document.getElementById('pmiMIP').value);

    const mortgageAmount = parseFloat(document.getElementById('real-slider').value);
    const downPayment = mortgageAmount * 0.05; // 5% down payment
    const loanAmount = mortgageAmount - downPayment;

    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const monthlyInterestRate = interestRate / 12; // Monthly interest rate

    const loanTermInYears = parseInt(document.getElementById('years').value);
    const numberOfPayments = loanTermInYears * 12; // Number of payments (months)

    // Calculate the monthly mortgage payment using the formula
    const monthlyPayment = (pmiMIP + hoa + homeInsurance) + loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return monthlyPayment; // Return the result rounded to 2 decimal places
}

const bounds = [ [-91, 41], // Southwest coordinates of Michigan
[-81.5, 49] // Northeast coordinates of Michigan
];

const searchInput = document.getElementById('searchField');
const searchButton = document.getElementById('searchButton');
  

const infoDisplay = document.getElementById('info');
let mapInfo; // Declare countyInfo variable outside the event handlers

// Load the JSON data from external file
fetch('michigan.json')
.then(response => response.json())
.then(data => {
    const mapInfo = data;

    let downCost;

    map.on('load', () => {
        const sliderValueDisplay = document.getElementById('slider-value');
        const downPercDropdown = document.getElementById('downpaymentPerc');
        const sliderContainer = document.getElementById('slider-container');
        const sliderValueTop = document.getElementById('slider-top');
        const slider = document.getElementById('real-slider');
        const infoPage = document.getElementById('info');
        const downButton = document.getElementById('downButton');
        const priceButton = document.getElementById('priceButton');

        let sliderValue = 500000;

        downButton.addEventListener('click', function() {
            resetMap()
            const selectedDownpayment = document.querySelector('.dropdown-content input[type="text"]');
            if (selectedDownpayment) {
                selectedDownPercValue = parseFloat(selectedDownpayment.value);
              }
              
              // Calculate downpayment cost
            downCost = sliderValue * (selectedDownPercValue / 100);  
            const monthlyCostText = 'Estimated Home Value: ';
            const downpaymentText = 'Downpayment Cost: ';
            sliderValueTop.textContent = `${monthlyCostText}$${Number(sliderValue).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}   ${downpaymentText}$${Number(downCost).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        });

        priceButton.addEventListener('click', function() {
            resetMap()
        });

        
        slider.addEventListener('input', (e) => {
            const infoDiv = document.getElementById('info');
            infoDiv.innerHTML = ''; // Clear previous content
            infoDiv.innerHTML += `Select an Area`;
        
            sliderValue = parseFloat(e.target.value);
            // Update slider value display
            sliderValueDisplay.textContent = sliderValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        
            const selectedDownpayment = document.querySelector('.dropdown-content input[type="text"]');
            let selectedDownPercValue = 0;
            
            if (selectedDownpayment) {
              selectedDownPercValue = parseFloat(selectedDownpayment.value);
            }
            
            // Calculate downpayment cost
            downCost = sliderValue * (selectedDownPercValue / 100);  
            
            resetMap()
        
            // Display both estimated home value and downpayment cost
            const monthlyCostText = 'Estimated Home Value: ';
            const downpaymentText = 'Downpayment Cost: ';
            sliderValueTop.textContent = `${monthlyCostText}$${Number(sliderValue).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}   ${downpaymentText}$${Number(downCost).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        });
        

    map.setMaxBounds(bounds);
    map.setMinZoom(3);

    // Load county boundary data
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
        'id': 'townships-line-layer',
        'type': 'line',
        'source': 'townships',
        'paint': {
        'line-color': '#000000', // Adjust the color of the county lines as needed
        'line-opacity': 0,
        'line-width': 3 // Adjust the width of the county lines
        }
    });
    map.addLayer({
        'id': 'schools-line-layer',
        'type': 'line',
        'source': 'schools',
        'paint': {
        'line-color': '#000000', // Adjust the color of the county lines as needed
        'line-opacity': 0,
        'line-width': 3 // Adjust the width of the county lines
        }
    });
    map.addLayer({
        'id': 'county-line-layer',
        'type': 'line',
        'source': 'counties',
        'paint': {
        'line-color': '#000000', // Adjust the default fill color of the counties as needed
        'line-opacity': 0, // Adjust the fill opacity of the counties
        'line-width': 4
        }
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

    // Information display div
    const infoDisplay = document.getElementById('info');

    map.on('click', (e) => {
        const countyFeatures = map.queryRenderedFeatures(e.point, { layers: ['county-fill-layer'] });
        const townshipFeatures = map.queryRenderedFeatures(e.point, { layers: ['townships-fill-layer'] });
        const schoolFeatures = map.queryRenderedFeatures(e.point, { layers: ['schools-fill-layer'] });

        const infoDiv = document.getElementById('info');
        infoDiv.innerHTML = ''; // Clear previous content
        let clickedCounty = ''
        let clickedTwp = ''
        let clickedSchool = ''
        //infoDiv.innerHTML += `<strong>Monthly Property Tax For Loan Amount: </strong> ${sliderValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        infoDiv.innerHTML += `<strong><span style="color: purple;">Selected Area</span></strong><br>`;

        if (countyFeatures.length > 0) {
        clickedCounty = countyFeatures[0].properties.NAME_2; // Extract county name from the GeoJSON property
        infoDiv.innerHTML += `<strong>County:</strong> <strong>${clickedCounty}</strong><br>`;
        }

        if (townshipFeatures.length > 0) {
            clickedTwp = townshipFeatures[0].properties.LABEL;
            infoDiv.innerHTML += `<strong><span style="color: blue;">Township/City:</span></strong> ${clickedTwp}<br>`;
        }

        //console.log(mapInfo[clickedCounty][clickedTwp]);
        let cost = 'Cost not calculated';
        let totalMonthly = 'Total Monthly not calculated';

        if (schoolFeatures.length > 0 && mapInfo) {
        let clickedSchoolName = schoolFeatures[0].properties.NAME.toLowerCase().split(' ');
        clickedSchool = schoolFeatures[0].properties.NAME

        // Words to be filtered out
        const wordsToRemove = ['comm', 'community', 'school', 'schools'];

        // Remove specific words from the clickedSchoolName array
        clickedSchoolName = clickedSchoolName.filter(word => !wordsToRemove.includes(word));

        // Split words on dash ("-") and flatten the array
        clickedSchoolName = clickedSchoolName.flatMap(word => word.split('-'));

        let rate = 'Rate not found'; // Default message if rate is not found
        //console.log(clickedSchoolName);
        //console.log("^^ Real Clicked");
        const countyData = mapInfo[clickedCounty];
        
        if (countyData && countyData[clickedTwp]) {
            const schoolsInTownship = countyData[clickedTwp][0];

            Object.keys(schoolsInTownship).forEach(school => {
                const lowercaseSchool = school.toLowerCase();
                const schoolWords = lowercaseSchool.split(/[\s-]+/);
                //console.log(schoolWords);
                //console.log("^^ From JSON");

                // Check if any word in the clicked school name matches a word in the school name
                schoolWords.forEach(clickedWord => {
                    if (clickedSchoolName.includes(clickedWord)) {
                        rate = schoolsInTownship[school].Rate;
                    }
                });
            });
            const sliderValue = parseFloat(document.getElementById('real-slider').value);
            cost = ((sliderValue / 2000) * rate) / 12;
            yearly = cost * 12;
            const monthlyPayment = calculateMonthlyPayment();
            console.log(`Total Monthly: ${monthlyPayment}`);
            console.log(`Total Monthly: ${cost}`);
            totalMonthly = monthlyPayment + cost;
            totalMonthly = Math.floor(totalMonthly); 
            cost = Math.floor(cost);
            yearly = Math.floor(yearly);
            console.log(`Total Monthly: ${totalMonthly}`);
            

        }
        console.log(cost)
        infoDiv.innerHTML += `<strong><span style="color: red;">School:</span></strong> ${schoolFeatures[0].properties.NAME}<br>`;
        infoDiv.innerHTML += `<strong>Rate:</strong> ${rate}<br>`;
        infoDiv.innerHTML += `<strong style="font-size: 17px;">Property Tax: </strong>$<span style="font-size: 17px;">${cost} monthly | $${yearly} yearly</span><br>`;
        infoDiv.innerHTML += `<span style="font-size: 12px;">*Only an Estimate based on posted 2022 Michigan Millage Rates</span><br>`;
        infoDiv.innerHTML += `<span style="font-size: 12px;"><br>`;
        
        const closing = parseFloat(document.getElementById('closing').value) || 0;
        const closingPlus = parseFloat(document.getElementById('closingPlus').value) || 0;
        const taxes = parseFloat(document.getElementById('taxes').value) || 0;
        const taxesPlus = parseFloat(document.getElementById('taxesPlus').value) || 0;
        const summer = parseFloat(document.getElementById('summer').value) || 0;
        const summerPlus = parseFloat(document.getElementById('summerPlus').value) || 0;
        const inspection = parseFloat(document.getElementById('inspection').value) || 0;
        const inspectionPlus = parseFloat(document.getElementById('inspectionPlus').value) || 0;
        const homeowner = parseFloat(document.getElementById('homeowner').value) || 0;
        const homeownerPlus = parseFloat(document.getElementById('homeownerPlus').value) || 0;
        
        const closingTop = (closing + taxes + summer + inspection + homeowner) + (closingPlus + taxesPlus + summerPlus + inspectionPlus + homeownerPlus) + downCost;
        const closingBottom = (closing + taxes + summer + inspection + homeowner) - (closingPlus + taxesPlus + summerPlus + inspectionPlus + homeownerPlus) + downCost;

        const formattedClosingTop = closingTop.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const formattedClosingBottom = closingBottom.toLocaleString('en-US', { style: 'currency', currency: 'USD'});

        const formattedTotalMonthly = totalMonthly.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        
        infoDiv.innerHTML += `<strong style="font-size: 17px;">Cash Needed at Closing: </strong><span style="font-size: 17px;">${formattedClosingBottom} - ${formattedClosingTop}</span><br>`;
        
        infoDiv.innerHTML += `<strong style="font-size: 17px;">Estimated Monthly Payment: </strong><span style="font-size: 17px;">${formattedTotalMonthly}</span><br>`;
        }        

        map.setPaintProperty('townships-fill-layer', 'fill-opacity', [
            'case',
            ['==', ['get', 'LABEL'], clickedTwp],
            0.4, // Change this to the desired opacity for the clicked county (0.5 for example)
            0.0 // Default opacity for other counties
            ]);

        map.setPaintProperty('county-fill-layer', 'fill-opacity', [
            'case',
            ['==', ['get', 'NAME_2'], clickedCounty],
            0.0, // Change this to the desired opacity for the clicked county (0.5 for example)
            0.3 // Default opacity for other counties
        ]);

        map.setPaintProperty('county-line-layer', 'line-opacity', [
            'case',
            ['==', ['get', 'NAME_2'], clickedCounty],
            1.0, // Change this to the desired opacity for the clicked county (0.5 for example)
            0.1 // Default opacity for other counties
            ]);

        map.setPaintProperty('schools-line-layer', 'line-opacity', [
            'case',
            ['==', ['get', 'NAME'], clickedSchool],
            1.0, // Change this to the desired opacity for the clicked county (0.5 for example)
            0.2 // Default opacity for other counties
        ]);

        map.setPaintProperty('townships-line-layer', 'line-opacity', [
            'case',
            ['==', ['get', 'LABEL'], clickedTwp],
            1.0, // Change this to the desired opacity for the clicked county (0.5 for example)
            0.2 // Default opacity for other counties
        ]);

        map.setPaintProperty('schools-fill-layer', 'fill-opacity', [
        'case',
        ['==', ['get', 'NAME'], clickedSchool],
        .25, // Change this to the desired opacity for the clicked county (0.5 for example)
        0.0 // Default opacity for other counties
        ]);

});

    // Change cursor to pointer when hovering over county fill
    map.on('mouseenter', 'county-fill-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back to default
    map.on('mouseleave', 'county-fill-layer', () => {
        map.getCanvas().style.cursor = '';
    });

    searchButton.addEventListener('click', function() {
        const query = searchInput.value;
    
        // Use Mapbox Geocoding API to get the coordinates for the entered location
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
                const features = data.features;
                if (features.length > 0) {
                    const placeName = features[0].place_name; // Extract the city name from the JSON response
                    const cityText = features[0].text; 
                    if (placeName.toLowerCase().includes('michigan')) {
                        const coordinates = features[0].geometry.coordinates; // Get the coordinates
                        map.flyTo({
                            center: coordinates, // Set the map center to the entered location
                            zoom: 10.5 // You can adjust the zoom level as needed
                        });
    
                        const city = cityText.toLowerCase(); // City name in lowercase
                        console.log(city)
                        resetMap()
    
                        //map.setPaintProperty('townships-fill-layer', 'fill-opacity', [
                        //    'case',
                        //    ['==', ['get', 'city_property_in_your_layer'], city], // Replace 'city_property_in_your_layer' with the actual property name in your layer
                        //   0.4, // Change this to the desired opacity for the clicked city (e.g., 0.5)
                        //    0.0 // Default opacity for other cities
                        //]);
                    } else {
                        alert('Location outside Michigan. Consider adding "MI" after your location.');
                    }
                } else {
                    alert('Location not found.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
            });
    });


    });
})
.catch(error => {
    console.error('Error fetching JSON:', error);
});

// Function to toggle school display for a township/city
function toggleSchools(element) {
const schoolsElement = element.nextElementSibling;
if (schoolsElement.style.display === 'none'){
    schoolsElement.style.display = 'block';
} 
else {
    schoolsElement.style.display = 'none';
}
}