"use client"
import { getPendingTicketsByEmail, getPostNameById } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import TicketComponent from '@/app/components/TicketComponent'
import Wrapper from '@/app/components/Wrapper'
import { Ticket } from '@/type'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPhone } from '@fortawesome/free-solid-svg-icons'

const Page = ({ params }: { params: Promise<{ idPoste: string }> }) => {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [countdown, setCountdown] = useState<number>(5)
  const [idPoste, setIdPoste] = useState<string | null>(null)
  const [namePoste, setNamePoste] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    if (email) {
      try {
        const fetchedTickets = await getPendingTicketsByEmail(email);
        if (fetchedTickets) {
          setTickets(fetchedTickets)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [email])

  useEffect(() => {
    fetchTickets()
  }, [email, fetchTickets])

  useEffect(() => {
    const handleCountdownAndRefresh = () => {
      if (countdown === 0) {
        fetchTickets()
        setCountdown(5)
      } else {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }
    }
    const timeoutId = setTimeout(handleCountdownAndRefresh, 1000)

    return () => clearTimeout(timeoutId)

  }, [countdown, fetchTickets])

  const getPosteName = useCallback(async () => {
    try {
      const resolvedParams = await params;
      setIdPoste(resolvedParams.idPoste)

      const postName = await getPostNameById(resolvedParams.idPoste)
      if (postName)
        setNamePoste(postName)
    } catch (error) {
      console.error(error)
    }
  }, [params])

  useEffect(() => {
    getPosteName()
  }, [params, getPosteName])

  return (
    <Wrapper>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <span>Poste</span>
          <span className="ml-2 badge badge-accent text-lg">{namePoste ?? "aucun poste"}</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-30 animate-ping"></div>
            <div className="relative inline-flex w-3 h-3 rounded-full bg-accent"></div>
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-lg flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-1 w-5 h-5" />
            ({countdown}s)
          </div>
          <Link href={`/call/${idPoste}`} className={`btn btn-sm btn-primary flex items-center ${!namePoste && "btn-disabled"}`}>
            <FontAwesomeIcon icon={faPhone} className="mr-1 w-5 h-5" />
            Appeler le suivant
          </Link>
        </div>
      </div>

      {tickets.length === 0 ? (
        <EmptyState message="Aucun ticket en attente" IconComponent="Bird" />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket, index) => {
            const totalWaitTime = tickets.slice(0, index).reduce((acc, prevTicket) => acc + prevTicket.avgTime, 0)

            return (
              <TicketComponent
                key={ticket.id}
                ticket={ticket}
                totalWaitTime={totalWaitTime}
                index={index}
              />
            )
          })}
        </div>
      )}
    </Wrapper>
  );
}

export default Page;