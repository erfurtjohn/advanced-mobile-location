class AML {
    constructor(centeredView, controlCenterC, tileServer, debug) {
        this.map = L.map("aml-map").setView(centeredView, 17);
        this.tile = tileServer;
        this.cc = controlCenterC;
        this.ccMarker;
        this.phone;
        this.coordinates;
        this.locMarker;
        this.buttons = {
            showAllCoordinates: undefined,
            refresh: undefined
        };
        this.debugMode = debug;

        this.init();
    }

    init() {
        L.tileLayer(
            this.tile,
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 18
            }
        ).addTo(this.map);

        this.createControlCenterIcon();
        this.createControls();
    }

    createControlCenterIcon() {
        let ccIcon = L.icon({
            iconUrl: "src/img/icon-lst.png",
            iconSize: [32, 37],
            popupAnchor: [7, -32],
            iconAnchor: [10, 35]
        });

        L.Icon.Default.prototype.options.popupAnchor = [0, -40];

        this.ccMarker = L.marker(this.cc, {
            icon: ccIcon
        }).addTo(this.map);

        this.ccMarker.bindPopup("Leitstelle");
        this.ccMarker.on("mouseover", function (e) {
            this.openPopup();
        });
        this.ccMarker.on("mouseout", function (e) {
            this.closePopup();
        });
    }

    createControls() {
        let ctx = this,
            btns;

        this.buttons.showAllCoordinates = L.easyButton({
            states: [{
                stateName: 'show-all-coordinates',
                icon: 'far fa-eye',
                title: 'Alle Koordinaten anzeigen',
                onClick: function (control) {
                    ctx.showAllCoordinates();
                    control.state('hide-all-coordinates');
                }
            }, {
                icon: 'far fa-eye-slash',
                stateName: 'hide-all-coordinates',
                onClick: function (control) {
                    ctx.hideAllCoordinates();
                    control.state('show-all-coordinates');
                },
                title: 'Alle Koordinaten verstecken'
            }]
        });

        this.buttons.refresh = L.easyButton('<span class="fas fa-sync-alt"></span>', function () {
            ctx.refreshData();
        }, "Aktualisieren");

        btns = [
            L.easyButton('<span class="fab fa-github"></span>', function () {
                window.open("https://github.com/erfurtjohn/advanced-mobile-location", "_blank");
            }, "AML on GitHub"),
            this.buttons.showAllCoordinates,
            this.buttons.refresh
        ];

        L.easyBar(btns).addTo(this.map);
        this.buttons.showAllCoordinates.disable();
        this.buttons.refresh.disable();
    }

    locate(phone) {
        if (phone) {
            this.phone = phone;

            if (!this.debugMode) {
                let ctx = this;

                $.ajax({
                    url: "src/php/request.php",
                    type: "POST",
                    timeout: 10000,
                    dataType: "JSON",
                    data: {
                        phone: phone
                    },
                    success: function (data) {
                        ctx.coordinates = data;
                        ctx.positionate(data);
                        ctx.buttons.showAllCoordinates.enable();
                        ctx.buttons.refresh.enable();
                    }
                });
            }

            if (this.debugMode) {
                this.buttons.showAllCoordinates.enable();
                this.buttons.refresh.enable();
                this.positionate(this.getExampleData());
            }
        }
    }

    getExampleData() {
        return [
            {
                location_latitude: 51.3512,
                location_longitude: 7.445,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "89.567",
                location_vertical_accuracy: "2.5",
                location_altitude: "160.5",
                location_source: "wifi",
            },
            {
                location_latitude: 51.4028,
                location_longitude: 7.4758,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "15.515",
                location_vertical_accuracy: "2.5",
                location_altitude: "165.5",
                location_source: "wifi",
            },
            {
                location_latitude: 51.3849,
                location_longitude: 7.4794,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "86.313",
                location_vertical_accuracy: "2.5",
                location_altitude: "170.1",
                location_source: "gps"
            },
            {
                location_latitude: 51.3555,
                location_longitude: 7.4722,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "15.515",
                location_vertical_accuracy: "2.5",
                location_altitude: "130.43",
                location_source: "wifi",
            }
        ];
    }

    positionate(coordinates) {
        if (coordinates && coordinates.length > 0) {
            let latestLoc = coordinates[0];

            this.map.setView(
                [latestLoc.location_latitude, latestLoc.location_longitude],
                17
            );

            this.locMarker = L.marker([
                latestLoc.location_latitude,
                latestLoc.location_longitude
            ]).addTo(this.map);

            this.locMarker
                .bindPopup("Der Anrufer befindet sich ungef&auml;hr hier.")
                .openPopup();

            this.fillInputWithData(latestLoc);
            this.displayResultsContainer();
            this.renderAllCoordinates(coordinates);
        }
    }

    fillInputWithData(loc) {
        if (loc && Object.keys(loc).length > 0) {
            for (let prop in loc) {
                if (document.getElementById(prop) !== null) document.getElementById(prop).value = loc[prop];
            }
        }
    }

    displayResultsContainer() {
        let container = document.getElementById("results-container");

        container.style.display = "block";
    }

    renderAllCoordinates(coordinates) {
        let ctx = this, btnArray, tmplData = { coords: coordinates },
            container = document.getElementById("coordinates-container"),
            tmpl = $.templates("#tableTemplate");

        container.innerHTML = tmpl.render(tmplData);

        btnArray = document.querySelectorAll(".coordinates-table-button");

        btnArray.forEach(function (elem) {
            elem.addEventListener("click", function (event) {
                ctx.locateFromTable(this.parentElement.parentElement);
            });
        });
    }

    showAllCoordinates() {
        let coordsContainer = document.getElementById("coordinates-container");

        coordsContainer.style.opacity = 1;
    }

    hideAllCoordinates() {
        let coordsContainer = document.getElementById("coordinates-container");

        coordsContainer.style.opacity = 0;
    }

    locateFromTable(elem) {
        if (elem) {
            let elems = document.querySelectorAll("#results-container input.form-control"),
                lat = elem.dataset.location_latitude,
                lng = elem.dataset.location_longitude;

            this.map.removeLayer(this.locMarker);
            this.map.setView([lat, lng], 17);
            this.locMarker = L.marker([lat, lng]).addTo(this.map);
            this.locMarker.bindPopup("Der Anrufer befindet sich ungef&auml;hr hier.").openPopup();

            elems.forEach(function (elem) { elem.value = ""; });

            for (let prop in elem.dataset) {
                if (document.getElementById(prop) !== null) {
                    document.getElementById(prop).value = elem.dataset[prop];
                }
            }
        }
    }

    refreshData() {
        this.map.removeLayer(this.locMarker);
        this.locate(this.phone);
    }
}