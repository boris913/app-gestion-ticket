"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Wrapper from '../components/Wrapper';
import { useUser } from '@clerk/nextjs';
import { get10LstFinishedTicketsByEmail, getTicketStatsByEmail, getPosteStatsByEmail, getServiceStatsByEmail, getResolvedTicketsByPoste, getTicketsByService } from '../actions';
import { Ticket } from '@/type';
import EmptyState from '../components/EmptyState';
import TicketComponent from '../components/TicketComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { faCheckCircle, faHourglassHalf, faBriefcase, faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Page: React.FC = () => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState({
        totalTickets: 0,
        resolvedTickets: 0,
        pendingTickets: 0
    });
    const [posteStats, setPosteStats] = useState({
        totalPostes: 0
    });
    const [serviceStats, setServiceStats] = useState({
        totalServices: 0
    });
    const [resolvedTicketsByPoste, setResolvedTicketsByPoste] = useState({});
    const [ticketsByService, setTicketsByService] = useState({});
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
                const posteStatsData = await getPosteStatsByEmail(email);
                if (posteStatsData) {
                    setPosteStats(posteStatsData);
                }
                const serviceStatsData = await getServiceStatsByEmail(email);
                if (serviceStatsData) {
                    setServiceStats(serviceStatsData);
                }
                // Fetch resolved tickets by poste and tickets by service
                const resolvedTicketsByPosteData = await getResolvedTicketsByPoste(email);
                if (resolvedTicketsByPosteData) {
                    setResolvedTicketsByPoste(resolvedTicketsByPosteData);
                }
                const ticketsByServiceData = await getTicketsByService(email);
                if (ticketsByServiceData) {
                    setTicketsByService(ticketsByServiceData);
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

    const resolvedTicketsByPosteChartData = {
        labels: Object.keys(resolvedTicketsByPoste),
        datasets: [
            {
                label: 'Tickets Résolus par Poste',
                data: Object.values(resolvedTicketsByPoste),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const ticketsByServiceChartData = {
        labels: Object.keys(ticketsByService).map(service => service.length > 10 ? service.slice(0, 10) + '...' : service),
        datasets: [
            {
                label: 'Tickets par Service',
                data: Object.values(ticketsByService),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <Wrapper>
            <h1 className="text-2xl font-bold mb-4">Statistiques</h1>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard 
                            title='Tickets Résolus' 
                            value={stats.resolvedTickets} 
                            icon={faCheckCircle} 
                            className="border-green-500 text-green-500"
                        />
                        <StatCard 
                            title='Tickets En Attente' 
                            value={stats.pendingTickets} 
                            icon={faHourglassHalf} 
                            className="border-orange-500 text-orange-500"
                        />
                        <StatCard 
                            title='Total des Postes' 
                            value={posteStats.totalPostes} 
                            icon={faBriefcase} 
                            className="border-blue-500 text-blue-500"
                        />
                        <StatCard 
                            title='Total des Services' 
                            value={serviceStats.totalServices} 
                            icon={faConciergeBell} 
                            className="border-purple-500 text-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Tickets Résolus par Poste</h2>
                            <Bar data={resolvedTicketsByPosteChartData} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">Tickets par Service</h2>
                            <Bar data={ticketsByServiceChartData} />
                        </div>
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