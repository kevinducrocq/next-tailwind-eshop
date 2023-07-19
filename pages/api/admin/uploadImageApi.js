import fs from "fs";
import path from "path";

const uploadImageApi = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  try {
    const image = req.files.image; // Récupérer l'image envoyée par le client
    const imagePath = path.join("uploads", image.name); // Chemin d'enregistrement de l'image

    // Enregistrer l'image dans le dossier "uploads"
    await fs.promises.mkdir("uploads", { recursive: true });
    await image.mv(imagePath);

    res.status(200).json({ path: imagePath });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'enregistrement de l'image :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de l'enregistrement de l'image",
      details: error.message,
    });
  }
};

export default uploadImageApi;
