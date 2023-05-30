import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import fetchOrderById from "@/domain/order/fetchOrderById";

function ProductPage() {
  // order/:id
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
    <Layout title={`Order ${id}`}>
      <h1 className='mb-4 text-xl'>{`Order ${id}`}</h1>

      <div className='grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
          <div className='card p-5'>
            <div className='grid md:grid-cols-4 md:gap-5'>
              <div className='overflow-x-auto md:col-span-2'>
                <h2 className='mb-2 text-lg'>Adresse de livraison</h2>
                <hr />
                <div className='mb-2 mt-2'>
                  {order.shippingAddress?.shippingFirstName}&nbsp;
                  {order.shippingAddress?.shippingLastName} <br />
                  {order.shippingAddress?.shippingStreet} <br />
                  {order.shippingAddress?.shippingCity} <br />
                  {order.shippingAddress?.shippingZip}
                  {order.shippingAddress?.shippingCountry}
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
                      {order.billingAddress?.billingFirstName}
                      &nbsp;
                      {order.billingAddress?.billingLastName} <br />
                      {order.billingAddress?.billingStreet} <br />{" "}
                      {order.billingAddress?.billingCity} <br />{" "}
                      {order.billingAddress?.billingZip}{" "}
                      {order.billingAddress?.billingCountry}
                    </div>
                  )}
                </div>{" "}
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
            <h2 className='mb-2 text-lg'>Méthode de paiement</h2> <hr />
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
                  <th className='    p-5 text-right'>Quantité</th>
                  <th className='  p-5 text-right'>Prix</th>
                  <th className='p-5 text-right'>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item) => (
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
                    <td className=' p-5 text-right'>{item.quantity}</td>
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
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Produits</div>
                  <div>{order.itemsPrice} &euro;</div>
                </div>
              </li>{" "}
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Taxes</div>
                  <div>{order.taxPrice} &euro;</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Livraison</div>
                  <div>{order.shippingPrice} &euro;</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Total</div>
                  <div>{order.totalPrice} &euro;</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

ProductPage.auth = true;

export default ProductPage;
