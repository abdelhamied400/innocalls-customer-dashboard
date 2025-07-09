"use client";
import CountrySelect from "@/components/CountrySelect";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { CountryOption } from "@/constants/countries";
import { useToast } from "@/hooks/use-toast";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useState } from "react";

type CheckoutFormProps = { clientSecret: string; onSuccess?: () => void };
const CheckoutForm = ({ clientSecret, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const t = useTranslations("billing.refillBalance");

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>();
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
            country: selectedCountry?.value,
          },
        },
      },
    });

    if (result.error) {
      console.log("[Payment error]", result.error.message);
      toast({
        variant: "destructive",
        title: t("messages.paymentFailed"),
        description: result.error.message,
      });
      // Show error to customer
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("[Payment succeeded]", result.paymentIntent);
        toast({
          title: t("messages.paymentSuccess"),
          description: t("messages.paymentSuccessDescription"),
        });
        onSuccess?.();
      }
    }

    setIsPaying(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label={t("form.fields.cardNumber.label")} htmlFor="card-number">
        <CardNumberElement
          className="flex-1 py-2"
          options={{
            showIcon: true,
            placeholder: t("form.fields.cardNumber.placeholder"),
          }}
        />
      </Field>

      <Field label={t("form.fields.expiryDate.label")} htmlFor="card-expiry">
        <CardExpiryElement
          className="flex-1 py-2"
          options={{
            placeholder: t("form.fields.expiryDate.placeholder"),
          }}
        />
      </Field>
      <Field label={t("form.fields.cvc.label")} htmlFor="card-cvc">
        <CardCvcElement
          className="flex-1 py-2"
          options={{
            placeholder: t("form.fields.cvc.placeholder"),
          }}
        />
      </Field>

      <CountrySelect value={selectedCountry} onChange={setSelectedCountry} />

      {/* <Select
        options={countries}
        value={selectedCountry}
        onChange={setSelectedCountry}
        label={t("form.fields.country.label")}
        placeholder={t("form.fields.country.placeholder")}
        isVirtualized
        getLabel={(opt) => opt.name[locale]}
        getValue={(opt) => opt.code}
      /> */}

      <Button
        onClick={handleSubmit}
        disabled={!stripe || isPaying}
        className="w-full"
      >
        <span>{t("actions.payNow")}</span>
        <span className="sr-only">{t("actions.payNow")}</span>
      </Button>
    </div>
  );
};

export default CheckoutForm;
