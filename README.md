# Advanced Mobile Location
![aml-preview](https://erfurtjohn.de/images/aml.gif)

AML (Advanced Mobile Location) is a location-based service available on smartphones for emergency purposes. When dialing the local emergency dial number (112), it sends the best available geolocation of the caller to an dedicated endpoint for making the location avaiable for the emergency call taker.

This simple software allows you to enter a cell phone number which location will be visualized on a open street map with all its location information like latitude, longitude, accuracy and much more.

**More information:**
* [Wikipedia](https://en.wikipedia.org/wiki/Advanced_Mobile_Location)
* [Google ELS](https://crisisresponse.google/emergencylocationservice/how-it-works/)

**Press:**
* https://www.iphone-ticker.de/notruf-sendet-position-aml-unterstuetzung-startet-in-deutschland-148070/
* https://www.tagesschau.de/inland/notruf-standort-technik-101.html
* https://www.rettungsdienst.de/tipps-wissen/erste-hilfe-notruf-ortung-ueber-das-smartphone-54314
* https://www.heise.de/mac-and-i/meldung/Standortuebermittlung-bei-Notruf-Apple-unterstuetzt-nun-AML-in-Deutschland-4614976.html

## Requirements
You will need a installed and running webserver like Apache or nginx with modules _php_ and _curl_ enabled. Furthermore you will need the SSL certificate, it's password and the user data for the HTTP basic authentication. The certificate, it's password and the user data can be requested at the [control center of Freiburg](https://ils-freiburg.de/standortdaten.php) / [public-safety answering point (PSAP) of Freiburg](https://ils-freiburg.de/standortdaten.php). This repository is managed with npm, it requires node.js (npm) for installing it's required packages.

## Configuration
To get things work, you have to modify the `config.php` and enter your individual user data and passwords. Don't forget to add the relative path to the certificate. **NOTICE:** Be sure that the certificate is in `.pem` format and not `.p12`!
To fit the application for your needs, you can edit the lines 62-65 in `index.html` to display your correct control center, center the map, use the correct tile server and set debug mode to on/off.

### Example php configuration file
```php
<?php
$curl_url = "https://url-to-server:port/get-data?number=";
$curl_sslcert = "C:\\relative\\path\\to\\certificate.pem";
$curl_sslcertpasswd = "ssl-certificate-password";
$curl_user_agent = "Command Center FooBar";
$curl_userpwd = "foo:bar";
```

### Changing default position of marker
To change the default position of the command center marker, you just need to replace the coordinates of the variable `controlCenter` in `index.html`.

### Changing center position of map
Basically replace the coordinates from the variable `centeredView` in `index.html`.

### Changing tile server
This software makes use of the free open street map tile server, which is required for displaying the map. To change the tile server just replace the url string for the variable `tileServer` in `index.html`.

A list of some available servers can be found [here](https://wiki.openstreetmap.org/wiki/Tile_servers). An optional tile server can be found on [maptiler.com](https://maptiler.com) (registration required).

### Example configuration
The default configuration will look like the following code snippet:
```javascript
let centeredView = [51.37390, 7.54550],
    controlCenter = [51.3739, 7.54545],
    tileServer = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    debug = true;
```

## Debug mode
The application comes with a small "debug mode". You can enable it in `index.html` if you set the value of variable `debug` to `true`. If you did so, you can enter any value in the phone number input field. Some example data will be loaded to display the functionallity of the application.

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
