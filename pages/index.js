import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { useContext, useEffect, useState } from "react";
import React from "react";
import fetchProducts from "@/domain/product/fetchProducts";
import { Store } from "@/utils/Store";
import { toast } from "react-toastify";

export default function Home() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.error("Désolé, il n'y a plus de stock pour ce produit", {
        autoClose: 1500,
        hideProgressBar: true,
        position: "bottom-right",
      });
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    toast.success("Produit ajouté au panier", {
      autoClose: 500,
      hideProgressBar: true,
      position: "bottom-right",
    });
  };

  return (
    <Layout title="Page d'accueil">
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}
