import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import React, { useEffect, useReducer, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AdminMenu from "@/components/AdminMenu";
import fetchusers from "@/domain/admin/fetchUsers";
import Spinner from "@/components/Spinner";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      state;
  }
}
export default function AdminOrdersPage() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [users, setusers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        await fetchusers(setusers);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: users,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Admin - Utilisateurs'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-6 md:gap-2'>
          <div className='md:col-span-1'>
            <AdminMenu />
          </div>
          <div className='md:col-span-5'>
            <h1 className='mb-4 text-xl'>Utilisateurs</h1>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : users.length <= 0 ? (
              <h2>Aucun utilisateur trouvé</h2>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead className='border-b'>
                    <tr>
                      <th className='px-5 text-left'>NOM</th>
                      <th className='p-5 text-left'>PRÉNOM</th>
                      <th className='p-5 text-left'>EMAIL</th>
                      <th className='p-5 text-left'>COMMANDES</th>
                      <th className='p-5 text-left'>ADMIN</th>
                      <th className='p-5 text-left'>CREÉ LE</th>
                      <th className='p-5 text-left'>ACTION</th>
                    </tr>{" "}
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr key={user.id} className='border-b whitespace-nowrap'>
                        <td className='p-5'>{user.lastName}</td>
                        <td className='p-5'>{user.firstName}</td>
                        <td className='p-5'>{user.email}</td>
                        <td className='p-5'>{user.orderCount}</td>
                        <td className='p-5'>
                          {user.isAdmin === 1 ? "OUI" : "NON"}
                        </td>
                        <td className='p-5'>
                          {format(new Date(user.createdAt), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </td>
                        <td className='p-5'>
                          <Link href={`/user/${user.slug}`}>
                            <FontAwesomeIcon icon={faEye} /> Détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
AdminOrdersPage.auth = { adminOnly: true };
