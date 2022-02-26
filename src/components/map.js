import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";

const Map = ({
	centeredView,
	callerPosition = undefined,
	controlCenter,
	controlCenterName,
	tileServer,
}) => {
	const iconLst = L.icon({
		iconUrl: "/icon-lst.png",
		iconSize: [32, 37],
		popupAnchor: [7, -32],
		iconAnchor: [10, 35],
	});

	return (
		<MapContainer
			center={centeredView}
			zoom={17}
			scrollWheelZoom={true}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url={tileServer}
			/>
			<Marker
				icon={iconLst}
				position={controlCenter}
				draggable={false}
				animate={false}
			>
				<Popup>{controlCenterName}</Popup>
			</Marker>
			{callerPosition && (
				<Marker position={callerPosition} draggable={false} animate={false}>
					<Tooltip permanent>Standort: {callerPosition.join(", ")}</Tooltip>
				</Marker>
			)}
		</MapContainer>
	);
};

export default Map;
