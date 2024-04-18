import { fileOpen, FirstFileOpenOptions } from "browser-fs-access";

export enum UploadType {
  file = "file",
  resource = "resource",
}

interface UploadOptions {
  dir?: string;
  rename?: boolean | TRUE;
  type?: UploadType;
}
export const pickFileToUpload = async (options?: FirstFileOpenOptions<false>, uploadOptions: UploadOptions = {}) => {
  const file = await fileOpen(options);

  return uploadFile(file, uploadOptions);
};

export const uploadFile = async (file: File, uploadOptions: UploadOptions = {}) => {
  const { dir = "files", rename = TRUE.true, type = UploadType.file } = uploadOptions;
  const formData = new FormData();
  formData.set("file", file);
  return $fetch("/api/upload", {
    method: "post",
    body: formData,
    query: {
      dir,
      rename,
      type,
    },
  });
};

export const isTrue = (str?: string) => {
  if (str) {
    return ["true", "True", "TRUE", "on", "ON", "yes", "Yes", "YES"].includes(str);
  }
  return false;
};

enum TRUE {
  true = "true",
  True = "True",
  TRUE = "TRUE",
  on = "on",
  ON = "ON",
  yes = "yes",
  Yes = "Yes",
  YES = "YES",
}
