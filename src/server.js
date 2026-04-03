const app = require("./app");

const { PORT } = require("./config/env");

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Neighbo backend running on port ${PORT}`);
});

