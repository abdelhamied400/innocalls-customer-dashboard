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
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const ContactsList = () => {
  const t = useTranslations("webrtc.contacts");

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

  // Intersection observer for infinite scroll
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Fetch next page when the trigger element is in view
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddContact = () => {
    navigate("/contacts/create");
  };

  return (
    <div className="contacts-list">
      <PopoverCard>
        <PopoverCardHeader>
          <h3>{t("title")}</h3>
          <Button size="sm" onClick={handleAddContact}>
            {t("actions.create")}
          </Button>
        </PopoverCardHeader>
        <PopoverCardContent>
          <div className="contacts-list-content flex flex-col gap-2">
            {status === "pending" ? (
              <p>{t("actions.loading")}</p>
            ) : status === "error" ? (
              <p> {t("messages.errorLoadingContacts")}</p>
            ) : (
              contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))
            )}
            {/* Invisible trigger element for infinite scroll */}
            {hasNextPage && <div ref={targetRef} className="h-1 w-full" />}
            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-2">
                <p className="text-sm text-gray-500">{t("actions.loading")}</p>
              </div>
            )}
          </div>
        </PopoverCardContent>
      </PopoverCard>
    </div>
  );
};

export default ContactsList;
