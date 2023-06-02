import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import fetchOrderById from "@/domain/order/fetchOrderById";

function OrderPage() {
  const { query } = useRouter();
  const { id } = query;

  const router = useRouter();

  const [order, setOrder] = useState({});

  useEffect(() => {
    fetchOrderById(id, setOrder, (err) => {
      if (err.error === "forbidden") {
        router.push(
          "/unauthorized?message=Cette commande ne vous appartient pas"
        );
      }
    });
  }, [id, router]);

  if (order.length === 0) {
    return <div>Commande non trouvée</div>;
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
  };

  return (
    <Layout title={`Commande N° ${id}`}>
      <h1 className='mb-4 text-xl'>{`Commande N° ${id}`}</h1>

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
                  {isSameAddress() === true ? (
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
                Livré le : {order.deliveredAt}
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
              <div className='alert-success'>Paid at {order.paidAt}</div>
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
                      <Link legacyBehavior href={`/product/${item.slug}`}>
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
                <span>Total</span>
                <span>{order.totalPrice} &euro;</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

OrderPage.auth = true;

export default OrderPage;
