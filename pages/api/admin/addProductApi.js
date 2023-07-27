import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as productService from "@/services/productService";

const addProductApi = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Connectez-vous" });
  }

  try {
    // Enregistrer le produit
    const {
      name,
      slug,
      images,
      price,
      brand,
      countInStock,
      description,
      selectedCategoryId,
    } = req.body;

    const result = await productService.addProduct(
      name,
      slug,
      images,
      price,
      brand,
      countInStock,
      description,
      selectedCategoryId
    );

    
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'insertion en BDD :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de l'insertion en BDD",
      details: error.message,
    });
  }
};

export default addProductApi;
