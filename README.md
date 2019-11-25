# Advanced Mobile Location
AML (Advanced Mobile Location) is a location-based service available on smartphones for emergency purposes. When dialing the local emergency dial number (112), it sends the best available geolocation of the caller to an dedicated endpoint for making the location avaiable for the emergency call taker.

This simple software was developed by the [office for fire and civil protection](https://www.hagen.de/web/de/fachbereiche/fb_37/fb_37_01/startseite.html) of Hagen, Germany. It allows you to enter a cell phone number whose location will be visualized on a open street map with all its location information like latitude, longitude, accuracy and much more.

**More information:**
* [Wikipedia](https://en.wikipedia.org/wiki/Advanced_Mobile_Location)
* [Google ELS](https://crisisresponse.google/emergencylocationservice/how-it-works/)

**Press:**
* https://www.iphone-ticker.de/notruf-sendet-position-aml-unterstuetzung-startet-in-deutschland-148070/
* https://www.tagesschau.de/inland/notruf-standort-technik-101.html
* https://www.rettungsdienst.de/tipps-wissen/erste-hilfe-notruf-ortung-ueber-das-smartphone-54314

## Requirements
You will need a installed and running webserver like Apache or nginx with modules _php_ and _curl_ enabled. Furthermore you will need the SSL certificate, it's password and the user data for the HTTP basic authentication. The certificate, it's password and the user data can be requested at the [control center of Freiburg](https://ils-freiburg.de/standortdaten.php) / [public-safety answering point (PSAP) of Freiburg](https://ils-freiburg.de/standortdaten.php).

## Configuration
To get things work, you have to modify the `config.php` and enter your individual user data and passwords. Don't forget to add the relative path to the certificate. **NOTICE:** Be sure that the certificate is in `.pem` format and not `.p12`!

### Example configuration file
```php
<?php
$curl_url = "https://url-to-server:port/get-data?number=";
$curl_sslcert = "C:\\relative\\path\\to\\certificate.pem";
$curl_sslcertpasswd = "ssl-certificate-password";
$curl_user_agent = "Command Center FooBar";
$curl_userpwd = "foo:bar";
```

### Changing default position of marker
To change the default position of the command center marker, just replace the coordinates set for the variable `lstCoords` in file `src/js/script.js`.

### Changing default view of map
In file `src/js/script.js` variable `amlMap` is initialized. Change the given coordinates in `setView()` to your needs like this:
```javascript
    let amlMap = L.map("aml-map").setView([<your_latitude>, <your_longitude>], 17)
```

### Optional tile server for leaflet
This software makes use of the free open street map tile server, which is required for displaying the map. A list of some available servers can be found [here](https://wiki.openstreetmap.org/wiki/Tile_servers). An optional tile server can be found on [maptiler.com](https://maptiler.com) (registration required).

To use an optional tile server copy and paste the api link where the tile layer is added to the map.
```javascript
L.tileLayer(
    "https://api-link-from-maptiler",
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
        maxZoom: 18
    }
).addTo(amlMap);
```

## Example AML data
As a result from the endpoint you will get an json response: An array of objects - each will represent a geolocation.

```json
[
    {
        "status": "ok",
        "number": "1234567890",
        "emergency_number": 112,
        "time": "2019-111-21 09:26:55",
        "location_latitude": "51.3739",
        "location_longitude": "7.54545",
        "location_time": "2019-11-21 09:26:56",
        "location_altitude": "160.5",
        "location_floor": "",
        "location_source": "wifi",
        "location_accuracy": "15.515",
        "location_vertical_accuracy": "2.5",
        "location_confidence": "0.6826895",
        "location_bearing": "286.43103",
        "location_speed": "0.08748341"
    }
]
```

## Leaflet documentation
The leaflet API documentation can be found [here](https://leafletjs.com/reference-1.6.0.html).

## License
Software is licensed under [GNU GPL 3.0](https://github.com/erfurtjohn/advanced-mobile-location/blob/master/LICENSE).
