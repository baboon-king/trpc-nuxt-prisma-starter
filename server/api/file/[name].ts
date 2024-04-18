import { createReadStream } from "fs";

export default eventHandler(async (event) => {
  const name = event.context.params?.name;

  const path = `files/${name}`;

  setResponseHeader(event, "Cache-Control", "max-age=31556926");
  return sendStream(event, createReadStream(path));
});
