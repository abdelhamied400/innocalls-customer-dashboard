"use client";
import getStripe from "@/lib/stripe";
import { PropsWithChildren } from "react";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = getStripe();

type StripeProviderProps = PropsWithChildren<{
  clientSecret?: string;
}>;
const StripeProvider = ({ children, clientSecret }: StripeProviderProps) => {
  if (!clientSecret) return null;
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeProvider;
