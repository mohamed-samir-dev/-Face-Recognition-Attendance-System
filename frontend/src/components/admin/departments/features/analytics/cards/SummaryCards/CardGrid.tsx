'use client';
import SummaryCard from './SummaryCard';
import {CardGridProps}from "../../../../types"

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <SummaryCard
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
          colorClass={card.colorClass}
        />
      ))}
    </div>
  );
}