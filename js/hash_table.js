let data_dict = {};
async function fetchCountyData() {
    try {
        const response = await fetch("dataset/county_demographics.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        processData(data);
    }
    catch (error) {
        console.error("Error fetching county data.", error);
    }
}

function processData(county_data) {
    county_data.forEach(county => {
        const state = county.State;
        const county_name = county.County;
        if (!data_dict[state]) {
            data_dict[state] = {};
        }
        data_dict[state][county_name] = {
            age: county.Age,
            education: county.Education,
            employment: county.Employment,
            ethnicities: county.Ethnicities,
            housing: county.Housing,
            income: county.Income,
            miscellaneous: county.Miscellaneous,
            population: county.Population,
            sales: county.Sales
        };
    });
    populateStateDropdown();
}
function populateStateDropdown() {
    const select_state_dropdown = document.getElementById("select-state");
    const sorted_states = Object.keys(data_dict).sort();
    sorted_states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        select_state_dropdown.appendChild(option);
    });
    select_state_dropdown.addEventListener("change", (event) => {
        const selected_state = event.target.value;
        populateCountyDropdown(selected_state);
    });
}
function populateCountyDropdown(state) {
    const select_county_dropdown = document.getElementById("select-county");
    select_county_dropdown.innerHTML = '<option value="">Select a County</option>';
    if (state) {
        Object.keys(data_dict[state]).forEach(county => {
        const option = document.createElement("option");
            option.value = county;
            option.textContent = county;
            select_county_dropdown.appendChild(option);
        });
        select_county_dropdown.disabled = false;
        select_county_dropdown.addEventListener("change", (event) => {
            const county = event.target.value;
            displayData(state, county);
        });
    }
    else {
        select_county_dropdown.disabled = true;
    }
}
fetchCountyData();
