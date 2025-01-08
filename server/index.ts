import app from "./app";

Bun.serve({
  port: process.env.PORT || 3000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});

console.log("Server started at http://localhost:3000");
