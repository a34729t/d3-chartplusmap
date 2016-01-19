var data = [];
var absoluteMode = true;

// On page load
/////////////////////////////////

var mouseoverCallback = function(countryName, countryCode) {
    highlightChart(countryName, true);
    highlightMap(countryCode, true);
}

var mouseoutCallback = function(countryName, countryCode) {
    highlightChart(countryName, false);
    highlightMap(countryCode, false);
}

getData("http://localhost:8000/all_country_data.json", function(newData) {
    data = newData;

    // setup
    setupChart(mouseoverCallback, mouseoutCallback);
    setupMap(mouseoverCallback, mouseoutCallback);

    // initial page render
    render(absoluteMode);

    // continuous page render
    // setInterval(render, 4000);
});

function render(absoluteMode) {
    valueKey = absoluteMode ? "value" : "valuePercent";

    renderChart(absoluteMode, valueKey);
    renderMap(absoluteMode, valueKey);
}

function changeMode() {
    absoluteMode = !absoluteMode;

    // TODO: Figure out why button text does not change
    if (absoluteMode) {
        d3.select("#updateButton").text("Change to absolute chart");
    } else {
        d3.select("#updateButton").text("Change to relative chart");
    }

    // TODO: Size chart properly (make it absolute sized)
    // TODO: Figure out why chart does not go to correct spot (it is part of body, instead of div)

    render(absoluteMode);
}