const uploadImage = async (imageBuffer, imageName) => {
  const formData = new FormData();
  formData.append("image", imageBuffer, imageName);

  const response = await fetch("/api/admin/uploadImageApi", {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export default uploadImage;
