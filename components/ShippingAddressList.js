import React, { useEffect, useState } from "react";

export default function ShippingAddressList({ onChange, shippingAddresses }) {
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    if (shippingAddress) {
      onChange(shippingAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress]);

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
      {shippingAddresses.map((shipAd) => {
        return (
          <label key={shipAd.id} htmlFor={shipAd.id} className='text-sm'>
            <div className='mb-3 card p-3'>
              <div className='mb-2 flex justify-between'>
                Utiliser cette adresse
                <input
                  type='radio'
                  id={shipAd.id}
                  name='shippingAd'
                  value={shipAd}
                  onChange={() => {
                    setShippingAddress({
                      id: shipAd.id,
                      firstName: shipAd.firstName,
                      lastName: shipAd.lastName,
                      address: shipAd.address,
                      zip: shipAd.zip,
                      city: shipAd.city,
                      country: shipAd.country,
                    });
                  }}
                />
              </div>
              <hr />
              <ul>
                <li>
                  {shipAd.firstName} {shipAd.lastName}
                </li>
                <li>{shipAd.address}</li>
                <li>{shipAd.zip}</li>
                <li>{shipAd.city}</li>
                <li>{shipAd.country}</li>
              </ul>
            </div>
          </label>
        );
      })}
    </div>
  );
}
