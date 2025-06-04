"use client";
import Select from "@/components/select";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { countries } from "@/constants/countries";
import { useToast } from "@/hooks/use-toast";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

type CheckoutFormProps = { clientSecret: string; onSuccess?: () => void };
const CheckoutForm = ({ clientSecret, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardNumberElement);
    if (!card) {
      console.error("Card element not found");
      return;
    }

    setIsPaying(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          address: {
            country: selectedCountry.code,
          },
        },
      },
    });

    if (result.error) {
      console.log("[Payment error]", result.error.message);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: result.error.message,
      });
      // Show error to customer
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("[Payment succeeded]", result.paymentIntent);
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess?.();
      }
    }

    setIsPaying(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Card Number" htmlFor="card-number">
        <CardNumberElement
          className="flex-1 py-2"
          options={{
            showIcon: true,
            placeholder: "Card Number...",
          }}
        />
      </Field>

      <Field label="Expiry Date" htmlFor="card-expiry">
        <CardExpiryElement
          className="flex-1 py-2"
          options={{
            placeholder: "MM/YY",
          }}
        />
      </Field>
      <Field label="CVC" htmlFor="card-cvc">
        <CardCvcElement
          className="flex-1 py-2"
          options={{
            placeholder: "CVC",
          }}
        />
      </Field>

      <Select
        options={countries}
        value={selectedCountry}
        onChange={setSelectedCountry}
        label="Country"
        placeholder="Choose a country..."
        isVirtualized
        getLabel={(opt) => opt.name}
        getValue={(opt) => opt.code}
      />

      <Button
        onClick={handleSubmit}
        disabled={!stripe || isPaying}
        className="w-full"
      >
        <span>Pay Now</span>
        <span className="sr-only">Pay Now</span>
      </Button>
    </div>
  );
};

export default CheckoutForm;
