import Layout from "@/components/Layout";
import fetchOrders from "@/domain/admin/fetchOrders";
import { getError } from "@/utils/error";
import React, { useEffect, useReducer, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AdminMenu from "@/components/AdminMenu";
import Spinner from "@/components/Spinner";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
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
export default function AdminOrdersPage() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        await fetchOrders(setOrders);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: orders,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Admin - Commandes'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-6 md:gap-2'>
          <div className='md:col-span-1'>
            <AdminMenu />
          </div>
          <div className='md:col-span-5'>
            <h1 className='mb-4 text-xl'>Commandes</h1>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : orders.length <= 0 ? (
              <h2>Aucune commande trouvée</h2>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead className='border-b'>
                    <tr>
                      <th className='px-5 text-left'>N°</th>
                      <th className='p-5 text-left'>UTILISATEUR</th>
                      <th className='p-5 text-left'>DATE</th>
                      <th className='p-5 text-left'>TOTAL</th>
                      <th className='p-5 text-left'>PAYÉ LE</th>
                      <th className='p-5 text-left'>LIVRÉ LE</th>
                      <th className='p-5 text-left'>ACTION</th>
                    </tr>{" "}
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className='border-b whitespace-nowrap'>
                        <td className='p-5'>{order.invoice_number}</td>
                        <td className='p-5'>
                          {order.user
                            ? order.user?.firstName + " " + order.user?.lastName
                            : "Utilisateur supprimé"}
                        </td>
                        <td className='p-5'>
                          {format(new Date(order.createdAt), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </td>
                        <td className='p-5'>{order.totalPrice} &euro;</td>
                        <td className='p-5'>
                          {order.isPaid ? (
                            <span className='alert-success'>
                              {format(new Date(order.paidAt), "dd MMMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          ) : (
                            <span className='alert-error'>Non payé</span>
                          )}
                        </td>
                        <td className='p-5'>
                          {order.isDelivered ? (
                            <span className='alert-success'>
                              {format(
                                new Date(order.deliveredAt),
                                "dd MMMM yyyy",
                                {
                                  locale: fr,
                                }
                              )}
                            </span>
                          ) : (
                            <span className='alert-error'>Non livré</span>
                          )}
                        </td>
                        <td className='p-5'>
                          <Link href={`/order/${order.id}`}>
                            <FontAwesomeIcon icon={faEye} /> Détails
                          </Link>
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
AdminOrdersPage.auth = { adminOnly: true };
