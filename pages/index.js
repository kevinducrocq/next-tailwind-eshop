import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { useEffect, useState } from "react";
import React from "react";
import fetchProducts from "@/domain/product/fetchProducts";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  return (
    <Layout title="Page d'accueil">
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem product={product} key={product.slug} />
        ))}
      </div>
    </Layout>
  );
}
