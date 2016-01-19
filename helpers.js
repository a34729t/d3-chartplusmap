var parseDate = d3.time.format("%d-%b-%y").parse;

function getData(dataURL, callback) {
    d3.json(dataURL, function(error, data) {
        if (error) throw error;

        // Scale Data/Parse date
        for (var i = 0; i < data.length; i++) {
            var countryData = data[i];
            var startValue = 0;

            for (var j = 0; j < countryData.length; j++) {
                var datum = countryData[j];
                
                // Scale data
                if (j == 0) {
                    startValue = datum.value;
                }
                datum.valuePercent = ((datum.value / startValue) - 1) * 100;

                // Parse date
                datum.date = parseDate(datum.date);
            }
        }

        callback(data);
    });
}

function dateRange(data) {
    console.log(data);
    var xMin = data.reduce(function(pv,cv){
        var currentMin = cv.reduce(function(pv,cv){
          return pv.date < cv.date ? pv : cv;
      },100)
        return pv.date < currentMin.date ? pv.date : currentMin.date;
    },100);
    var xMax = data.reduce(function(pv,cv){
        var currentMax = cv.reduce(function(pv,cv){
          return pv.date > cv.date ? pv : cv;
      },100)
        return pv.date > currentMax.date ? pv.date : currentMax.date;
    },100);

    return [xMin, xMax];
}

function valueRange(data, valueKey) {
    var yMin = data.reduce(function(pv,cv){
        var currentMin = cv.reduce(function(pv,cv){
          return Math.min(pv,cv[valueKey]);
      },100)
        return Math.min(pv,currentMin);
    },100);
    var yMax = data.reduce(function(pv,cv){
        var currentMax = cv.reduce(function(pv,cv){
          return Math.max(pv,cv[valueKey]);
      },0)
        return Math.max(pv,currentMax);
    },0);

    return [yMin, yMax];
}