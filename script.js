Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var mytiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var pinkIcon = L.icon({
    iconUrl: 'drawing.svg',
    iconSize:     [26, 41],
    iconAnchor:   [13, 41],
    popupAnchor:  [0, -41]
});

var greenIcon = L.icon({
    iconUrl: 'drawingGreen.svg',
    iconSize:     [26, 41],
    iconAnchor:   [13, 41],
    popupAnchor:  [0, -41]
});
// Initialise an empty map
var map = L.map('map');
map.addLayer(mytiles).setView([0.5, -50.0], 2);
var markers = [];
for(var i = 0; i < continents.length; i++) {
    markers[i] = L.marker(continents[i]["geometry"]["coordinates"], {opacity: 0});
}
var layerContinents = L.layerGroup(markers);;
var layerCountries = L.layerGroup([]);
var layerActual = L.layerGroup([]);
// Adding the granularity
map.addLayer(layerContinents);
map.on('zoomend', function() {
    console.log("work pls");
    if(Number(map.getZoom()) <= 2){
        //continents overlay
        console.log("continents");
        map.addLayer(layerContinents);
        if(map.hasLayer(layerCountries)) {
            map.removeLayer(layerCountries);
        }
        if(map.hasLayer(layerActual)) {
            map.removeLayer(layerActual);
        }
    } else if(Number(map.getZoom()) == -1) {
        //countries overlay
        console.log("countries");
        map.addLayer(layerCountries);
        if(map.hasLayer(layerContinents)) {
            map.removeLayer(layerContinents);
        }
        if(map.hasLayer(layerActual)) {
            map.removeLayer(layerActual);
        }
    } else {
        //actual location overlay
        console.log("actual");
        map.addLayer(layerActual);
        if(map.hasLayer(layerCountries)) {
            map.removeLayer(layerCountries);
        }
        if(map.hasLayer(layerContinents)) {
            map.removeLayer(layerContinents);
        }
    }
});

var myStyle = {
        radius: 2,
        fillColor: "red",
        color: "red",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };

//L.geoJson(concepts, myStyle).addTo(map);
var i = 0;
var marker, line;
var time = 0;
var arrOfCountries = [];
arrOfCountries[0] = ["bye", 0];
sliderPrevVal = 0;
var forgetting = false;
var markersAndLines = [];
var articlesInContinents = [0, 0, 0, 0, 0, 0, 0];
var previousTime = 0;

var addedEvents = [];
for(i = 0; i < concepts2.length; i++) {
    addedEvents[i] = [];
    if(concepts2[i]["properties"]["source"] == "true"){
        marker = L.marker([parseFloat(concepts2[i]["geometry"]["coordinates"][1]),parseFloat(concepts2[i]["geometry"]["coordinates"][0])], {icon: pinkIcon});
        line = null;
        //decorator = null;
    } else {
        marker = L.marker([parseFloat(concepts2[i]["geometry"]["coordinates"][1]),parseFloat(concepts2[i]["geometry"]["coordinates"][0])], {icon: greenIcon});
        var latlng = [
                    [parseFloat(concepts2[i]["properties"]["sourceCoordinates"][1]), parseFloat(concepts2[i]["properties"]["sourceCoordinates"][0])],
                    [parseFloat(concepts2[i]["geometry"]["coordinates"][1]), parseFloat(concepts2[i]["geometry"]["coordinates"][0])]
                ];
        line = L.polyline(latlng , {color: '#081B2B', weight: 0.5});   
        //decorator =  L.polylineDecorator(latlng2, {patterns: [{offset: '50%', repeat: 1, symbol: L.Symbol.arrowHead({pizelSize: 15, polygon: false, pathOptions: {stroke: true}})}]});        
        line.setText('  ►  ', {repeat: false, center: true, offset: 7, attributes: {fill: 'black', 'font-size': '20px', opacity: 0}});
    }
    //marker.addTo(map);
    marker.setOpacity(0);
    markersAndLines[markersAndLines.length] = marker;
    if(line != null) {
        //line.addTo(map);
        markersAndLines[markersAndLines.length] = line;
        line.setStyle({opacity: 0});
    }
    addedEvents[i] = [marker, concepts2[i]["properties"]["time"], line];

    var cont = "";
     for(var key4 in continentCountries) {
        for(var key3 in continentCountries[key4]) {
            if(continentCountries[key4][key3]["name"] == concepts2[i]["properties"]["country"]) {
                cont = continentCountries[key4][key3]["continent"];
            }
        }
    }
    var artKey = 0;
}

var continentLines = [];
var continentLinesWeight = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
continentLines[0] = L.polyline([[49.847746, 18.552530],[49.463684, -109.108600]], {color: '#081B2B', weight: continentLinesWeight[0]});
continentLines[1] = L.polyline([[49.847746, 18.552530],[-13.972684, -58.307820]], {color: '#081B2B', weight: continentLinesWeight[1]});
continentLines[2] = L.polyline([[49.847746, 18.552530],[45.915834, 102.180462]], {color: '#081B2B', weight: continentLinesWeight[2]});
continentLines[3] = L.polyline([[49.463684, -109.108600],[45.915834, 102.180462]], {color: '#081B2B', weight: continentLinesWeight[3]});
continentLines[4] = L.polyline([[45.915834, 102.180462],[-26.319236, 134.524207]], {color: '#081B2B', weight: continentLinesWeight[4]});
continentLines[5] = L.polyline([[49.463684, -109.108600],[-26.319236, 134.524207]], {color: '#081B2B', weight: continentLinesWeight[5]});
continentLines[6] = L.polyline([[-13.972684, -58.307820],[49.463684, -109.108600]], {color: '#081B2B', weight: continentLinesWeight[6]});


for(var l = 0; l < 6; l++) {
    continentLines[l].addTo(layerContinents);
}

layerActual = L.layerGroup(markersAndLines);
// adding granularity
// map.addLayer(layerActual);

document.getElementById("time_slider").oninput = function() {
    myFunction();
};

document.getElementById("vanish_slider").oninput = function() {
    if(document.getElementById("vanish_slider").value == 0) {
        forgetting = false;
        repeatVisualization();

    } else {
        forgetting = true;
    }
};

// var test = L.marker([-36, 174]).addTo(map);
// test.setOpacity(.5);

function myFunction() {
   var val = document.getElementById("time_slider").value; //gets the oninput value
   // document.getElementById('output').innerHTML = val; //displays this value to the html page
   timeMarker(val);
   document.getElementById("hourValue").innerHTML = val;
   time = val;
}  

function findCountriesContinent(country) {
    for(var key4 in continentCountries) {
        for(var key3 in continentCountries[key4]) {
            if(continentCountries[key4][key3]["name"] == country) {
                return continentCountries[key4][key3]["continent"];
            }
        }
    }
    return "";
}

function findContinentMarker(continentName) {
    var articlesKey = 0;
    for(var key5 in continents) {
        if(continents[key5]["properties"]["continent"] == continentName)
        {
            return markers[articlesKey];
        }
        articlesKey++;
    }
    return null;
}

function findContinentKey(continentName) {
    var articlesKey = 0;
    for(var key5 in continents) {
        if(continents[key5]["properties"]["continent"] == continentName)
        {
            return articlesKey;
        }
        articlesKey++;
    }
    return (-1);
}

function findContinentLineIndex(cont, cont2) {
    switch(cont){
        case "EU":
            switch(cont2){
                case "NA":
                    return 0;
                break;
                case "SA":
                    return 1;
                break;
                case "AS":
                    return 2;
                break;
            }
            break;
        case "AS":
            switch(cont2){
                case "NA":
                    return 3;
                break;
                case "EU":
                    return 2;
                break;
                case "OC":
                    return 4;
                break;
            }
            break;

        case "NA":
            switch(cont2){
                case "EU":
                    return 0;
                break;

                case "AS":
                    return 3;
                break;

                case "OC":
                    return 5;
                break;
            }
            break;

        case "OC":
            switch(cont2){
                case "NA":
                    return 5;
                break;

                case "AS":
                    return 4;
                break;
            }
            break;

        case "SA":
            switch(cont2){
                case "EU":
                    return 1;
                    break;

                case "NA":
                    return 6;
                    break;
            }
            break;
    }
    return -1;
}

var timeMarker = function(v) {
    var uri, country, container;
    if(document.getElementById("uriContainer") != null) {
        document.getElementById("uriContainer").remove();
    }
    container = document.createElement("div");
    container.setAttribute('id', 'uriContainer');
    var opacity;
    var hourlySumForLabel = 0;
    var currentLabel;
    var linesToChange = [];
    var k;
    
    for(i = 0; i < addedEvents.length; i++) {
        if(map.hasLayer(layerContinents) && (Number(addedEvents[i][1]) == Number(v))) {
            document.getElementById("vanish_slider").disabled = true;

            //slider has moved forward
            if(Number(v) > Number(previousTime)) {
                var cont = findCountriesContinent(concepts2[i]["properties"]["country"]);
                var continentMarker = findContinentMarker(cont);
                var continentIndex = findContinentKey(cont);
                if(continentMarker != null) {
                    continentMarker.setOpacity(1);
                    articlesInContinents[continentIndex]++;
                    continentMarker.bindPopup("Continent code: " + cont + "<br />Number of markers: " + articlesInContinents[continentIndex]);
                    if(concepts2[i]["properties"]["source"] != "true") {
                        console.log(concepts2[i]["properties"]["sourceCountry"] + " " + cont);
                        var sourceCont = findCountriesContinent(concepts2[i]["properties"]["sourceCountry"]);
                        console.log();
                        var sourceContMarker = findContinentMarker(sourceCont);
                        var sourceContIndex = findContinentKey(sourceCont);
                        var lineIndex = findContinentLineIndex(cont, sourceCont);
                        if(lineIndex >= 0) {
                            continentLinesWeight[lineIndex] = continentLinesWeight[lineIndex] + 0.5;
                            continentLines[lineIndex].setStyle({opacity: 1, weight: continentLinesWeight[lineIndex]});
                        }
                    }
                }
            }
        }

            //slider has moved backward
        if(map.hasLayer(layerContinents) && Number(v) < Number(previousTime) && (Number(addedEvents[i][1]) == previousTime)) {
            document.getElementById("vanish_slider").disabled = true;
            var cont = findCountriesContinent(concepts2[i]["properties"]["country"]);
            if(cont != "") {
                var continentMarker = findContinentMarker(cont);
                var c = findContinentKey(cont);
                if(continentMarker != null) {
                    articlesInContinents[c]--;
                    if(articlesInContinents[c] <= 0) {
                        markers[c].setOpacity(0);
                    }
                    if(concepts2[i]["properties"]["source"] != "true") {
                        var sourceCont = findCountriesContinent(concepts2[i]["properties"]["sourceCountry"]);
                        var sourceContMarker = findContinentMarker(sourceCont);
                        var sourceContIndex = findContinentKey(sourceCont);
                        var lineIndex = findContinentLineIndex(cont, sourceCont);
                        if(lineIndex >= 0) {
                            if(continentLinesWeight[lineIndex] > 0.5) {
                                continentLinesWeight[lineIndex] = continentLinesWeight[lineIndex] - 0.5;
                                continentLines[lineIndex].setStyle({opacity: 1, weight: continentLinesWeight[lineIndex]});
                            } else {
                                continentLinesWeight[lineIndex] = 0;
                                continentLines[lineIndex].setStyle({opacity: 0, weight: continentLinesWeight[lineIndex]});
                            }
                        }
                    }
                }
                continentMarker.bindPopup("Continent code: " + cont + "<br />Number of markers: " + articlesInContinents[c]);
            }
        }
        

        if(Number(addedEvents[i][1]) <= Number(v) && map.hasLayer(layerActual)) {
            document.getElementById("vanish_slider").disabled = false;
            addedEvents[i][0].setOpacity(1);
            uri = concepts2[i]["properties"]["uri"];
            country = concepts2[i]["properties"]["country"];
            var title = concepts2[i]["properties"]["title"];
            var url = concepts2[i]["properties"]["url"];
            addedEvents[i][0].bindPopup("Title: " + title + "</br>Article URL: <a href=" + url + ">" + url + "</a></br>URI: <a href=" + uri + ">" + uri + "</a></br>Country: " + country);
            if(concepts2[i]["properties"]["source"] == "true") {
                currentLabel = concepts2[i]["properties"]["label"][0]["eng"];
                for(k = 0; k < linesToChange.length; k++) {
                    linesToChange[k].setStyle({weight: hourlySumForLabel});
                }
                linesToChange = [];
                hourlySumForLabel = 0;
            }
            if(concepts2[i]["properties"]["source"] == "false") {
                addedEvents[i][2].setText(null);
                addedEvents[i][2].setStyle({opacity: 1});
                addedEvents[i][2].setText('  ►  ', {repeat: false, center: true, offset: 7, attributes: {fill: 'black', 'font-size': '20px', opacity: 1}});
                if(concepts2[i]["properties"]["label"][0]["eng"] == currentLabel && Number(addedEvents[i][1]) == Number(v)) {
                    linesToChange[linesToChange.length] = addedEvents[i][2];
                    hourlySumForLabel++;
                }
            } else {

            var p = document.createElement("p");
            var a = document.createElement("a");
            var txt = document.createTextNode("Title: " + title);
            p.appendChild(txt);
            p.setAttribute("class", "title");
            container.appendChild(p);
            p = document.createElement("p");
            p.appendChild(a);
            txt = document.createTextNode("URI: " + uri);
            a.appendChild(txt);
            a.setAttribute('href', uri);
            container.appendChild(p);

            }
            if(forgetting && concepts2[i]["properties"]["source"] == "false") {
                opacity = 1 - (Number(v) - Number(addedEvents[i][1])) * 0.2;
                if(opacity < 0) {
                    opacity = 0;
                }
                addedEvents[i][0].setOpacity(opacity);
                addedEvents[i][2].setStyle({opacity: opacity});
                addedEvents[i][2].setText(null);
                addedEvents[i][2].setText('  ►  ', {repeat: false, center: true, offset: 7, attributes: {fill: 'black', 'font-size': '20px', opacity: opacity}});
            }
        } else {
            addedEvents[i][0].setOpacity(0);
            addedEvents[i][0].unbindPopup();
            if(concepts2[i]["properties"]["source"] == "false") {
                addedEvents[i][2].setStyle({opacity: 0});
                addedEvents[i][2].setText(null);
            }
        }
    }
    document.getElementsByClassName("overlay")[0].appendChild(container);
    previousTime = v;
}

map.addLayer(mytiles).setView([50.5, 5.0], 2);

hideOverlay = function() {
   document.getElementsByClassName("overlay")[0].style.width = 30 + "px";
   document.getElementsByClassName("overlay-button")[0].style.display = "none";
   document.getElementsByClassName("overlay-button")[1].style.display = "inline";
}

showOverlay = function() {
   document.getElementsByClassName("overlay")[0].style.width = 200 + "px";
   document.getElementsByClassName("overlay-button")[0].style.display = "inline";
   document.getElementsByClassName("overlay-button")[1].style.display = "none";
}

var paused = true;
var interval;

playVisualization = function() {
    if(paused == true) {
        paused = false;
        interval = setInterval(function(){
            if(paused != true) {
                document.getElementById("time_slider").value = time;
                document.getElementById("hourValue").innerHTML = time;
                timeMarker(time);
                time++;
                if(time > 23) {
                    window.clearInterval(interval);
                    paused = true;
                }
        }
        }, 1000);
    }
}

var repeatVisualization = function() {
    time = 0;
    document.getElementById("time_slider").value = time;
    document.getElementById("hourValue").innerHTML = time;
    document.getElementById("vanish_slider").disabled = false;
    window.clearInterval(interval);
    for(i = 0; i < addedEvents.length; i++) {
        addedEvents[i][0].setOpacity(0);
        addedEvents[i][0].unbindPopup();
        if(addedEvents[i][2] != null) {
            addedEvents[i][2].setStyle({opacity: 0});
            addedEvents[i][2].setText(null);
        }
        if(document.getElementById("uriContainer") != null) {
            document.getElementById("uriContainer").remove();
        }
    }

    for(i = 0; i < 7; i++) {
        continentLines[i].setStyle({opacity: 0, width: 0});
        continentLinesWeight[i] = 0;
    }
    for(i = 0; i < markers.length; i++) {
        markers[i].setOpacity(0);
    }
    paused = true;
    articlesInContinents = [0, 0, 0, 0, 0, 0, 0];
    previousTime = 0;
}

var pauseVisualization = function() {
    paused = true;
    window.clearInterval(interval);
}

var getSearch = function() {
    var val = document.getElementById("searchbar").value;
    if(val == "") {
        goBack();
        return;
    }
    var result = searchData(val);
    if(!result) {
        popup(val);
        document.getElementById("searchbar").value = "";
        document.getElementById("time_slider").value = 0;
        document.getElementById("hourValue").innerHTML = 0;
    } else {
        document.getElementsByClassName("slidercontainer")[0].style.display = "none";
        document.getElementsByClassName("go-back")[0].style.display = "block";
        map.addLayer(layerActual);
        if(map.hasLayer(layerCountries)) {
            map.removeLayer(layerCountries);
        }
        if(map.hasLayer(layerContinents)) {
            map.removeLayer(layerContinents);
        }
    }
}

//use addedEvents[i] = [marker, concepts2[i]["properties"]["time"], line] and concepts2 - properties -> label -> eng; properties -> country; properties -> title

function searchData(txt) {
    var i;
    txt = txt.toString().toLowerCase();
    var foundAny = false;
    while(document.getElementById("uriContainer") != null) {
        document.getElementById("uriContainer").remove();
    }

    for(i = 0; i < concepts2.length; i++) {
        addedEvents[i][0].setOpacity(0);
        addedEvents[i][0].unbindPopup();
        if(addedEvents[i][2] != null) {
            addedEvents[i][2].setStyle({opacity: 0});
            addedEvents[i][2].setText(null);
        }

        if(concepts2[i]["properties"]["label"][0]["eng"].toString().toLowerCase().indexOf(txt) != -1) {
            displayEvent(i);
            foundAny = true;
        } else if(concepts2[i]["properties"]["country"].toString().toLowerCase().indexOf(txt) != -1) {
                    displayEvent(i);
                    foundAny = true;
                } else if(concepts2[i]["properties"]["title"].toString().toLowerCase().indexOf(txt) != -1) {
                        displayEvent(i);
                        foundAny = true;
                    }
    }

    return foundAny;
}

var displayEvent = function(i) {
    addedEvents[i][0].setOpacity(1);
    var uri = concepts2[i]["properties"]["uri"];
    var country = concepts2[i]["properties"]["country"];
    var title = concepts2[i]["properties"]["title"];
    var url = concepts2[i]["properties"]["url"];
    addedEvents[i][0].bindPopup("Title: " + title + "</br>Article URL: <a href=" + url + ">" + url + "</a></br>URI: <a href=" + uri + ">" + uri + "</a></br>Country: " + country);
    var container = document.createElement("div");
    container.setAttribute('id', 'uriContainer');
    if(concepts2[i]["properties"]["source"] == "false") {
        addedEvents[i][2].setText(null);
        addedEvents[i][2].setStyle({opacity: 1});
        addedEvents[i][2].setText('  ►  ', {repeat: false, center: true, offset: 7, attributes: {fill: 'black', 'font-size': '20px', opacity: 1}});
    } else {
        console.log("wtf");
        var p = document.createElement("p");
        var a = document.createElement("a");
        var txt = document.createTextNode("Title: " + title);
        p.appendChild(txt);
        p.setAttribute("class", "title");
        container.appendChild(p);
        p = document.createElement("p");
        p.appendChild(a);
        txt = document.createTextNode("URI: " + uri);
        a.appendChild(txt);
        a.setAttribute('href', uri);
        container.appendChild(p);
        document.getElementById("sidebar").appendChild(container);
    }
}

var popup = function(txt) {
    confirm("No matching data for " + txt);
}

var goBack = function() {
    document.getElementsByClassName("slidercontainer")[0].style.display = "flex";
    document.getElementsByClassName("go-back")[0].style.display = "none";
    document.getElementById("searchbar").value = "";
    document.getElementById("time_slider").value = 0;
    document.getElementById("hourValue").innerHTML = 0;
     for(i = 0; i < addedEvents.length; i++) {
        addedEvents[i][0].setOpacity(0);
        addedEvents[i][0].unbindPopup();
        if(addedEvents[i][2] != null) {
            addedEvents[i][2].setStyle({opacity: 0});
            addedEvents[i][2].setText(null);
        }
         if(document.getElementById("uriContainer") != null) {
            document.getElementById("uriContainer").remove();
        }
    }

    if(Number(map.getZoom()) <= 2){
        //continents overlay
        map.addLayer(layerContinents);
        //if(map.hasLayer(layerCountries)) {
        //    map.removeLayer(layerCountries);
        //}
        //if(map.hasLayer(layerActual)) {
        //    map.removeLayer(layerActual);
        //}
    } else if(Number(map.getZoom()) == 3) {
        //countries overlay
        console.log("countries");
        map.addLayer(layerCountries);
        if(map.hasLayer(layerContinents)) {
            map.removeLayer(layerContinents);
        }
        if(map.hasLayer(layerActual)) {
            map.removeLayer(layerActual);
        }
    } else {
        //actual location overlay
        console.log("actual");
        map.addLayer(layerActual);
        if(map.hasLayer(layerCountries)) {
            map.removeLayer(layerCountries);
        }
        if(map.hasLayer(layerContinents)) {
            map.removeLayer(layerContinents);
        }
    }
}
