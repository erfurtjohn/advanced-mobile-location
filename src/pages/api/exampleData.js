export default function handler(req, res) {
	res.status(200).json(
		[
			{
				location_latitude: 51.3512,
				location_longitude: 7.445,
				location_time: "2019-10-17 09:27:29",
				location_accuracy: "89.567",
				location_vertical_accuracy: "2.5",
				location_altitude: "160.5",
				location_source: "wifi",
				status: "ok",
			},
			{
				location_latitude: 51.4028,
				location_longitude: 7.4758,
				location_time: "2019-10-17 09:27:29",
				location_accuracy: "55",
				location_vertical_accuracy: "2.5",
				location_altitude: "165.5",
				location_source: "wifi",
				status: "ok",
			},
			{
				location_latitude: 51.3849,
				location_longitude: 7.4794,
				location_time: "2019-10-17 09:27:29",
				location_accuracy: "86.313",
				location_vertical_accuracy: "2.5",
				location_altitude: "170.1",
				location_source: "gps",
				status: "ok",
			},
			{
				location_latitude: 51.3555,
				location_longitude: 7.4722,
				location_time: "2019-10-17 09:27:29",
				location_accuracy: "15.515",
				location_vertical_accuracy: "2.5",
				location_altitude: "130.43",
				location_source: "wifi",
				status: "ok",
			},
		].reduce((prev, cur) =>
			parseFloat(prev.location_accuracy) < parseFloat(cur.location_accuracy)
				? prev
				: cur
		)
	);
}
