import Elysia from "elysia";

export const auth = new Elysia({
  name: "Authentication",
}).onBeforeHandle({ as: "global" }, ({ cookie }) => {});
