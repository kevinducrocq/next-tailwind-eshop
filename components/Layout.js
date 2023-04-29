import { Store } from "@/utils/Store";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + " - Eshop" : "Eshop"}</title>
        <meta name='description' content='Eshop website' />
      </Head>
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 justify-between shadow-md items-center'>
            <Link href='/'>
              <span className='text-lg font-bold'>Eshop</span>
            </Link>
            <div>
              <Link href='/cart'>
                <span className='p-2'>
                  Panier
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </span>
              </Link>
              <span className='p-2'>Login</span>
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          Copyright © 2023 Eshop
        </footer>
      </div>
    </>
  );
}
