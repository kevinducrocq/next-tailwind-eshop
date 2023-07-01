import Link from "next/link";
import React from "react";

export default function AdminMenu() {
  return (
    <div>
      <ul>
        <li>
          <Link href='/admin/dashboard' legacyBehavior>
            <a className='font-bold'>Tableau de bord</a>
          </Link>
        </li>
        <li>
          <Link href='/admin/orders' legacyBehavior>
            <a className='font-bold'>Commandes</a>
          </Link>
        </li>
        <li>
          <Link href='/admin/products' legacyBehavior>
            <a className='font-bold'>Produits</a>
          </Link>
        </li>
        <li>
          <Link href='/admin/product/add-product' legacyBehavior>
            <a className='font-bold'>Ajouter un produit</a>
          </Link>
        </li>
        <li>
          <Link href='/admin/users' legacyBehavior>
            <a className='font-bold'>Utilisateurs</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
