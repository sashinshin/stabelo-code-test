import app from "./app";
import config from "./utils/config";

const { PORT } = config;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

