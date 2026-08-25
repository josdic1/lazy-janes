import { createApp } from "./app.js";
import { environment } from "./env.js";

const app = createApp();

app.listen(environment.PORT, () => {
  console.log(`Lazy Jane's backend listening on port ${environment.PORT}`);
});
