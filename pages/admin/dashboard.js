import Layout from "@/components/Layout";
import fetchNumberOfOrders from "@/domain/admin/fetchNumberOfOrders";
import fetchTotalAmount from "@/domain/admin/fetchTotalAmount";
import fetchTotalProducts from "@/domain/admin/fetchTotalProducts";
import fetchTotalUsers from "@/domain/admin/fetchTotalUsers";
import { getError } from "@/utils/error";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";

export default function AdminDashboardPage() {
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

  const [numOrders, setNumOrders] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [totalUsers, setTotalUsers] = useState();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        await fetchNumberOfOrders(setNumOrders);
        await fetchTotalAmount(setTotalAmount);
        await fetchTotalProducts(setTotalProducts);
        await fetchTotalUsers(setTotalUsers);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: numOrders,
          totalAmount,
          totalProducts,
          totalUsers,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [numOrders, totalAmount, totalProducts, totalUsers]);

  return (
    <Layout title='Admin - Tableau de bord'>
      <div className='grid md:grid-cols-4 md:gap5'>
        <div>
          <ul>
            <li>
              <Link href='/admin/dashboard' legacyBehavior>
                <a className='font-bold'>Tableau de bord</a>
              </Link>
            </li>
            <li>
              <Link href='/admin/orders' legacyBehavior>
                <a className='font-bold'>Commandes</a>
              </Link>
            </li>
            <li>
              <Link href='/admin/products' legacyBehavior>
                <a className='font-bold'>Produits</a>
              </Link>
            </li>
            <li>
              <Link href='/admin/utilisateurs' legacyBehavior>
                <a className='font-bold'>Utilisateurs</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='md:col-span-3'>
          <h1 className='mb-4 text-xl'>Tableau de bord</h1>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-4'>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{totalAmount} &euro;</p>
                  <p>Ventes</p>
                  <Link href='/admin/orders'>Voir les ventes</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{numOrders} </p>
                  <p>Commandes</p>
                  <Link href='/admin/orders'>Voir les commandes</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{totalProducts} </p>
                  <p>Produits</p>
                  <Link href='/admin/orders'>Voir les produits</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{totalUsers} </p>
                  <p>Utilisateurs</p>
                  <Link href='/admin/users'>Voir les utilisateurs</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardPage.auth = { adminOnly: true };
