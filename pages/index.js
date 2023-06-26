import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { useContext, useEffect, useReducer, useState } from "react";
import React from "react";
import fetchProducts from "@/domain/product/fetchProducts";
import { Store } from "@/utils/Store";
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import Spinner from "@/components/Spinner";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      state;
  }
}

export default function Home() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [products, setProducts] = useState([]);

  const [{ loading, error }, dispatcher] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatcher({ type: "FETCH_REQUEST" });
        fetchProducts(setProducts);
        dispatcher({
          type: "FETCH_SUCCESS",
          payload: products,
        });
      } catch (err) {
        dispatcher({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
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
        {loading ? (
          <div className='flex'>
            <Spinner align='center' />
          </div>
        ) : error ? (
          <div className='alert-error'>{error}</div>
        ) : (
          products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            />
          ))
        )}
      </div>
    </Layout>
  );
}
