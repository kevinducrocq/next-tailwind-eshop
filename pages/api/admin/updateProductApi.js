import * as productService from "@/services/productService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

async function updateProductApi(req, res) {
  if (req.method !== "PUT") {
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Connectez-vous" });
  }

  const {
    productId,
    selectedCategoryId,
    name,
    slug,
    image,
    price,
    brand,
    countInStock,
    description,
  } = req.body;

  try {
    const updatedProduct = await productService.updateProduct(
      productId,
      name,
      slug,
      image,
      price,
      brand,
      selectedCategoryId,
      countInStock,
      description
    );

    res.status(201).send({
      message: "Produit Modifié ! ",
      id: updatedProduct.id,
      name: updatedProduct.name,
      slug: updatedProduct.slug,
      image: updatedProduct.image,
      price: updatedProduct.price,
      brand: updatedProduct.brand,
      categoryId: updatedProduct.selectedCategoryId,
      countInStock: updatedProduct.countInStock,
      description: updatedProduct.description,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Il y a eu un problème", err });
  }
}

export default updateProductApi;
