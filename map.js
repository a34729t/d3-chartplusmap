var map;
var dataType;
var colorScale;

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
                var countryCode = geography.id;
                mouseoverCallback(countryName, countryCode);
            });
            datamap.svg.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
                var countryName = geography.properties.name;
                var countryCode = geography.id;
                mouseoutCallback(countryName, countryCode);
            });
        }
    });
}

function setupLegend(absoluteMode, colorData) {
    // Remove old legend
    map.svg.selectAll(".legend").remove();

    // Draw new legend
    var legend = map.svg.selectAll("g.legend")
        .data(colorData.ext_domain)
        .enter().append("g")
        .attr("class", "legend");

    var ls_w = 20,
        ls_h = 20;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i) {
            return height - (i * ls_h) - 2 * ls_h + (mapHeight/2);
        })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) {
            return colorData.scale(d);
        })
        .style("opacity", 0.8);

    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i) {
            return height - (i * ls_h) - ls_h - 4  + (mapHeight/2);
        })
        .text(function(d, i) {
            return colorData.labels[i];
        });

    // TODO: Crappy legend label
    legend.append("text")
        .attr("x", 20)
        .attr("y", height + (mapHeight/2) - (ls_h * mapLegendBuckets + ls_h + 10))
        .text(absoluteMode ? "Population Growth" : "Population Growth (%)");
}

function highlightMap(code, highlight) {

    if (highlight) {
        map.svg.select(".datamaps-subunit." + code).style("stroke-width", "3");
    } else {
        map.svg.select(".datamaps-subunit." + code).style("stroke-width", "1");
    }
}

function renderMap(absoluteMode, valueKey) {
    dataType = absoluteMode ? "value" : "valuePercent"

    colorData = setupColors(absoluteMode);
    setupLegend(absoluteMode, colorData);

    var color2country = {}
    for (var i = 0; i < data.length; i++) {
        var countryData = data[i];
        var firstDatum = countryData[countryData.length - 1];

        var code = firstDatum.code;
        var value = firstDatum[dataType];
        var colorValue = colorData.scale(value);
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

// Colors
/////////////////////////////////

function setupColors(absoluteMode) {
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

    // Do some calculation of the proper buckets for the legend
    var color_domain = [];
    var ext_color_domain = [];
    var legend_labels = [];

    var stepValue
    if (absoluteMode) {
        stepValue = max/mapLegendBuckets;
    } else {
        stepValue = (max - min) / (mapLegendBuckets - 1)
    }

    console.log("min = "+min+", max = "+ max);
    console.log("mapLegendBuckets = "+mapLegendBuckets);
    console.log("stepValue = "+stepValue);

    for(var i = 0; i < mapLegendBuckets; i++) {
        var bucketValue;
        if (absoluteMode) {
            bucketValue = Math.round(i * stepValue / 100) * 100;
        } else {
            bucketValue = Math.round((i * stepValue) + min);
        }

        if (i == 0) {
            legend_labels.push(bucketValue);
        } else if (i == mapLegendBuckets - 1) {
            legend_labels.push(bucketValue + "+");
        } else {
            legend_labels.push(bucketValue);
        }

        if (i == mapLegendBuckets - 1) {
            color_domain.push(bucketValue * 1.01);
            ext_color_domain.push(bucketValue * 1.01);
        } else {
            color_domain.push(bucketValue);
            ext_color_domain.push(bucketValue);
        }
    }
    
    var colorScale = d3.scale.linear()
        .domain(color_domain)
        .range(["#130443", "#42043C", "#710435", "#A0042E", "#CF0427", "#FF0520"]);


    return {
        domain: color_domain,
        ext_domain: ext_color_domain,
        labels: legend_labels,
        scale: colorScale
    };
}
