class AML {
    constructor(centeredView, controlCenterC, tileServer, debug) {
        this.map = L.map("aml-map").setView(centeredView, 17);
        this.tile = tileServer;
        this.cc = controlCenterC;
        this.ccMarker;
        this.locMarker;
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
        let btns = [
            L.easyButton('<span class="fab fa-github"></span>', function () {
                window.open("https://github.com/erfurtjohn/advanced-mobile-location", "_blank");
            })
        ];

        L.easyBar(btns).addTo(this.map);
    }

    locate(phone) {
        if (phone && !this.debugMode) {
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
                    ctx.positionate(data);
                }
            });
        }

        if (phone && this.debugMode) {
            this.positionate(this.getExampleData());
        }
    }

    getExampleData() {
        return [
            {
                location_latitude: 51.3512,
                location_longitude: 7.445,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "15.515",
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
                location_altitude: "160.5",
                location_source: "wifi",
            },
            {
                location_latitude: 51.3849,
                location_longitude: 7.4794,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "15.515",
                location_vertical_accuracy: "2.5",
                location_altitude: "160.5",
                location_source: "wifi"
            },
            {
                location_latitude: 51.3555,
                location_longitude: 7.4722,
                location_time: "2019-10-17 09:27:29",
                location_accuracy: "15.515",
                location_vertical_accuracy: "2.5",
                location_altitude: "160.5",
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
}