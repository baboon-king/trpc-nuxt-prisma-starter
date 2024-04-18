import { getServerSession } from "#auth";
import { readFiles } from "h3-formidable";

import { isTrue, UploadType } from "~/utils";

const firstValues = <T>(record: { [key: string]: T | T[] }) => {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value[0]];
      }
      return [key, value];
    }),
  );
};

const accessPathGen = (type: UploadType, filename: string) => {
  if (type === UploadType.file) {
    return `/api/file/${filename}`;
  }
  if (type === UploadType.resource) {
    return `/api/resource/${filename}`;
  }
};

export default eventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    setResponseStatus(event, 401);
    return {
      code: 401,
      msg: "暂未登录",
    };
  }

  const { rename, dir = "", type = UploadType.file } = getQuery(event);

  if (isTrue(rename as string)) {
  }

  const { fields, files } = await readFiles(event, {
    includeFields: true,
    uploadDir: (dir as string) || ``,
    keepExtensions: true,
    /**
     * only help type intelligence.
     * deleted on 3.0.0+.
     *
     * @see https://github.com/node-formidable/formidable#firstvalues
     * @see https://github.com/node-formidable/formidable/blob/master/CHANGELOG.md#300
     * @see https://github.com/node-formidable/formidable/pull/730
     */
    multiples: false,
  });

  const { file } = firstValues(files);

  return {
    ...file,
    filepath: `/${dir}/${file.newFilename}`,
    accessPath: accessPathGen(type as UploadType, file.newFilename),
  } as const;
});
