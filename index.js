import { dotenv } from "dotenv";
import { app } from "./src/app.js";

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Mercur☿ou Server listening on port ${port}`);
});
