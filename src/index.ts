import { app } from "./server";

app.listen(3000);

console.log(
  `Elysia has started on ${app.server?.hostname}:${app.server?.port}`,
);
