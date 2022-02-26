# Advanced Mobile Location

AML (Advanced Mobile Location) ist ein Dienst zur Positionsbestimmung von Anrufern bei Nutzung einer Notrufnummer. Wird eine für AML verfügbare Notrufnummer gewählt, aktiviert das Mobilgerät automatisch GPS und WLAN und sendet - sobald das Gerät einen Standort ermitteln konnte - über SMS oder HTTPS alle verfügbaren Standortdaten an einen Endpunkt. An diesem Endpunkt können BOS-Leitstellen die entsprechenden Daten abgreifen.

In der Software kann eine Mobilfunknummer eingegeben werden, für die im Nachgang bei der entsprechenden Stelle die Standortdaten abgerufen werden, welche u.a. den Breitengrad, Längengrad und Genauigkeit beinhalten.

**Weitere Informationen:**

- [Wikipedia](https://de.wikipedia.org/wiki/Advanced_Mobile_Location)
- [Google ELS](https://www.android.com/safety/emergency-help/emergency-location-service/)

**Presse:**

- https://www.iphone-ticker.de/notruf-sendet-position-aml-unterstuetzung-startet-in-deutschland-148070/
- https://www.tagesschau.de/inland/notruf-standort-technik-101.html
- https://www.rettungsdienst.de/tipps-wissen/erste-hilfe-notruf-ortung-ueber-das-smartphone-54314
- https://www.heise.de/mac-and-i/meldung/Standortuebermittlung-bei-Notruf-Apple-unterstuetzt-nun-AML-in-Deutschland-4614976.html
- https://www.logitel.de/blog/handys/notrufsystem-aml/

## Anforderungen

Zum Betrieb der Anwendung wird nodeJS benötigt und ein entsprechend fähiger Webserver. Außerdem wird ein Clientzertifikat benötigt, sowie die Zugangsdaten der HTTP Basic Authentifikation. Das notwendige Zertifikat kann bei der [LSt Freiburg](https://ils-freiburg.de/standortdaten.php) beantragt werden.

## Konfiguration

Folgende Umgebungsvariablen können in der `.env` Datei angepasst werden:

| Variable            | Funktion                                                                     |
| ------------------- | ---------------------------------------------------------------------------- |
| API_HOST            | Host der API                                                                 |
| API_PATH            | Pfad der API                                                                 |
| API_PORT            | Port der API                                                                 |
| API_AUTH            | Authentisierung der API (Basic username:password)                            |
| CENTERED_MAP        | Koordinaten (Breitengrad, Längengrad) an der die Karte zentriert werden soll |
| CONTROL_CENTER      | Koordinaten (Breitengrad, Längengrad) an der die LSt markiert werden soll    |
| CONTROL_CENTER_NAME | Bezeichnung des LSt Markers                                                  |
| TILE_SERVER         | Adresse des OSM Tile Servers.                                                |
| DEV                 | Setzt den Testmodus; zeigt die Funktion anhand von Beispieldaten             |

Die Anwendung nutzt kostenlose OSM Tile Server, welche für die Darstellung der Karte benötigt werden. Alternative Tile Server sind [hier](https://wiki.openstreetmap.org/wiki/Tile_servers) zu finden. Optionale und u.U. kostenpflichtige Server gibt es [hier](https://maptiler.com). In der Regel wird aber jede Leitstelle einen eigenen WMS Server betreiben.

## Installation

Den aktuellen Release (> 3.0) herunterladen und einfach auf den entsprechenden Server hochladen. Im Anschluss alle benötigten Pakete mit dem Befehl `npm i` installieren und das Projekt erstellen: `npm run build`. Zuletzt kann die Anwendung mit `npm run start` gestartet werden.

### Client Zertifikat

Aus der erhaltenen `.p12` Zertifikatsdatei muss das Zertifikat und der Key extrahiert werden. Dazu können die folgenden Befehle benutzt werden:

```
openssl pkcs12 -in aml.p12 -out aml.crt.pem -clcerts -nokeys
openssl pkcs12 -in aml.p12 -out aml.key.pem -nocerts -nodes
```

Die extrahierten `.pem` Dateien müssen dann einfach im Hauptverzeichnis abgelegt werden.

## Beispieldaten einer AML-Abfrage

Als Antwort erhält man vom Endpunkt AML-Daten im JSON Format: Ein Array von Objekten. Jedes einzelne Objekt repräsentiert eine Geolocation.

```json
[
	{
		"status": "ok",
		"number": "1234567890",
		"emergency_number": 112,
		"time": "2022-02-26 09:26:55",
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

## License

Software is licensed under [GNU GPL 3.0](https://github.com/erfurtjohn/advanced-mobile-location/blob/master/LICENSE).
