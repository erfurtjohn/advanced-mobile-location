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

### Changing marker position of command center

### Include tile server for leaflet
For displaying the map you will need an open street map tile server. A list of some available servers can be found [here](https://wiki.openstreetmap.org/wiki/Tile_servers). I recommend to use [maptiler.com](https://maptiler.com). To access the tile database you need to create a [account](https://www.maptiler.com/cloud/plans/) whose use is free up to 100.000 requests/month.

Choose a map and copy the api link from maptiler and insert it where the tile layer is added to the map.
```javascript
L.tileLayer(
    "https://api-link-from-maptiler",
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
        maxZoom: 18
    }
).addTo(mymap);
```

## License
Software is licensed under [GNU GPL 3.0](https://github.com/erfurtjohn/advanced-mobile-location/blob/master/LICENSE).
