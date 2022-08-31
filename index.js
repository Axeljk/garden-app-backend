const express = require("express");
const database = require("./config/connection");
const routes = require("./routes");
const cors = require("cors");

const cwd = process.cwd();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

database.once("open", () => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}.`)
	});
});
