#%%
import eventregistry
from eventregistry import *
import json
import os
import re
import sys
import logging
from pygeocoder import Geocoder

#%%
er = EventRegistry(apiKey = 'd1be7f12-b8a2-48d0-8596-998d6ff3803d')
#q = GetTrendingConcepts(source = "news", count = 10)
#q = QueryEvents()
q = GetTrendingConcepts(source = "news", count = 100, returnInfo = ReturnInfo(locationInfo = LocationInfoFlags(label = True,
    wikiUri = False,
    geoNamesId = False,
    population = False,
    geoLocation = True,
    countryArea = False,
    countryDetails = False,
    countryContinent = False,
    placeFeatureCode = False,
    placeCountry = True), eventInfo = EventInfoFlags(title = True,
    summary = False,
    articleCounts = False,
    concepts = False,
    categories = True,
    location = False,
    date = True,
    commonDates = False,
    stories = False,
    socialScore = False,
    imageCount = 0)))
#q.addRequestedResult(RequestEventsInfo(sortBy = "date", count=10))
res = [];
res = er.execQuery(q)

#%%
data = json.dumps(res)
print (data)
print (res[2]['location']['long'])
#%%
geojson = [];
for i in res:
    if 'location' in i:
        geojson.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [i['location']['long'], i['location']['lat']],
            },
            "properties": {
                "uri": [i['uri']],
                "label": [i['label']],
                "country": [i['location']['country']['label']['eng']],
            }
        })
#%%
print (geojson)

#%% Constants
OUT_FILENAME = 'concepts2.geojson'

#%% Checking/creating a merged file
if not os.path.exists(OUT_FILENAME):
    with open(OUT_FILENAME, 'w'):
        pass

#%%
with open('concepts2.geojson', 'w') as fout:
    fout.write(json.dumps(geojson, indent=4))
