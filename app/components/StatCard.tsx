import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconProp;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className }) => {
    return (
        <div className={`stats md:w-1/1 border-2 pb-4 transition-transform transform hover:scale-105 hover:shadow-lg ${className}`}>
            <div className='stat p-4 rounded-lg transition-colors hover:bg-base-100'>
                <div className='stat-icon pb-3 transition-all'>
                    <FontAwesomeIcon icon={icon} size="lg" />
                </div>
                <div className='stat-title text-lg font-semibold'>{title}</div>
                <div className='stat-value text-2xl font-bold'>{value}</div>
            </div>
        </div>
    );
}

export default StatCard;