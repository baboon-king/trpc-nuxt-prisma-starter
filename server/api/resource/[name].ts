import { createReadStream } from "fs";
import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    setResponseStatus(event, 401);
    return {
      code: 401,
      msg: "暂未登录",
    };
  }

  const name = event.context.params?.name;

  const path = `resource/${name}`;

  setResponseHeader(event, "Content-Type", "application/octet-stream");
  return sendStream(event, createReadStream(path));
});
