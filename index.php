<!DOCTYPE html>
<html>

<head>
    <title>AML Standortabfrage</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="./dist/css/style.css">
    <link href="lib/fontawesome/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="" />

    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js" integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==" crossorigin=""></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrender/1.0.5/jsrender.min.js"></script>

    <script id="tableTemplate" type="text/x-jsrender">
        <table class="table table-striped table-hover" id="coordinates-table">
            <thead>
                <tr>
                    <th colspan="5">Liste der Koordinaten</th>
                </tr>
                <tr>
                    <th>Datum / Uhrzeit</th>
                    <th>Breitengrad</th>
                    <th>Längengrad</th>
                    <th>Horiz. Genauigkeit (m)</th>
                    <th></th>
                </tr>
            </thead>

            <tbody id="coordinates-table-body">
                {{for cords}}
                    <tr 
                    class="coord-row" 
                    data-location_latitude="{{:location_latitude}}" 
                    data-location_longitude="{{:location_longitude}}"
                    data-location_altitude="{{:location_altitude}}"
                    data-location_floor="{{:location_floor}}"
                    data-location_source="{{:location_source}}"
                    data-location_accuracy="{{:location_accuracy}}"
                    data-location_accuracy-vert="{{:location_vertical_accuracy}}"
                    data-location_confidence="{{:location_confidence}}"
                    data-location_bearing="{{:location_bearing}}"
                    data-location_speed="{{:location_speed}}"
                    >
                        <td>{{:location_time}}</td>
                        <td>{{:location_latitude}}</td>
                        <td>{{:location_longitude}}</td>
                        <td>{{:location_accuracy}}</td>
                        <td><button class="btn btn-primary coordinates-table-button">Anzeigen</button></td>
                    </tr>
                {{/for}}
            </tbody>
        </table>
    </script>
</head>

<body>
    <div class="container-fluid content">
        <div class="row">
            <div class="col-md-8 map-container">
                <div id="aml-map"></div>

                <div id="coordinates-container"></div>
            </div><!-- map-container -->

            <div class="col-md-4 request-form">
                <h4>AML Standortabfrage</h4>
                <hr>

                <div class="request">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
                        </div>
                        <input type="text" id="phone-number" class="form-control" placeholder="0175123456" aria-label="number">
                    </div>

                    <button id="sendButton" class="btn btn-primary">Abfragen</button>
                </div><!-- request -->

                <div class="loading">
                    <div class="alert alert-warning">
                        <i class="fas fa-sync fa-spin"></i> Daten werden vom Server abgefragt...
                    </div>
                </div>

                <div class="response">
                    <div class="button-container">
                        <button id="googleMaps" class="btn btn-primary">Google Satellitenbild</button>
                        <button id="reloadPage" class="btn btn-success">Neue Abfrage</button>
                        <button id="toggleMapHeight" class="btn btn-secondary" id="toggleMapHeight"><i class="fas fa-compress"></i></button>
                        <button id="toggleRefresh" class="btn btn-danger toggleRefreshBtn hidden"><i class="fas fa-sync"></i></button>
                        <button class="btn btn-light hidden" id="btn-timer">15</button>
                    </div>

                    <div class="form-group row">
                        <label for="number" class="col-sm-6 col-form-label">Handynummer</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="number">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_latitude" class="col-sm-6 col-form-label">Breitengrad</label>
                        <div class="col-sm-6">
                            <input readonly type="number" class="form-control" id="location_latitude" placeholder="51.37390">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_longitude" class="col-sm-6 col-form-label">Längengrad</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_longitude">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_altitude" class="col-sm-6 col-form-label">Höhe (über NN in m)</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_altitude">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_floor" class="col-sm-6 col-form-label">Stockwerk</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_floor">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_source" class="col-sm-6 col-form-label">Quelle</label>
                        <div class="col-sm-6">
                            <select disabled class="custom-select" id="location_source">
                                <option value="wifi">WiFi</option>
                                <option value="cell">Funkzelle</option>
                                <option value="gps">GPS</option>
                                <option selected value="unknown">Unbekannt</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_accuracy" class="col-sm-6 col-form-label">Horiz. Genauigkeit (m)</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_accuracy">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_vertical_accuracy" class="col-sm-6 col-form-label">Vert. Genauigkeit (m)</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_vertical_accuracy">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_confidence" class="col-sm-6 col-form-label">Vertrauenswürdigkeit (%)</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_confidence">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_bearing" class="col-sm-6 col-form-label">Kurs der Person (°)</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_bearing">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="location_speed" class="col-sm-6 col-form-label">Geschwindigkeit</label>
                        <div class="col-sm-6">
                            <input readonly type="text" class="form-control" id="location_speed">
                        </div>
                    </div>
                </div><!-- response -->
            </div><!-- request-form -->
        </div><!-- row -->
    </div><!-- container -->

    <script type="text/javascript" src="dist/js/script.js"></script>
</body>

</html>