import { Elysia } from "elysia";
import { auth } from "./auth";
import { fromTypes, openapi } from "@elysia/openapi";

export const app = new Elysia({ name: "Himeko PPMP" })
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .use(auth)
  .get("/", () => "Hello Elysia");
