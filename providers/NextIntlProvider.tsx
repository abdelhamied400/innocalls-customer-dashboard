import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { PropsWithChildren } from "react";

type NextIntlProviderProps = PropsWithChildren<object>;
const NextIntlProvider = async ({ children }: NextIntlProviderProps) => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default NextIntlProvider;
