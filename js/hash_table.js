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
            if (county) {
                document.getElementById("submit").disabled = false;
            }
            else {
                document.getElementById("submit").disabled = true;
            }
        });
    }
    else {
        select_county_dropdown.disabled = true;
    }
}
function displayData(state, county) {
    html_str = ""
    document.getElementById("browse").style.display = "none";
    const result_div = document.getElementById("result");
    result_div.style.display = "block";
    html_str += `<h3>Age Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].age).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value}%</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Education Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].education).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value}%</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Employment Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].employment).forEach(([key, value]) => {
        if (key == "Firms") {
            html_str += `</ul>
            <h4>${key}</h4>
            <ul>
            `;
            Object.entries(value).forEach(([firm, value]) => {
                if (value == -1) {
                    html_str += `<li><p>${firm}: unavailable</p></li>`
                }
                else {
                html_str += `<li><p>${firm}: ${value}</p></li>`
                }
            });
            html_str += `</ul>`;
        }
        else {
            if (value == -1) {
                html_str += `<li><p>${key}: unavailable</p></li>`;
            }
            else {
        html_str += `<li><p>${key}: ${value}</p></li>`;
            }
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Ethnicity Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].ethnicities).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value}%</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Housing Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].housing).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
            if (key == "Persons per Household") {
                html_str += `<li><p>${key}: ${value}</p></li>`;
            }
            else if (!Number.isInteger(value)) {
            html_str += `<li><p>${key}: ${value}%</p></li>`;
        }
        else if (key == "Median Value of Owner-Occupied Units") {
            html_str += `<li><p>${key}: $${value}</p></li>`;
        }
        else {
            html_str += `<li><p>${key}: ${value}</p></li>`;
        }
    }
    });
    html_str += `</ul>`;
    html_str += `<h3>Income Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].income).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: $${value}</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Population Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].population).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value}</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Sales Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].sales).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value}</p></li>`;
        }
    });
    html_str += `</ul>`;
    html_str += `<h3>Other Statistics</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].miscellaneous).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
            if (key == "Mean Travel Time to Work") {
                html_str += `<li><p>${key}: ${value} minutes</p></li>`;
            }
            else if (!Number.isInteger(value) && value <= 100) {
                html_str += `<li><p>${key}: ${value}%</p></li>`;
            }
            else {
        html_str += `<li><p>${key}: ${value}</p></li>`;
            }
    }
    });
    html_str += `</ul>`;
    result_div.innerHTML += html_str;
}
function handleSubmit() {
    const state = document.getElementById("select-state").value;
    const county = document.getElementById("select-county").value;
    displayData(state, county);
}
document.getElementById("submit").addEventListener("click", handleSubmit);
fetchCountyData();
