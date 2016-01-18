var map;
var dataType;
var colorScale;

function calculateColors(min, max, pivot, absoluteMode) {
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



    if (absoluteMode) {

    } else {

    }



    return colorScale;
}

function setupMap(mouseoverCallback, mouseoutCallback) {
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
                mouseoverCallback(countryName);
            });
            datamap.svg.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
                var countryName = geography.properties.name;
                mouseoutCallback(countryName);
            });
        }
    });


    //Adding legend for our Choropleth
    var color_domain = [50, 150, 350, 750, 1500];
    var legend_labels = ["< 50", "50+", "150+", "350+", "750+", "> 1500"];
    var ext_color_domain = [0, 50, 150, 350, 750, 1500];
    var colorScale = d3.scale.threshold()
        .domain(color_domain)
        .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);


    var legend = map.svg.selectAll("g.legend")
        .data(ext_color_domain)
        .enter().append("g")
        .attr("class", "legend");

    var ls_w = 20,
        ls_h = 20;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i) {
            return height - (i * ls_h) - 2 * ls_h;
        })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) {
            return colorScale(d);
        })
        .style("opacity", 0.8);

    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i) {
            return height - (i * ls_h) - ls_h - 4;
        })
        .text(function(d, i) {
            return legend_labels[i];
        });
}

function setupLegend() {

}

function highlightMap(name, highlight) {
    var code = country2Code[name];
    if (!code)
        return;

    if (highlight) {
        map.svg.select(".datamaps-subunit." + code).style("stroke-width", "3");
    } else {
        map.svg.select(".datamaps-subunit." + code).style("stroke-width", "1");
    }
}

function renderMap(absoluteMode, valueKey) {
    dataType = absoluteMode ? "value" : "valuePercent"

    // Range of data
    var min, max, pivot;

    if (absoluteMode) {
        var range = valueRange(data, dataType);
        min = range[0];
        max = range[1];
        pivot = (max - min) / 2;
    } else {
        min = -100;
        pivot = 0;
        max = 100;
    }

    colorScale = calculateColors(min, max, pivot);
    // TODO: Update legend

    var color2country = {}
    for (var i = 0; i < data.length; i++) {
        var countryData = data[i];
        var firstDatum = countryData[countryData.length - 1];

        var code = country2Code[firstDatum.name];
        var colorValue = colorScale(firstDatum[dataType]);
        console.log("code = " + code + ", color = " + colorValue);

        color2country[code] = colorValue;
    }

    map.updateChoropleth(color2country);
}


// On page load
/////////////////////////////////

// resize page
// window.addEventListener('resize', function(event){
//     console.log("Window resize");
//     map.resize();
// });