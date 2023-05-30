import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import getLastBillingAddress from "@/domain/order/getLastBillingAddress";
import placeOrder from "@/domain/order/placeOrder";
import { Store } from "@/utils/Store";
import { getError } from "@/utils/error";
import { faBackward, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function PlaceorderPage() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [lastBillingAddress, setLastBillingAddress] = useState("");

  useEffect(() => {
    getLastBillingAddress(setLastBillingAddress);
  }, []);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const shipping_address_id = cart.shippingAddress.id;

  const billing_address_id = lastBillingAddress.id;

  const isSameAddress = () => {
    if (
      cart.shippingAddress.shippingFirstName ===
        lastBillingAddress.billingFirstName &&
      cart.shippingAddress.shippingLastName ===
        lastBillingAddress.billingLastName &&
      cart.shippingAddress.shippingStreet ===
        lastBillingAddress.billingStreet &&
      cart.shippingAddress.shippingZip === lastBillingAddress.billingZip &&
      cart.shippingAddress.shippingCity === lastBillingAddress.billingCity &&
      cart.shippingAddress.shippingCountry === lastBillingAddress.billingCountry
    ) {
      return true;
    }
  };

  const orderItems = cartItems.map((cartItem) => {
    return { productId: cartItem.id, quantity: cartItem.quantity };
  });

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      placeOrder(
        shipping_address_id,
        billing_address_id,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderItems
      ).then((orderId) => {
        dispatch({ type: "CART_CLEAR_ITEMS" });
        Cookies.set(
          "cart",
          JSON.stringify({
            ...cart,
            cartItems: [],
          })
        );
        router.push(`/order/${orderId}`);
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Récapitulatif de commande'>
      <CheckoutWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Récapitulatif de la commande</h1>
      {cartItems.length === 0 ? (
        <div>
          Votre panier est vide, <Link href={"/"}>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <div className='grid md:grid-cols-4 md:gap-5'>
                <div className='overflow-x-auto md:col-span-2'>
                  <h2 className='mb-2 text-lg'>Adresse de livraison</h2> <hr />{" "}
                  <div className='mb-2 mt-2'>
                    {shippingAddress?.shippingFirstName}&nbsp;
                    {shippingAddress?.shippingLastName} <br />
                    {shippingAddress?.shippingStreet} <br />{" "}
                    {shippingAddress?.shippingZip}{" "}
                    {shippingAddress?.shippingCity} <br />{" "}
                    {shippingAddress?.shippingCountry}
                  </div>
                </div>

                <div className='overflow-x-auto md:col-span-2'>
                  <h2 className='mb-2 text-lg'>Adresse de facturation</h2>
                  <hr />
                  <div className='mb-2 mt-2'>
                    {isSameAddress() === true ? (
                      "Identique à l'adresse de livraison"
                    ) : (
                      <div>
                        {lastBillingAddress?.billingFirstName}
                        &nbsp;
                        {lastBillingAddress?.billingLastName} <br />
                        {lastBillingAddress?.billingStreet} <br />{" "}
                        {lastBillingAddress?.billingZip}{" "}
                        {lastBillingAddress?.billingCity} <br />{" "}
                        {lastBillingAddress?.billingCountry}
                      </div>
                    )}
                  </div>
                  <div className='my-auto float-right'>
                    <Link href={"/shipping"}>
                      <FontAwesomeIcon icon={faEdit} /> Editer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='card p-5'>
              <div className='flex justify-between'>
                <h2 className='mb-2 text-lg'>Méthode de paiement</h2>
                <Link href={"/payment"}>
                  <FontAwesomeIcon icon={faEdit} /> Editer
                </Link>
              </div>
              <div>{paymentMethod}</div>
            </div>
            <div className='card overflow-x-auto p-5'>
              <div className='flex justify-between'>
                <h2 className='mb-2 text-lg'>Produits</h2>
                <Link href={"/cart"}>
                  <FontAwesomeIcon icon={faEdit} /> Editer
                </Link>
              </div>
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
                  {cartItems.map((item) => (
                    <tr key={item.id} className='border-b'>
                      <td>
                        <Link legacyBehavior href={`/product/${item.slug}`}>
                          <a className='flex items-center'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>{item.price} &euro;</td>
                      <td className='p-5 text-right'>
                        {item.quantity * item.price} &euro;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Commande</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Produits</div>
                    <div>{itemsPrice} &euro;</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Taxes</div>
                    <div>{taxPrice} &euro;</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Frais de livraison</div>
                    <div>{shippingPrice} &euro;</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>{totalPrice} &euro;</div>
                  </div>
                </li>
              </ul>
              <button
                disabled={loading}
                onClick={placeOrderHandler}
                className='primary-button w-full'
              >
                {loading ? "Chargement..." : "Commander"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mb-4 flex justify-between'>
        <button
          className='default-button'
          type='button'
          onClick={() => router.push("/payment")}
        >
          <FontAwesomeIcon icon={faBackward} />
          &nbsp; Retour
        </button>
        {/* <button className='primary-button'>
          Suivant &nbsp;
          <FontAwesomeIcon icon={faForward} />
        </button> */}
      </div>
    </Layout>
  );
}

PlaceorderPage.auth = true;
