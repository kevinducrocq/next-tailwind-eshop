import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Paypal = ({ children }) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <PayPalScriptProvider
      options={{
        "client-id": clientId,
        currency: "EUR",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default Paypal;
