import fs from "fs";

export const removeTempFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error("Temp file delete error:", err);
  });
};
