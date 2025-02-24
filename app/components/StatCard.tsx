import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faTicketAlt, faCheckCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconProp;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className='stats md:w-1/3 border border-base-200 pb-4 transition-transform transform hover:scale-105 hover:shadow-lg'>
            <div className='stat p-4 rounded-lg transition-colors hover:bg-base-100'>
                <div className='stat-icon text-accent pb-3 transition-all'>
                    <FontAwesomeIcon icon={icon} size="lg" />
                </div>
                <div className='stat-title text-lg font-semibold'>{title}</div>
                <div className='stat-value text-2xl font-bold'>{value}</div>
            </div>
        </div>
    );
}

export default StatCard;