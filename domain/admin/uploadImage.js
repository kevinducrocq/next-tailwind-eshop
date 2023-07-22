import { getError } from "@/utils/error";

const uploadImage = async (images) => {
  try {
    const imageReponse = await fetch("/api/admin/uploadImageApi", {
      method: "POST",
      body: images,
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
