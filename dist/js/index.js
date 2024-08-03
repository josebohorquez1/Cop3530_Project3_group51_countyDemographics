let data_dict = {};
const ord_map = new OrderedMap();
async function fetchCountyData() {
    try {
        const response = await fetch("dataset/county_demographics.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        processData(data);
        processChart(data);
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
function processChart(county_data) {
    county_data.forEach(item => {
        ord_map.setElement(item.County, item);
    });
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
        document.getElementById("submit").disabled = true;
        document.getElementById("filter-menu-button").disabled = true;
        document.getElementById("select-view").disabled = true;
        document.getElementById("select-county").disabled = true;
        if (document.getElementById("filter-menu").style.display == "block") {
            document.getElementById("filter-menu").style.display = "none";
        }
        if (document.getElementById("filter-menu-button").innerHTML == "Close Filter Menu") {
            document.getElementById("filter-menu-button").innerHTML = "Open Filter Menu";
        }
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
                document.getElementById("filter-menu-button").disabled = false;
                document.getElementById("select-view").disabled = false;
                populateFilterMenu();
                enableButtons();
            }
            else {
                disableButtons();
                document.getElementById("submit").disabled = true;
                document.getElementById("filter-menu-button").disabled = true;
                document.getElementById("select-view").disabled = true;
                if (document.getElementById("filter-menu").style.display == "block") {
                    document.getElementById("filter-menu").style.display = "none";
                }
                if (document.getElementById("filter-menu-button").innerHTML == "Close Filter Menu") {
                    document.getElementById("filter-menu-button").innerHTML = "Open Filter Menu";
                }
            }
        });
    }
    else {
        select_county_dropdown.disabled = true;
    }
}
function displayData(state, county) {
    let html_str = ""
    document.getElementById("browse").style.display = "none";
    const result_div = document.getElementById("result");
    result_div.style.display = "block";

    html_str += `<div class="container top-4 p-4 border-2 border-gray-300 rounded-lg shadow-2xl bg-gray-900">`; // Start of the container

    html_str += `<h2 class="text-2xl font-bold mb-2">Results for ${county}, ${state}:</h2>`;
    if (!document.getElementById("age").checked) {
    html_str += `<h3 class="text-xl font-bold ">Age Statistics:</h3>
    <ul style="margin-bottom: 20px;">
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
}
if (!document.getElementById("education").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Education Statistics:</h3>
    <ul style="margin-bottom: 20px;">
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
}
if (!document.getElementById("employment").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Employment Statistics:</h3>
    <ul>
    `;
    Object.entries(data_dict[state][county].employment).forEach(([key, value]) => {
        if (key == "Firms") {
            html_str += `</ul>
            <h4>${key}</h4>
            <ul style="margin-bottom: 20px;">
            `;
            Object.entries(value).forEach(([firm, value]) => {
                if (value == -1) {
                    html_str += `<li><p>${firm}: unavailable</p></li>`
                }
                else {
                html_str += `<li><p>${firm}: ${value.toLocaleString()}</p></li>`
                }
            });
            html_str += `</ul>`;
        }
        else {
            if (value == -1) {
                html_str += `<li><p>${key}: unavailable</p></li>`;
            }
            else {
        html_str += `<li><p>${key}: ${value.toLocaleString()}</p></li>`;
            }
        }
    });
    html_str += `</ul>`;
}
if (!document.getElementById("ethnicities").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Ethnicity Statistics:</h3>
    <ul style="margin-bottom: 20px;">
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
}
if (!document.getElementById("housing").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Housing Statistics:</h3>
    <ul style="margin-bottom: 20px;">
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
            html_str += `<li><p>${key}: $${value.toLocaleString()}</p></li>`;
        }
        else {
            html_str += `<li><p>${key}: ${value.toLocaleString()}</p></li>`;
        }
    }
    });
    html_str += `</ul>`;
}
if (!document.getElementById("income").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Income Statistics:</h3>
    <ul style="margin-bottom: 20px;">
    `;
    Object.entries(data_dict[state][county].income).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: $${value.toLocaleString()}</p></li>`;
        }
    });
    html_str += `</ul>`;
}
if (!document.getElementById("population").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Population Statistics:</h3>
    <ul style="margin-bottom: 20px;">
    `;
    Object.entries(data_dict[state][county].population).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: ${value.toLocaleString()}</p></li>`;
        }
    });
    html_str += `</ul>`;
}
if (!document.getElementById("sales").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Sales Statistics:</h3>
    <ul style="margin-bottom: 20px;">
    `;
    Object.entries(data_dict[state][county].sales).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
        html_str += `<li><p>${key}: $${value.toLocaleString()}</p></li>`;
        }
    });
    html_str += `</ul>`;
}
if (!document.getElementById("miscellaneous").checked) {
    html_str += `<h3 class="text-xl font-bold mb-1">Other Statistics:</h3>
    <ul style="margin-bottom: 20px;">
    `;
    Object.entries(data_dict[state][county].miscellaneous).forEach(([key, value]) => {
        if (value == -1) {
            html_str += `<li><p>${key}: unavailable</p></li>`;
        }
        else {
            if (key == "Mean Travel Time to Work") {
                html_str += `<li><p>${key}: ${value} minutes</p></li>`;
            }
            else if (key == "Land Area") {
                html_str += `<li><p>${key}: ${value} square miles</p></li>`;
            }
            else if (key == "Foreign Born" || key == "Language Other than English at Home" || key == "Living in Same House +1 Years" || key == "Percent Female") {
                html_str += `<li><p>${key}: ${value}%</p></li>`;
            }
            else {
        html_str += `<li><p>${key}: ${value.toLocaleString()}</p></li>`;
            }
    }
    });
    html_str += `</ul>`;
}
    html_str += `</div>`; // End of the container
    result_div.innerHTML += html_str;
}
function displayChart() {
    document.getElementById("browse").style.display = "none";
    const county = document.getElementById("select-county").value;
    const result_div = document.getElementById("result");
    result_div.style.display = "block";
    result_div.innerHTML += `<h2>Results for ${county}, ${document.getElementById("select-state").value}`;
    const canvas = document.createElement("canvas");
    result_div.appendChild(canvas);
    const data_object = ord_map.getElementByKey(county);
    const data = {};
    if (!document.getElementById("age").checked) {
    Object.entries(data_object.Age).forEach(([key, value]) => {
        data["Age: " + key] = value;
    });
}
if (!document.getElementById("education").checked) {
    Object.entries(data_object.Education).forEach(([key, value]) => {
        data["Education: " + key] = value;
    });
}
if (!document.getElementById("employment").checked) {
    data["Employment: Nonemployer Establishments"] = data_object.Employment["Nonemployer Establishments"];
    Object.entries(data_object.Employment.Firms).forEach(([key, value]) => {
        data["Employment: " + key] = value;
    });
}
if (!document.getElementById("ethnicities").checked) {
    Object.entries(data_object.Ethnicities).forEach(([key, value]) => {
        data["Ethnicities: " + key] = value;
    });
}
if (!document.getElementById("housing").checked) {
    Object.entries(data_object.Housing).forEach(([key, value]) => {
        data["Housing: " + key] = value;
    });
}
    if (!document.getElementById("income").checked) {
    Object.entries(data_object.Income).forEach(([key, value]) => {
        data["Income: " + key] = value;
    });
}
if (!document.getElementById("miscellaneous").checked) {
    Object.entries(data_object.Miscellaneous).forEach(([key, value]) => {
        data["Miscellaneous: " + key] = value;
    });
}
if (!document.getElementById("population").checked) {
    Object.entries(data_object.Population).forEach(([key, value]) => {
        data["Population: " + key] = value;
    });
}
if (!document.getElementById("sales").checked) {
    Object.entries(data_object.Sales).forEach(([key, value]) => {
        data["Sales: " + key] = value;
    });
}
    const chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Demographic Data',
                data: Object.values(data),
                borderWidth: 0.5
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            //scales {
            //}
        }
    });
}
function handleSubmit() {
    const state = document.getElementById("select-state").value;
    const county = document.getElementById("select-county").value;
    if (document.getElementById("select-view").value == "list") {
        displayData(state, county);
    }
    if (document.getElementById("select-view").value == "chart") {
        displayChart();
    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function populateFilterMenu() {
    const filter_menu = document.getElementById("filter-menu");
    filter_menu.innerHTML = `
        <h3 class="text-lg font-bold dark:text-white">Filter Menu:</h3>
        <p class="block text-sm mb-2">Check the box or boxes of the categories you do not wish to see in the results</p>
    `;
    
    const state = document.getElementById("select-state").value;
    const county = document.getElementById("select-county").value;

    Object.keys(data_dict[state][county]).forEach(key => {
        const capitalizedKey = capitalizeFirstLetter(key);

        //Checkbox container
        const container = document.createElement("div");
        container.className = "flex items-center mb-2";

        //Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = key;
        checkbox.className = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";

        //Labels
        const label = document.createElement("label");
        label.htmlFor = key;
        label.className = "ms-2 text-sm font-semibold";
        label.textContent = capitalizedKey;

        container.appendChild(checkbox);
        container.appendChild(label);

        filter_menu.appendChild(container);
    });
}
function toggleFilterMenu() {
    const filter_menu = document.getElementById("filter-menu");
    const filter_menu_button = document.getElementById("filter-menu-button");
    if (filter_menu.style.display == "none") {
        filter_menu_button.innerHTML = "Close Filter Menu";
        filter_menu.style.display = "block";
    }
    else {
        filter_menu.style.display = "none";
        filter_menu_button.innerHTML = "Open Filter Menu";
    }
}
function newSearchButtonFunction() {
    const result = document.getElementById("result");
    const state = document.getElementById("select-state");
    const county = document.getElementById("select-county");
    const filter_menu_button = document.getElementById("filter-menu-button")
    const filter_menu = document.getElementById("filter-menu");
    const select_view = document.getElementById("select-view");
    const submit = document.getElementById("submit");
    result.style.display = "none";
    result.innerHTML = `<button onclick="newSearchButtonFunction()" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 
    to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 
    shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm 
    px-8 py-3 w-full max-w-xs text-center me-2 mb-2">New Search</button>`;
    state.value = "";
    county.disabled = true;
    county.innerHTML = `<option value="">Select a County</option>`;
    filter_menu.style.display = "none";
    filter_menu_button.disabled = true;
    filter_menu_button.innerHTML = "Open Filter Menu";
    select_view.value = "chart";
    select_view.disabled = true;
    submit.disabled = true;
    document.getElementById("browse").style.display = "block";
}
document.getElementById("submit").addEventListener("click", handleSubmit);
fetchCountyData();
