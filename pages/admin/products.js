import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import React, { useEffect, useReducer, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import AdminMenu from "@/components/AdminMenu";
import fetchProducts from "@/domain/admin/fetchProducts";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
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
export default function AdminProductsPage() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const router = useRouter();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        await fetchProducts(setProducts);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: products,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Admin - Produits'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-6 md:gap-2'>
          <div className='md:col-span-1'>
            <AdminMenu />
          </div>
          <div className='md:col-span-5'>
            <h1 className='mb-4 text-xl'>Produits</h1>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : products.length <= 0 ? (
              <h2>Aucun produit trouvé</h2>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead className='border-b'>
                    <tr>
                      <th className='px-5 text-left'>NOM</th>
                      <th className='p-5 text-left'>PRIX</th>
                      <th className='p-5 text-left'>CATEGORIE</th>
                      <th className='p-5 text-left'>STOCK</th>
                      <th className='p-5 text-left'>MARQUE</th>
                      <th className='p-5 text-left'>NOTE</th>
                      <th className='p-5 text-left'>CREÉ LE</th>
                      <th className='p-5 text-left'>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr
                        key={product.id}
                        className='border-b whitespace-nowrap'
                      >
                        <td className='p-5'>{product.name}</td>
                        <td className='p-5'>{product.price} &euro;</td>
                        <td className='p-5'>{product.categories?.name}</td>
                        <td className='p-5'>{product.countInStock}</td>
                        <td className='p-5'>{product.brand}</td>
                        <td className='p-5'>{product.rating} / 5</td>
                        <td className='p-5'>
                          {format(new Date(product.createdAt), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </td>
                        <td className='p-5 flex flex-col'>
                          <button
                            className='default-button mb-1'
                            onClick={() => {
                              router.push(`/product/${product.slug}`);
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} /> Voir
                          </button>
                          <button
                            className='default-button'
                            onClick={() => {
                              router.push(`/admin/product/${product.id}`);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Editer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
AdminProductsPage.auth = { adminOnly: true };
