let amlMap = L.map("aml-map").setView([51.3739, 7.5448], 17),
    lstCoords = [51.3739, 7.54545],
    lstIcon = L.icon({
        iconUrl: "src/img/icon-lst.png",
        iconSize: [32, 37],
        popupAnchor: [7, -32],
        iconAnchor: [10, 35]
    }),
    updt = false,
    debug = false,
    updateTimer,
    marker,
    lst,
    mapElem;

L.tileLayer(
    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.maptiler.com/">Maptiler</a>',
        maxZoom: 18
    }
).addTo(amlMap);

L.Icon.Default.prototype.options.popupAnchor = [0, -40];
lst = L.marker(lstCoords, {
    icon: lstIcon
}).addTo(amlMap);
lst.bindPopup("Leitstelle");
lst.on("mouseover", function (e) {
    this.openPopup();
});
lst.on("mouseout", function (e) {
    this.closePopup();
});

// set innerHeight for map
mapElem = document.getElementById("aml-map");
mapElem.style.height = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20 + "px").toString();
amlMap.invalidateSize();

function sendData() {
    let numb = $("#phone-number").val();
    numb = numb.replace("+", "%2B");

    $.ajax({
        url: "src/php/request.php",
        type: "POST",
        timeout: 10000,
        dataType: "JSON",
        data: {
            phone: numb
        },
        beforeSend: function () {
            $(".request").css("display", "none");
            $(".loading").css("display", "block");
        },
        success: function (data) {
            if (data && data.error && !debug) {
                $(".loading").css("display", "none");
                $(".request").css("display", "block");
                $(".request").append(
                    "<div class='alert alert-danger' role='alert'>" + data.error + "</div>"
                );
            } else {
                if (debug) {
                    data = loadExampleData();
                } else {
                    data = JSON.parse(data);
                }

                if (data && data.length > 0) {
                    // take the latest location
                    let loc = data[0];

                    if (amlMap) {
                        $(".loading").css("display", "none");
                        $(".response").css("display", "block");

                        // build table with coordinates
                        createTable(data);

                        // insert data into input fields
                        for (let prop in loc) {
                            if ($("#" + prop).length > 0) {
                                if (prop == "location_source") {
                                    let wArr = ["wifi", "w"],
                                        gArr = ["gps", "g"];

                                    if (wArr.indexOf(loc[prop].toLowerCase()) > -1) $("#" + prop).val("wifi");
                                    if (gArr.indexOf(loc[prop].toLowerCase()) > -1) $("#" + prop).val("gps");
                                } else {
                                    $("#" + prop).val(loc[prop]);
                                }
                            }
                        }

                        // refresh map location and set marker
                        amlMap.setView(
                            [loc.location_latitude, loc.location_longitude],
                            17
                        );

                        marker = L.marker([
                            loc.location_latitude,
                            loc.location_longitude
                        ]).addTo(amlMap);

                        marker
                            .bindPopup("Der Anrufer befindet sich ungef&auml;hr hier.")
                            .openPopup();
                    }
                } else {
                    $(".loading").css("display", "none");
                    $(".request").css("display", "block");
                    $(".request").append(
                        "<div class='alert alert-warning alert-dismissible fade show' role='alert'>Es konnten keine Standortdaten ermittelt werden.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>"
                    );
                    $(".request #phone-number").focus();
                    window.setTimeout(function () {
                        $(".alert-warning")
                            .fadeTo(500, 0)
                            .slideUp(500, function () {
                                $(this).remove();
                            });
                    }, 4000);
                }
            }
        }
    });
}

function toggleRefresh() {
    $(".toggleRefreshBtn i").toggleClass("fa-spin");

    if (updt) {
        updt = false;
        clearInterval(updateTimer);
        document.getElementById("btn-timer").textContent = 15;
        $("#btn-timer").css("display", "none");
    } else {
        updt = true;
        $("#btn-timer").css("display", "inline-block");

        var counter = 15;
        updateTimer = setInterval(function () {
            counter--;
            document.getElementById("btn-timer").textContent = counter;
            if (counter == 0) {
                counter = 15;
                update();
            }
        }, 1000);
    }
}

function update() {
    $.ajax({
        url: "dist/php/request.php",
        type: "POST",
        dataType: "JSON",
        data: {
            phone: $("#number").val()
        },
        success: function (data) {
            data = JSON.parse(data);

            // debug
            if (debug) data = loadExampleData();

            if (data && data.length > 0) {
                // take the latest location
                let loc = debug
                    ? data[Math.floor(Math.random() * data.length)]
                    : data[0];

                createTable(data);

                if (amlMap) {
                    // insert updated data into input fields
                    for (let prop in loc) {
                        if ($("#" + prop).length > 0) {
                            if (prop == "location_source") {
                                let wArr = ["wifi", "w"],
                                    gArr = ["gps", "g"];

                                if (wArr.indexOf(loc[prop].toLowerCase()) > -1) $("#" + prop).val("wifi");
                                if (gArr.indexOf(loc[prop].toLowerCase()) > -1) $("#" + prop).val("gps");
                            } else {
                                $("#" + prop).val(loc[prop]);
                            }
                        }
                    }

                    // refresh map location and set marker
                    amlMap.setView(
                        [loc.location_latitude, loc.location_longitude],
                        17
                    );

                    let newLatLng = new L.LatLng(
                        loc.location_latitude,
                        loc.location_longitude
                    );
                    marker.setLatLng(newLatLng);

                    $(".response .button-container").append(
                        "<div class='alert alert-info alert-dismissible fade show' role='alert'>Die Positionsdaten wurden aktualisiert.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>"
                    );
                    window.setTimeout(function () {
                        $(".alert-info")
                            .fadeTo(500, 0)
                            .slideUp(500, function () {
                                $(this).remove();
                            });
                    }, 3000);
                }
            } else {
                clearInterval(updateTimer);
                $(".response").css("display", "none");
                $(".request").css("display", "block");
                $(".request").append(
                    "<div class='alert alert-warning alert-dismissible fade show' role='alert'>Die Standortdaten sind nicht mehr verfügbar.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>"
                );
                $(".request #phone-number").focus();
                window.setTimeout(function () {
                    $(".alert-warning")
                        .fadeTo(500, 0)
                        .slideUp(500, function () {
                            $(this).remove();
                        });
                }, 4000);

                // recreate standard view
                amlMap.setView([51.3739, 7.5448], 17);
                amlMap.removeLayer(marker);
            }
        }
    });
}

function createTable(data) {
    $("#coordinates-container").css("display", "block");
    let tmplData = { cords: data },
        container = document.getElementById("coordinates-container"),
        tmpl = $.templates("#tableTemplate");

    container.innerHTML = tmpl.render(tmplData);

    let elementsArray = document.querySelectorAll(".coordinates-table-button");

    elementsArray.forEach(function (elem) {
        elem.addEventListener("click", function (event) {
            switchToPosition(event.currentTarget.parentElement.parentElement);
        });
    });
}

function switchToPosition(tr) {
    let lat = tr.dataset.location_latitude,
        lng = tr.dataset.location_longitude;

    amlMap.removeLayer(marker);
    amlMap.setView([lat, lng], 17);
    marker = L.marker([lat, lng]).addTo(amlMap);
    marker.bindPopup("Der Anrufer befindet sich ungef&auml;hr hier.").openPopup();

    // update input fields with current selected position data
    for (let prop in tr.dataset) {
        if ($("#" + prop).length > 0) {
            if (prop == "location_source") {
                let wArr = ["wifi", "w"],
                    gArr = ["gps", "g"];

                if (wArr.indexOf(tr.dataset[prop].toLowerCase()) > -1) $("#" + prop).val("wifi");
                if (gArr.indexOf(tr.dataset[prop].toLowerCase()) > -1) $("#" + prop).val("gps");
            } else {
                $("#" + prop).val(tr.dataset[prop]);
            }
        }
    }
}

function toggleMapHeight() {
    let btn = document.getElementById("toggleMapHeight");

    if (btn && btn.children[0].classList.contains("fa-compress")) {
        btn.children[0].classList.remove("fa-compress");
        btn.children[0].classList.add("fa-expand");

        mapElem.style.height = (450 + "px").toString();
        amlMap.invalidateSize();
    } else if (btn && btn.children[0].classList.contains("fa-expand")) {
        btn.children[0].classList.remove("fa-expand");
        btn.children[0].classList.add("fa-compress");

        mapElem.style.height = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20 + "px").toString();
        amlMap.invalidateSize();
    }
}

function openGoogleMaps() {
    let lat = $('#location_latitude').val().replace(",", "."),
        lng = $('#location_longitude').val(),
        url = 'http://maps.google.com/maps?t=k&q=loc:' + lat + ',' + lng;

    window.open(url);
}

function loadExampleData() {
    return [
        {
            location_latitude: 51.3512,
            location_longitude: 7.445,
            location_time: "2019-10-17 09:27:29"
        },
        {
            location_latitude: 51.4028,
            location_longitude: 7.4758,
            location_time: "2019-10-17 09:27:29"
        },
        {
            location_latitude: 51.3849,
            location_longitude: 7.4794,
            location_time: "2019-10-17 09:27:29"
        },
        {
            location_latitude: 51.3555,
            location_longitude: 7.4722,
            location_time: "2019-10-17 09:27:29"
        }
    ];
}

$('#sendButton').on('click', function () {
    sendData();
});

$('#googleMaps').on('click', function () {
    openGoogleMaps();
});

$('#reloadPage').on('click', function () {
    location.reload();
});

$('#toggleMapHeight').on('click', function () {
    toggleMapHeight();
});