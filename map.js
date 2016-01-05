var map;

function setupMap(callback) {
    var width = mapWidth;
    var height = mapHeight;

    map = new Datamap({
        element: document.getElementById(mapContainerDiv),
        projection: 'mercator',
        // responsive: true,
        width: width,
        height: height,
        fills: {
            defaultFill: "#ffffff"
        },

        geographyConfig: {
            borderColor: '#000000',
        },
        data: {},
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('mouseover', function(geography) {
                var countryName = geography.properties.name;
                callback(countryName);
            });
        }
    });

    // TODO: Legend
}

function calculateColors(min, max, pivot) {
    // TODO: Come up with a bad - good colorscale that works well for positive and negative ranges (and for high and low user numbers)
    // TODO: Dynamically change the domain of the data (based on relative growth vs absolute growth)

    // QUANTILE
    // var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
    // var colorScale = d3.scale.quantile()
    //     .domain([min, max])
    //     .range(colors);

    // LINEAR
    var colorScale = d3.scale.linear()
        .domain([min, pivot, max])
        .range(['red', 'yellow', 'green']);

    return colorScale;
}

function selectCountry(countryName) {
    console.log("update brazil color");
    var code = country2Code[countryName];
    var country = map.svg.selectAll('.datamaps-subunit '+code)

    country
        .style("fill", "#000000");
    // var color2country = {code: "#000000"};
    // map.updateChoropleth(color2country);
}

function renderMap(absoluteMode, valueKey) {
    var dataType = absoluteMode ? "value" : "valuePercent"  
    
    // Range of data
    var min, max, pivot;

    if (absoluteMode) {
        var range = valueRange(data, dataType);
        min = range[0];
        max = range[1];
        pivot = (max - min)/2;
    } else {
        min = -100;
        pivot = 0;
        max = 100;
    }

    var colorScale = calculateColors(min, max, pivot);

    var color2country = {}
    for (var i = 0; i < data.length; i++) {
        var countryData = data[i];
        var firstDatum = countryData[5];

        var code = country2Code[firstDatum.name];
        var colorValue = colorScale(firstDatum[dataType]);
        console.log("code = " + code + ", color = " + colorValue);

        color2country[code] = colorValue;
    }

    map.updateChoropleth(color2country);

    selectCountry("Brazil");
}


// On page load
/////////////////////////////////

// resize page
// window.addEventListener('resize', function(event){
//     console.log("Window resize");
//     map.resize();
// });