import Head from "next/head";
import dynamic from "next/dynamic";
import SearchField from "../components/SearchField";
import { useState } from "react";
import Alert from "../components/alert";

export async function getServerSideProps(context) {
	return {
		props: {
			centeredView: process.env.CENTERED_MAP.split(","),
			controlCenter: process.env.CONTROL_CENTER.split(","),
			controlCenterName: process.env.CONTROL_CENTER_NAME,
			tileServer: process.env.TILE_SERVER,
			examples: process.env.EXAMPLES == "true" ? true : false,
		},
	};
}

export default function Home({
	centeredView,
	controlCenter,
	controlCenterName,
	tileServer,
	examples,
}) {
	const [result, setResult] = useState();
	const [alert, setAlert] = useState(false);

	const MapWithNoSSR = dynamic(() => import("../components/map"), {
		ssr: false,
	});

	const fetchAmlData = async (phone) => {
		const res = await fetch(
			examples ? "api/exampleData" : "/api/data?phone=" + phone
		);
		const geolocation = await res.json();

		if (geolocation && geolocation.status == "ok") {
			const centeredView = [
				geolocation.location_latitude,
				geolocation.location_longitude,
			];
			setAlert(false);
			setResult({ centeredView });
		} else {
			setResult(null);
			setAlert(true);
		}
	};

	return (
		<div>
			<Head>
				<title>Advanced Mobile Location</title>
			</Head>

			<main>
				{alert && (
					<Alert alertMessage="Es konnten keine AML-Daten abgerufen werden." />
				)}

				<SearchField onClick={fetchAmlData} />
				<div
					className="z-0"
					style={{ height: "100vh", width: "100vw" }}
					id="map"
				>
					<MapWithNoSSR
						centeredView={result?.centeredView || centeredView}
						callerPosition={result?.centeredView}
						controlCenter={controlCenter}
						controlCenterName={controlCenterName}
						tileServer={tileServer}
					/>
				</div>
			</main>
		</div>
	);
}
