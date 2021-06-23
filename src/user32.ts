import ffi from "ffi-napi";

export const user32 = ffi.Library("user32", {
  FindWindowA: ["long", ["string", "string"]],
  MoveWindow: ["bool", ["long", "int", "int", "int", "int", "bool"]],
  ShowWindow: ["bool", ["long", "int"]],
});
