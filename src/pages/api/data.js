import https from "https";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
	const options = {
		hostname: process.env.API_HOST,
		port: process.env.API_PORT,
		auth: process.env.API_AUTH,
		path: process.env.API_PATH + req.query.phone,
		method: "GET",
		key: fs.readFileSync(path.resolve(__dirname, "../../../../aml.key.pem")),
		cert: fs.readFileSync(path.resolve(__dirname, "../../../../aml.crt.pem")),
	};

	const extReq = https.request(options, (extRes) => {
		extRes.setEncoding("utf8");
		extRes.on("data", (d) => {
			if (d && JSON.parse(d).length > 0) {
				const json = JSON.parse(d);

				if (json?.length > 0 && json[0]?.status == "no aml data") {
					res.status(200).json({ aml: false });
				} else {
					res
						.status(200)
						.json(
							json.reduce((prev, cur) =>
								parseFloat(prev.location_accuracy) <
								parseFloat(cur.location_accuracy)
									? prev
									: cur
							)
						);
				}
			}
		});
	});

	extReq.on("error", (e) => {
		console.error(e);
	});
	extReq.end();
}
