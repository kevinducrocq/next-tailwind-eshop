import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Layout({ title, children }) {
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
                <span className='p-2'>Panier</span>
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
