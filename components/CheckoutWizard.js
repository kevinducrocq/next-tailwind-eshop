import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className='mt-5 mb-14'>
      <div className='flex flex-wrap'>
        {["Connexion", "Livraison", "Paiement", "Commande"].map(
          (step, index) => (
            <div
              key={step}
              className={`flex-1 border-b-2 text-center ${
                index <= activeStep
                  ? "border-indigo-500 text-indigo-500"
                  : "border-gray-400 text-gray-400"
              }`}
            >
              {step}
            </div>
          )
        )}
      </div>
    </div>
  );
}
