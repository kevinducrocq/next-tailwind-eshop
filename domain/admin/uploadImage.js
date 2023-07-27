import { getError } from "@/utils/error";

const uploadImage = async (image) => {
  try {
    const imageReponse = await fetch("/api/admin/uploadImageApi", {
      method: "POST",
      body: image,
    });

    if (imageReponse.status > 400) {
      getError(imageReponse);
      return;
    }
    const responseData = await imageReponse.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
};

export default uploadImage;
