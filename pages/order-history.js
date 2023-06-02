import Carousel from "@/components/Carousel";
import Layout from "@/components/Layout";
import fetchUserOrders from "@/domain/order/fetchUserOrders";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserOrders(setOrders);
  }, []);

  const generateInvoicePDF = async (order) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      const { width, height } = page.getSize();
      const margin = 50;
      const fontSize = 12;
      const lineHeight = fontSize * 1.5;

      let y = height - margin;

      // Add invoice title
      page.drawText("Facture", {
        x: margin,
        y,
        size: 20,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      // Add invoice details
      y -= lineHeight;
      page.drawText(`Commande n°: ${order.id}`, {
        x: margin,
        y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      // Add order information
      y -= lineHeight;
      page.drawText(`Créée le : ${order.createdAt.substring(0, 10)}`, {
        x: margin,
        y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      // Add other invoice details...

      // Generate PDF file
      const pdfBytes = await pdfDoc.save();

      // Save and download the PDF file
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "facture.pdf");
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la génération de la facture PDF :",
        error
      );
    }
  };

  return (
    <Layout title='Historique de commandes'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-semibold mb-4'>Historique de commandes</h1>
        {orders?.map((order) => (
          <div
            className='bg-white shadow-md rounded-md p-6 mb-6'
            key={order.id}
          >
            <div className='flex flex-col sm:flex-row items-start justify-between mb-6'>
              <div>
                <h2 className='text-lg font-semibold'>
                  Commande n°: {order.id}
                </h2>
                <p className='text-sm'>
                  Créée le : {order.createdAt.substring(0, 10)}
                </p>
                <p className='text-sm'>
                  {order.isPaid ? "Payée" : "En attente de paiement"}
                </p>
                <p className='text-sm'>
                  {order.isDelivered
                    ? "Envoyée le " + order.deliveredAt.substring(0, 10)
                    : "Pas encore envoyée"}
                </p>
                <p className='text-lg mt-4'>
                  Total : {order.totalPrice} &euro;
                </p>
                <p className='mt-2'>
                  <Link href={`/order/${order.id}`}>Détails</Link>
                </p>
              </div>

              <div className='mt-4 sm:mt-0 sm:ml-4'>
                <h3 className='text-lg font-semibold'>Adresse de livraison</h3>
                <p className='text-sm'>
                  {order.shippingAddress.shippingFirstName}{" "}
                  {order.shippingAddress.shippingLastName}
                </p>
                <p className='text-sm'>
                  {order.shippingAddress.shippingStreet}
                </p>
                <p className='text-sm'>
                  {order.shippingAddress.shippingZip}{" "}
                  {order.shippingAddress.shippingCity}
                </p>
              </div>
              <div className='mt-4 sm:mt-0 sm:ml-4'>
                <h3 className='text-lg font-semibold'>
                  Adresse de facturation
                </h3>
                <p className='text-sm'>
                  {order.billingAddress.billingFirstName}{" "}
                  {order.billingAddress.billingLastName}
                </p>
                <p className='text-sm'>{order.billingAddress.billingStreet}</p>
                <p className='text-sm'>
                  {order.billingAddress.billingZip}{" "}
                  {order.billingAddress.billingCity}
                </p>
              </div>
              <div className='flex items-center mt-8 sm:mt-0'>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
                  onClick={() => generateInvoicePDF(order)}
                >
                  Facture
                </button>
              </div>
            </div>
            <div className='mt-8 max-h-40 overflow-x-auto'>
              <Carousel
                items={order.orderItems.map((item) => (
                  <div key={item.id} className='flex items-center'>
                    <div className='w-24 h-24 mr-4'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout='responsive'
                        width={150}
                        height={150}
                      />
                    </div>
                    <div>
                      <h4 className='text-lg font-semibold'>{item.name}</h4>
                      <p className='text-sm mb-2'>x {item.quantity}</p>
                      <p className='text-sm'>{item.price} &euro;</p>
                    </div>
                  </div>
                ))}
              />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
