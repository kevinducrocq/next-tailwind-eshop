import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import dynamic from "next/dynamic";

function CartPage() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const router = useRouter();

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  return (
    <Layout title='Panier'>
      <h1 className='mb-4 text-xl'>Panier</h1>
      {cartItems.length === 0 ? (
        <div>
          Votre panier est vide. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Produit</th>
                  <th className='p-5 text-right'>Quantité</th>
                  <th className='p-5 text-right'>Prix</th>
                  <th className='p-5'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className='border-b'>
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <span className='flex items-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td className='p-5 text-right'>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-5 text-right'>{item.price} &euro;</td>
                    <td className='p-5 text-center'>
                      <button onClick={() => removeItemHandler(item)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3 text-xl'>
                  Sous-total ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :{" "}
                  {cartItems.reduce((a, c) => a + c.price, 0)} &euro;
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/shipping")}
                  className='primary-button w-full'
                >
                  Commander
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
