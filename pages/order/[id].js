import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import Layout from "../../components/Layout";
import fetchOrderById from "@/domain/order/fetchOrderById";
import deliverOrder from "@/domain/admin/deliverOrder";
import payOrder from "@/domain/order/payOrder";
import Paypal from "@/components/paypal";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      state;
  }
}

function OrderPage() {
  const [
    { loading, error, loadingDeliver, successPay, loadingPay, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { query } = useRouter();
  const { id } = query;
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState({});
  const orderId = query.id;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        fetchOrderById(id, setOrder, (err) => {
          if (err.error === "forbidden") {
            router.push(
              "/unauthorized?message=Cette commande ne vous appartient pas"
            );
          }
        });
        dispatch({
          type: "FETCH_SUCCESS",
          payload: order,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order?.id ||
      successPay ||
      successDeliver ||
      (order?.id && order?.id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        toast.success("Commande envoyée");
        dispatch({ type: "DELIVER_RESET" });
      }
    }
  }, [id, orderId, router, successDeliver, successPay]);

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const updatedOrder = await payOrder(order.id, paymentData);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande :", error);
    }
  };

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function () {
      try {
        dispatch({ type: "PAY_REQUEST" });
        await handlePaymentSuccess(data);
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("commande payée avec succès");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        console.error("Erreur lors de la capture du paiement :", error);
      }
    });
  }

  async function deliverOrderHandler(orderId) {
    try {
      if (!orderId) {
        throw new Error("ID de commande manquant");
      }
      dispatch({ type: "DELIVER_REQUEST" });
      const deliveredOrder = await deliverOrder(orderId);
      setOrder(deliveredOrder);
      dispatch({ type: "DELIVER_SUCCESS", payload: deliveredOrder });
      toast.success("La commande a été envoyée");
    } catch (error) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(error) });
      console.error("Erreur lors de la mise à jour de la commande :", error);
    }
  }

  if (!order || Object.keys(order).length === 0) {
    return (
      <div className='container m-auto mt-4 px-4'>
        <div className='flex justify-center alert-error text-3xl'>
          Commande non trouvée
        </div>
        <div className='flex justify-center'>
          <Link href='/order-history'>
            <FontAwesomeIcon icon={faBackward} /> Retour
          </Link>
        </div>
      </div>
    );
  }

  const isSameAddress = () => {
    if (
      order.shippingAddress?.shippingFirstName ===
        order.billingAddress?.billingFirstName &&
      order.shippingAddress?.shippingLastName ===
        order.billingAddress?.billingLastName &&
      order.shippingAddress?.shippingStreet ===
        order.billingAddress?.billingStreet &&
      order.shippingAddress?.shippingZip === order.billingAddress?.billingZip &&
      order.shippingAddress?.shippingCity ===
        order.billingAddress?.billingCity &&
      order.shippingAddress?.shippingCountry ===
        order.billingAddress?.billingCountry
    ) {
      return true;
    }
    return false;
  };

  return (
    <Layout title={`Commande N° ${order.invoice_number}`}>
      <h1 className='mb-4 text-xl'>{`Commande N° ${order.invoice_number}`}</h1>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <div className='grid md:grid-cols-2 md:gap-5'>
                <div>
                  <h2 className='mb-2 text-lg'>Adresse de livraison</h2>
                  <hr />
                  <div className='mb-2 mt-2'>
                    <p>
                      {order.shippingAddress?.shippingFirstName}{" "}
                      {order.shippingAddress?.shippingLastName}
                    </p>
                    <p>{order.shippingAddress?.shippingStreet}</p>
                    <p>
                      {order.shippingAddress?.shippingZip}{" "}
                      {order.shippingAddress?.shippingCity}
                    </p>
                    <p>{order.shippingAddress?.shippingCountry}</p>
                  </div>
                </div>

                <div>
                  <h2 className='mb-2 text-lg'>Adresse de facturation</h2>
                  <hr />
                  <div className='mb-2 mt-2'>
                    {isSameAddress() ? (
                      <p>Identique à l&apos;adresse de livraison</p>
                    ) : (
                      <div>
                        <p>
                          {order.billingAddress?.billingFirstName}{" "}
                          {order.billingAddress?.billingLastName}
                        </p>
                        <p>{order.billingAddress?.billingStreet}</p>
                        <p>
                          {order.billingAddress?.billingZip}{" "}
                          {order.billingAddress?.billingCity}
                        </p>
                        <p>{order.billingAddress?.billingCountry}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {order.isDelivered ? (
                <div className='alert-success'>
                  Livré le :{" "}
                  {format(new Date(order.deliveredAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </div>
              ) : (
                <div className='alert-error'>Pas encore livré</div>
              )}
            </div>

            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Méthode de paiement</h2>
              <hr />
              <div>{order.paymentMethod}</div>
              {order.isPaid ? (
                <div className='alert-success'>
                  Payé le :{" "}
                  {format(new Date(order.paidAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </div>
              ) : (
                <div className='alert-error'>Pas encore payé</div>
              )}
            </div>

            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Produits</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Produit</th>
                    <th className='p-5 text-right'>Quantité</th>
                    <th className='p-5 text-right'>Prix</th>
                    <th className='p-5 text-right'>Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems?.map((item) => (
                    <tr key={item.id} className='border-b'>
                      <td>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a className='flex items-center'>
                            <div className='w-10 h-10 relative'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                layout='fill'
                                objectFit='cover'
                              />
                            </div>
                            <span className='ml-2'>{item.name}</span>
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>€{item.price}</td>
                      <td className='p-5 text-right'>
                        €{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Résumé de la commande</h2>
              <ul>
                <li className='mb-2 flex justify-between'>
                  <span>Produits</span>
                  <span>{order.itemsPrice} &euro;</span>
                </li>
                <li className='mb-2 flex justify-between'>
                  <span>Taxes</span>
                  <span>{order.taxPrice} &euro;</span>
                </li>
                <li className='mb-2 flex justify-between'>
                  <span>Livraison</span>
                  <span>{order.shippingPrice} &euro;</span>
                </li>
                <li className='mb-2 flex justify-between'>
                  <strong>Total</strong>
                  <strong>{order.totalPrice} &euro;</strong>
                </li>
                {!order.isPaid && (
                  <li>
                    <div className='w-full'>
                      <Paypal>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                        ></PayPalButtons>
                      </Paypal>
                    </div>
                  </li>
                )}
                {loadingPay && <div>Loading...</div>}

                {session.user.isAdmin && order.isPaid && !order.isDelivered ? (
                  <li>
                    {loadingDeliver && <div>Chargement...</div>}
                    <button
                      className='primary-button w-full'
                      onClick={() => deliverOrderHandler(order.id)}
                    >
                      Expédier
                    </button>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderPage;
