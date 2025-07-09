import { RoutingProvider, useRouting } from "@/providers/RoutingProvider";
import { PropsWithChildren } from "react";
import ContactsList from "./Contacts/ContactsList";
import CreateContact from "./Contacts/CreateContact";
import UpdateContact from "./Contacts/UpdateContact";

type ContactsProvidersProps = PropsWithChildren<{}>;
export const ContactsProviders = ({ children }: ContactsProvidersProps) => {
  return (
    <div className="contacts">
      <RoutingProvider initialRoute="/contacts/list">
        {children}
      </RoutingProvider>
    </div>
  );
};

export const Contacts = () => {
  const { isRoute } = useRouting();

  return (
    <div className="contacts-content">
      {isRoute("/contacts/list") && <ContactsList />}
      {isRoute("/contacts/create") && <CreateContact />}
      {isRoute("/contacts/update/:id") && <UpdateContact />}
    </div>
  );
};
