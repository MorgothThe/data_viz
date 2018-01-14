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
q = QueryArticles(
    dateStart = datetime.date(2017, 12, 1), dateEnd = datetime.date(2018, 1, 1),
    conceptUri = er.getConceptUri("Breaking News"))
q.addRequestedResult(RequestArticlesInfo(count = 100, returnInfo = ReturnInfo(sourceInfo = SourceInfoFlags(location = True), articleInfo = ArticleInfoFlags(title = True, body = False, url = True, categories = True, location = False, originalArticle = True, duplicateList = True))))
res = er.execQuery(q)
print (res)
#%%
#print (res)
for i in res:
    if 'location' in i:
        print (res)
#%%
geojson = [];
for i in res:
    if not 'location' is None:
        geojson.append({
            "type": "FeatureCollection",
            "features":
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [i['location']],
                },
                "properties": {
                    "title": [i['title']],
                    "uri": [i['uri']],
                    "body": [i['body']],
                }
            }
        })
#%%
print (geojson)
