# Advanced Mobile Location
AML (Advanced Mobile Location) is a location-based service available on smartphones for emergency purposes. When dialing the local emergency dial number (112), it sends the best available geolocation of the caller to an dedicated endpoint for making the location avaiable for the emergency call taker.

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
To get things work, you have to modify the `config.php` and enter your individual user data and passwords. Don't forget to add the relative path to the certificate. **NOTICE:** Be sure that the certificate is in `.pem` format and not `p.12`!

### Example configuration file
```php
<?php
$curl_url = "https://url-to-server:port/get-data?number=";
$curl_sslcert = "C:\\relative\\path\\to\\certificate.pem";
$curl_sslcertpasswd = "ssl-certificate-password";
$curl_user_agent = "Command Center FooBar";
$curl_userpwd = "foo:bar";
```

## License
Software is licensed under [GNU GPL 3.0](https://github.com/erfurtjohn/advanced-mobile-location/blob/master/LICENSE).
