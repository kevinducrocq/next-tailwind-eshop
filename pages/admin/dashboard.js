import Layout from "@/components/Layout";
import fetchNumberOfOrders from "@/domain/admin/fetchNumberOfOrders";
import fetchTotalAmount from "@/domain/admin/fetchTotalAmount";
import fetchTotalProducts from "@/domain/admin/fetchTotalProducts";
import fetchTotalUsers from "@/domain/admin/fetchTotalUsers";
import fetchSalesData from "@/domain/admin/fetchSalesData";
import { getError } from "@/utils/error";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminMenu from "@/components/AdminMenu";
import Spinner from "@/components/Spinner";

// Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
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

export default function AdminDashboardPage() {
  const [numOrders, setNumOrders] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [salesData, setSalesData] = useState([]);

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        await fetchNumberOfOrders(setNumOrders);
        await fetchTotalAmount(setTotalAmount);
        await fetchTotalProducts(setTotalProducts);
        await fetchTotalUsers(setTotalUsers);
        await fetchSalesData(setSalesData);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: numOrders,
          totalAmount,
          totalProducts,
          totalUsers,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [numOrders, totalAmount, totalProducts, totalUsers]);

  const chartData = {
    labels: salesData.map((x) => x.month),
    datasets: [
      {
        label: "Ventes",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title='Admin - Tableau de bord'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-4 md:gap5'>
          <AdminMenu />
          <div className='md:col-span-3'>
            <h1 className='mb-4 text-xl'>Tableau de bord</h1>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : (
              <div>
                <div className='grid grid-cols-1 md:grid-cols-4'>
                  <div className='card m-5 p-5'>
                    <p className='text-3xl'>{totalAmount} &euro;</p>
                    <p>Ventes</p>
                    <Link href='/admin/orders'>Voir les ventes</Link>
                  </div>
                  <div className='card m-5 p-5'>
                    <p className='text-3xl'>{numOrders} </p>
                    <p>Commandes</p>
                    <Link href='/admin/orders'>Voir les commandes</Link>
                  </div>
                  <div className='card m-5 p-5'>
                    <p className='text-3xl'>{totalProducts} </p>
                    <p>Produits</p>
                    <Link href='/admin/orders'>Voir les produits</Link>
                  </div>
                  <div className='card m-5 p-5'>
                    <p className='text-3xl'>{totalUsers} </p>
                    <p>Utilisateurs</p>
                    <Link href='/admin/users'>Voir les utilisateurs</Link>
                  </div>
                </div>
                <h2 className='text-xl'>Résumé des ventes</h2>
                <Bar
                  options={{ legend: { display: true, position: "right" } }}
                  data={chartData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardPage.auth = { adminOnly: true };
