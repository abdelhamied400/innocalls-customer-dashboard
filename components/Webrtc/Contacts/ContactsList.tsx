"use client";
import { Button } from "@/components/ui/button";
import PopoverCard, {
  PopoverCardContent,
  PopoverCardHeader,
} from "../Shared/PopoverCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import webrtcService from "@/services/webrtc.service";
import ContactRow from "./ContactRow";
import { useRouting } from "@/providers/RoutingProvider";

const ContactsList = () => {
  const { navigate } = useRouting();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["contacts-list"],
      queryFn: ({ pageParam = 1 }) => webrtcService.listContacts(pageParam),
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.hasNext) {
          return lastPageParam + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const contacts = data?.pages.flatMap((page) => page.contacts) ?? [];

  const handleAddContact = () => {
    navigate("/contacts/create");
  };

  return (
    <div className="contacts-list">
      <PopoverCard>
        <PopoverCardHeader>
          <h3>Contacts</h3>
          <Button size="sm" onClick={handleAddContact}>
            Add Contact
          </Button>
        </PopoverCardHeader>
        <PopoverCardContent>
          <div className="contacts-list-content flex flex-col gap-2">
            {status === "pending" ? (
              <p>Loading contacts...</p>
            ) : status === "error" ? (
              <p>Error loading contacts</p>
            ) : (
              contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))
            )}
          </div>
          {hasNextPage && (
            <Button
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          )}
        </PopoverCardContent>
      </PopoverCard>
    </div>
  );
};

export default ContactsList;
