import Layout from "@/components/Layout";
import Rating from "@/components/Rating";
import fetchProductBySlug from "@/domain/product/fetchProductBySlug";
import { Store } from "@/utils/Store";
import { faCartPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
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

  const { data: session } = useSession();

  const [product, setProduct] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug, setProduct);
    }
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
      <div className='py-2 flex justify-between'>
        <Link legacyBehavior href='/'>
          Accueil
        </Link>
        {session?.user?.isAdmin && (
          <Link href={`/admin/product/${product.id}`}>
            <FontAwesomeIcon icon={faEdit} /> Editer
          </Link>
        )}
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
            <li>Marque : {product.brand}</li>
            <li>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </li>
            <li>Description : {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-4 flex justify-start'>
              {product.countInStock <= 0 ? (
                <span className='bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>
                  Epuisé
                </span>
              ) : (
                <span className='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
                  En stock
                </span>
              )}
            </div>

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
              disabled={product.countInStock <= 0}
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
