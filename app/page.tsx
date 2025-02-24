"use client"
import Image from "next/image";
import Wrapper from "./components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { getPendingTicketsByEmail } from "./actions";
import { useEffect, useState, useCallback } from "react";
import { Ticket } from "@/type";
import EmptyState from "./components/EmptyState";
import TicketComponent from "./components/TicketComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [countdown, setCountdown] = useState<number>(5);

  const fetchTickets = useCallback(async () => {
    if (email) {
      try {
        const fetchedTickets = await getPendingTicketsByEmail(email);
        if (fetchedTickets) {
          setTickets(fetchedTickets);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [email]);

  useEffect(() => {
    fetchTickets();
  }, [email, fetchTickets]);

  useEffect(() => {
    const handleCountdownAndRefresh = () => {
      if (countdown === 0) {
        fetchTickets();
        setCountdown(5);
      } else {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }
    };
    const timeoutId = setTimeout(handleCountdownAndRefresh, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown, fetchTickets]);

  return (
    <Wrapper>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Vos Tickets</h1>
        <div className="flex items-center">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-30 animate-ping"></div>
            <div className="relative inline-flex w-3 h-3 rounded-full bg-accent"></div>
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-lg flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-1 w-5 h-5" />
              ({countdown}s)
          </div>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div>
          <EmptyState message={"Aucun ticket en attente"} IconComponent="Bird" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket, index) => {
            const totalWaitTime = tickets
              .slice(0, index)
              .reduce((acc, prevTicket) => acc + prevTicket.avgTime, 0);

            return (
              <TicketComponent
                key={ticket.id}
                ticket={ticket}
                totalWaitTime={totalWaitTime}
                index={index}
              />
            );
          })}
        </div>
      )}
    </Wrapper>
  );
}