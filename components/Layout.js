import { Store } from "@/utils/Store";
import Head from "next/head";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - Eshop" : "Eshop"}</title>
        <meta name='description' content='Eshop website' />
      </Head>
      <ToastContainer
        position='bottom-center'
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
            <Link legacyBehavior href='/'>
              <a className='text-lg font-bold'>Eshop</a>
            </Link>
            <div>
              <Link legacyBehavior href='/cart'>
                <a className='p-2'>
                  Panier
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === "loading" ? (
                "Chargement..."
              ) : session?.user ? (
                <Menu as='div' className='relative inline-block'>
                  <Menu.Button className='text-blue-600'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute right-0 w-56 origin-top-right shadow-lg bg-white'>
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link'
                        href={`/user/profile`}
                        legacyBehavior
                      >
                        Profil
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link'
                        href='/order-history'
                        legacyBehavior
                      >
                        Historique de commandes
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className='dropdown-link'
                          href='/admin/dashboard'
                          legacyBehavior
                        >
                          Administration
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link'
                        onClick={logoutHandler}
                        href=''
                        legacyBehavior
                      >
                        Déconnexion
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href='/login'>Connexion</Link>
              )}
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
