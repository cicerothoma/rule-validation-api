const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!! Shutting Down");
  console.log({ name: err.name, message: err.message });
  process.exit(1);
});

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`App is Running on port ${PORT}`);
});
