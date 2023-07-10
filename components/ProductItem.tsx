/* eslint-disable @next/next/no-img-element */
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import Rating from "./Rating";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className='card'>
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className='rounded shadow'
        />
      </Link>

      <div className='flex flex-col items-center justify-center p-4'>
        <div className='mb-1 self-start'>
          {product.countInStock <= 0 ? (
            <span class='bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>
              Epuisé
            </span>
          ) : (
            <span class='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
              En stock
            </span>
          )}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-lg font-semibold'>{product.name}</h2>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
          size={"xs"}
        ></Rating>
        <p className='mb-2 text-gray-500'>{product.brand}</p>{" "}
        <p className='text-xl font-bold'>€ {product.price}</p>
        <button
          className='primary-button mt-4'
          type='button'
          onClick={() => addToCartHandler(product)}
          disabled={product.countInStock <= 0}
        >
          <FontAwesomeIcon icon={faCartPlus} className='mr-2' />
          Ajouter
        </button>
      </div>
    </div>
  );
}
