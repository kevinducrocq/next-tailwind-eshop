import fs from "fs";

const uploadImageApi = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  try {
    const formData = await req.formData();
    const formDataEntryValues = Array.from(formData.values());
    for (const formDataEntryValue of formDataEntryValues) {
      if (
        typeof formDataEntryValue === "object" &&
        "arrayBuffer" in formDataEntryValue
      ) {
        const file = formDataEntryValue;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(`public/uploads/${file.name}`, buffer);
      }
    }

    res.status(200).json(formData);
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'upload :", error);
    res.status(500).json({
      error: "Erreur lors de l'upload",
      details: error.message,
    });
  }
};

export default uploadImageApi;
