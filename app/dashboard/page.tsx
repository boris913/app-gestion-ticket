"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Wrapper from '../components/Wrapper';
import { useUser } from '@clerk/nextjs';
import { get10LstFinishedTicketsByEmail, getTicketStatsByEmail } from '../actions';
import { Ticket } from '@/type';
import EmptyState from '../components/EmptyState';
import TicketComponent from '../components/TicketComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { faTicketAlt, faCheckCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

const Page: React.FC = () => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState({
        totalTickets: 0,
        resolvedTickets: 0,
        pendingTickets: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTicketsAndStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (email) {
                const data = await get10LstFinishedTicketsByEmail(email);
                if (data) {
                    setTickets(data);
                }
                const statsData = await getTicketStatsByEmail(email);
                if (statsData) {
                    setStats(statsData);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchTicketsAndStats();
    }, [email, fetchTicketsAndStats]);

    return (
        <Wrapper>
            <h1 className="text-2xl font-bold mb-4">Statistiques</h1>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <>
                    <div className='w-full flex flex-col md:flex-row mb-4 gap-4'>
                        <StatCard 
                            title='Total Tickets' 
                            value={stats.totalTickets} 
                            icon={faTicketAlt} 
                        />
                        <StatCard 
                            title='Tickets Résolus' 
                            value={stats.resolvedTickets} 
                            icon={faCheckCircle} 
                        />
                        <StatCard 
                            title='Tickets En Attente' 
                            value={stats.pendingTickets} 
                            icon={faHourglassHalf} 
                        />
                    </div>

                    <h1 className="text-2xl font-bold mb-4">Les 10 derniers Tickets servis</h1>

                    {tickets.length === 0 ? (
                        <EmptyState
                            message={'Aucun ticket en attente'}
                            IconComponent='Bird'
                        />
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
                </>
            )}
        </Wrapper>
    );
}

export default Page;