import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import { deleteShippingAddress } from "@/domain/user/deleteShippingAddress";

export default function ShippingAddressList({
  onChange,
  onDelete,
  shippingAddresses,
  isOrder,
  selectedShippingAddress,
}) {
  const [shippingAddress, setShippingAddress] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (shippingAddress && isOrder) {
      onChange(shippingAddress);
    }
  }, [shippingAddress, isOrder, onChange]);

  const handleShippingAddressSelection = (shipAd) => {
    setShippingAddress({
      id: shipAd.id,
      shippingFirstName: shipAd.shippingFirstName,
      shippingLastName: shipAd.shippingLastName,
      shippingStreet: shipAd.shippingStreet,
      shippingZip: shipAd.shippingZip,
      shippingCity: shipAd.shippingCity,
      shippingCountry: shipAd.shippingCountry,
    });
  };

  const handleDeleteShippingAddress = async (shippingAddressId) => {
    try {
      await deleteShippingAddress(shippingAddressId);
      if (onDelete) {
        onDelete();
      }
      toast.success("Adresse supprimée de votre profil");
    } catch (error) {
      console.error(error);
      toast.error(
        "Une erreur s'est produite lors de la suppression de l'adresse"
      );
    }
  };

  return (
    <>
      {shippingAddresses.map((shipAd) => {
        const isSelected = selectedShippingAddress?.id === shipAd.id;

        return isOrder ? (
          <label
            key={shipAd.id}
            htmlFor={shipAd.id}
            className='col-span-1 flex flex-col border p-4 rounded-lg border-gray-200 cursor-pointer'
          >
            <h2 className='mb-2 text-sm'>
              Utiliser cette adresse
              <input
                type='radio'
                id={shipAd.id}
                name='shippingAd'
                value={shipAd}
                onChange={() => handleShippingAddressSelection(shipAd)}
                checked={isSelected}
                className='float-right'
              />
            </h2>
            <hr />
            <div className='flex flex-wrap mt-auto pt-2 text-md'>
              <ul>
                <li>
                  {shipAd.shippingFirstName} {shipAd.shippingLastName}
                </li>
                <li>{shipAd.shippingStreet}</li>
                <li>
                  {shipAd.shippingZip} {shipAd.shippingCity}
                </li>
                <li>{shipAd.shippingCountry}</li>
              </ul>
            </div>
          </label>
        ) : (
          <div
            key={shipAd.id}
            htmlFor={shipAd.id}
            className='col-span-1 flex flex-col border p-4 rounded-lg border-gray-200'
          >
            <div className='flex mt-auto pt-2 text-md'>
              <ul>
                <li>
                  {shipAd.shippingFirstName} {shipAd.shippingLastName}
                </li>
                <li>{shipAd.shippingStreet}</li>
                <li>
                  {shipAd.shippingZip} {shipAd.shippingCity}
                </li>
                <li>{shipAd.shippingCountry}</li>
              </ul>
            </div>
            <div>
              <div
                className='w-6 h-6 float-right'
                role='button'
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  />
                </svg>
              </div>
            </div>
            <ConfirmModal
              isOpen={confirmModalOpen}
              handleConfirm={() => handleDeleteShippingAddress(shipAd.id)}
              handleClose={() => setConfirmModalOpen(false)}
              modalTitle='Supprimer cette adresse ?'
              buttonCancelText='Annuler'
              buttonConfirmText='Oui'
            />
          </div>
        );
      })}
    </>
  );
}
