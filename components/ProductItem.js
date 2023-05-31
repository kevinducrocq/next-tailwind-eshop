/* eslint-disable @next/next/no-img-element */
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

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
      <div className='flex flex-col items-center justify-center p-5'>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-lg font-semibold'>{product.name}</h2>
        </Link>
        <p className='mb-2 text-gray-500'>{product.brand}</p>
        <p className='text-xl font-bold'>€ {product.price}</p>
        <button
          className='primary-button mt-4'
          type='button'
          onClick={() => addToCartHandler(product)}
        >
          <FontAwesomeIcon icon={faCartPlus} className='mr-2' />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
