import framework from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

import { routes } from "./routes";
import morganConfig from "./morgan";

export default () => {
	const express = framework();

	// morganConfig(express);

	express.use(bodyParser.urlencoded({ extended: true }));
	express.use(bodyParser.json());

	express.use("/", routes);
	express.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

	return express;
};
