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
      console.log("coucou");
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

  console.log(order);

  return (
    <Layout title={`Order ${id}`}>
      <h1 className='mb-4 text-xl'>{`Order ${id}`}</h1>

      <div className='grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
          <div className='card  p-5'>
            <h2 className='mb-2 text-lg'>Shipping Address</h2>
            <div>
              {order.shippingAddress?.firstName},{" "}
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.postalCode},{" "}
              {order.shippingAddress?.country}
            </div>
            {order.isDelivered ? (
              <div className='alert-success'>
                Delivered at {order.deliveredAt}
              </div>
            ) : (
              <div className='alert-error'>Not delivered</div>
            )}
          </div>

          <div className='card p-5'>
            <h2 className='mb-2 text-lg'>Payment Method</h2>
            <div>{order.paymentMethod}</div>
            {order.isPaid ? (
              <div className='alert-success'>Paid at {order.paidAt}</div>
            ) : (
              <div className='alert-error'>Not paid</div>
            )}
          </div>

          <div className='card overflow-x-auto p-5'>
            <h2 className='mb-2 text-lg'>Order Items</h2>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Item</th>
                  <th className='    p-5 text-right'>Quantity</th>
                  <th className='  p-5 text-right'>Price</th>
                  <th className='p-5 text-right'>Subtotal</th>
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
          <div className='card  p-5'>
            <h2 className='mb-2 text-lg'>Order Summary</h2>
            <ul>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Items</div>
                  <div>€{order.itemsPrice}</div>
                </div>
              </li>{" "}
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Tax</div>
                  <div>€{order.taxPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Shipping</div>
                  <div>€{order.shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Total</div>
                  <div>€{order.totalPrice}</div>
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
