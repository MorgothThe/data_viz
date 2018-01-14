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
console.log("json [0]: " + L.geoJson(concepts2[0]));

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

var addedEvents = [];
for(i = 0; i < concepts2.length; i++) {
    addedEvents[i] = [];
    if(concepts2[i]["properties"]["source"] == "true"){
        marker = L.marker([parseFloat(concepts2[i]["geometry"]["coordinates"][1]),parseFloat(concepts2[i]["geometry"]["coordinates"][0])], {icon: pinkIcon});
        line = null;
    } else {
        console.log(concepts2[i]["properties"]["source"]);
        marker = L.marker([parseFloat(concepts2[i]["geometry"]["coordinates"][1]),parseFloat(concepts2[i]["geometry"]["coordinates"][0])], {icon: greenIcon});
        var latlng = [
                    [parseFloat(concepts2[i]["properties"]["sourceCoordinates"][1]), parseFloat(concepts2[i]["properties"]["sourceCoordinates"][0])],
                    [parseFloat(concepts2[i]["geometry"]["coordinates"][1]), parseFloat(concepts2[i]["geometry"]["coordinates"][0])]
                ];
        line = L.polyline(latlng , {color: '#081B2B', weight: 0.5});            
    }
    marker.addTo(map);
    marker.setOpacity(0);
    if(line != null) {
        line.addTo(map);
        line.setStyle({opacity: 0});
    }
    addedEvents[i] = [marker, concepts2[i]["properties"]["time"], line];
}

document.getElementById("time_slider").oninput = function() {
    myFunction();
};

// var test = L.marker([-36, 174]).addTo(map);
// test.setOpacity(.5);

function myFunction() {
   var val = document.getElementById("time_slider").value; //gets the oninput value
   // document.getElementById('output').innerHTML = val; //displays this value to the html page
   console.log(val);
   timeMarker(val);
   time = val;
}  

var timeMarker = function(v) {
    var uri, country, container;
    if(document.getElementById("uriContainer") != null) {
        document.getElementById("uriContainer").remove();
    }
    container = document.createElement("div");
    container.setAttribute('id', 'uriContainer');
    
    for(i = 0; i < addedEvents.length; i++) {
        if(Number(addedEvents[i][1]) <= Number(v)) {
            addedEvents[i][0].setOpacity(1);
            uri = concepts2[i]["properties"]["uri"];
            country = concepts2[i]["properties"]["country"];
            var title = concepts2[i]["properties"]["title"];
            var url = concepts2[i]["properties"]["url"];
            addedEvents[i][0].bindPopup("Title: " + title + "</br>Article URL: <a href=" + url + ">" + url + "</a></br>URI: <a href=" + uri + ">" + uri + "</a></br>Country: " + country);

            if(concepts2[i]["properties"]["source"] == "false") {
                addedEvents[i][2].setStyle({opacity: 1});
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
        } else {
            addedEvents[i][0].setOpacity(0);
            addedEvents[i][0].unbindPopup();
            if(concepts2[i]["properties"]["source"] == "false") {
                addedEvents[i][2].setStyle({opacity: 0});
            }
        }
    }
    document.getElementsByClassName("overlay")[0].appendChild(container);
}

var timeMarker2 = function (v) {
    var uri, label, p, txt, country, countryAdded, cords1, cords2, addedEvents = [], eventsNo = 0;
    for(i = 0; i < concepts2.length; i++) {
        arr = concepts2[i];
        if(arr["properties"]["time"] <= v) {
            marker = L.marker([parseFloat(concepts2[i]["geometry"]["coordinates"][1]),parseFloat(concepts2[i]["geometry"]["coordinates"][0])], {icon: pinkIcon}).addTo(map);
            addedEvents[eventsNo] = [];
            addedEvents[eventsNo] = [marker, arr["properties"]["time"]]
            
            if(sliderPrevVal > v) {
            //subtracting                
                for(var j = 0; j < addedEvents.length; j++) {
                    if(addedEvents[j][1] > v) {
                        addedEvents[j][0].setOpacity(0);
                    } else {
                        addedEvents[j][0].setOpacity(1);
                    }
                }
            } else {
                //adding
                for(key in arr) {
                    if(key == "geometry") {
                        arr2 = arr[key];
                        cords1 = parseFloat(arr2["coordinates"][0]);
                        cords2 = parseFloat(arr2["coordinates"][1]);
                    }
                    if(key == "properties") {
                        arr2 = arr[key];
                        for(key2 in arr2) {
                            if(key2 == "uri"){
                                //marker.bindPopup("URI: <a href=" + arr2[key2] + ">" + arr2[key2] + "</a>");
                                // console.log(typeof(arr2[key2][0]));
                                uri = arr2[key2];
                                p = document.createElement("p");
                                a = document.createElement("a");
                                p.appendChild(a);
                                txt = document.createTextNode("URI: " + uri);
                                a.appendChild(txt);
                                a.setAttribute('href', uri);
                                document.getElementsByClassName("overlay")[0].appendChild(p);
                            }
                            if(key2 == 'country'){
                                marker.bindPopup("URI: <a href=" + arr2["uri"] + ">" + arr2["uri"] + "</a></br>Country: " + arr2[key2]);

                                if(arrOfCountries[0][1] == 0) {
                                    arrOfCountries[0][0] = arr2[key2];
                                    arrOfCountries[0][1] = 1;
                                    console.log("hello " + arrOfCountries[0][0] + " " + arrOfCountries[0][1]);
                                } else {
                                    country = arr2[key2];
                                    countryAdded = false;
                                    var c;
                                    console.log("length: " + arrOfCountries.length);
                                    for(c = 0; c < arrOfCountries.length; c++) {
                                        if(String(arrOfCountries[c][0]) == String(arr2[key2])) {
                                            arrOfCountries[c][1] = arrOfCountries[c][1] + 1;
                                            console.log("IMPORTANT country info: " + country + " " + arrOfCountries[c][1]);

                                            if(arrOfCountries[c][1] == 2) {
                                                var circle = L.circle([cords2, cords1], 500000, 
                                                {
                                                    color: 'red',
                                                    fillColor: '#f03',
                                                    fillOpacity: 0.5
                                                }
                                                ).addTo(map);
                                                circle.bindPopup("Number pf concepts: " + arrOfCountries[c][1]);
                                            }
                                            countryAdded = true;
                                            c = arrOfCountries.length - 1;
                                        }
                                    }

                                    if(countryAdded == false) {
                                        //console.log("arr length: " + arrOfCountries.length);
                                        arrOfCountries[arrOfCountries.length] = [];
                                        arrOfCountries[arrOfCountries.length - 1] = [arr2[key2], 1];
                                        //console.log("last " + arrOfCountries[arrOfCountries.length - 1][0] + " " + arrOfCountries[arrOfCountries.length - 1][1]);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
    }
    sliderPrevVal = v;
};



console.log("point 2");

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
    paused = false;
    interval = setInterval(function(){
        if(paused != true) {
            document.getElementById("time_slider").value = time;
            timeMarker(time);
            time++;
            if(time > 23) {
                window.clearInterval(interval);
            }
        }
    }, 1000);
}

var repeatVisualization = function() {
    time = 0;
    document.getElementById("time_slider").value = time;
    window.clearInterval(interval);
    for(i = 0; i < addedEvents.length; i++) {
        addedEvents[i][0].setOpacity(0);
        if(addedEvents[i][2] != null) {
            addedEvents[i][2].setStyle({opacity: 0});
        }
    }
    document.getElementById("uriContainer").remove();
    paused = true;
}

var pauseVisualization = function() {
    paused = true;
    window.clearInterval(interval);
}