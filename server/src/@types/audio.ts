import { RequestWithFiles } from "#/middlewares/upload-file";
import { categoriesTypes } from "#/utils/category_types";

export interface uploadAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    description: string;
    category: categoriesTypes;
  };
}
