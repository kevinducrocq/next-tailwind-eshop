import Layout from "@/components/Layout";
import fetchProductBySlug from "@/domain/product/fetchProductBySlug";
import { Store } from "@/utils/Store";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductPage() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;

  const [product, setProduct] = useState([]);

  useEffect(() => {
    fetchProductBySlug(slug, setProduct);
  }, [slug]);

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
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
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link legacyBehavior href='/'>
          Accueil
        </Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            priority
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Catégorie</li>
            <li>Marque : {product.brand}</li>
            <li>
              {product.rating} sur {product.numReviews} avis
            </li>
            <li>Description : {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Prix</div>
              <div>{product.price} &euro;</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Statut</div>
              <div>{product.countInStock > 0 ? "En stock" : "Epuisé"}</div>
            </div>
            <button
              className='primary-button w-full'
              onClick={addToCartHandler}
            >
              <FontAwesomeIcon icon={faCartPlus} />
              &nbsp; Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
