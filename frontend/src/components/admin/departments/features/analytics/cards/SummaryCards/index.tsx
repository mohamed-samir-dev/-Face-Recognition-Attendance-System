'use client';

import { SummaryCardsProps } from '../../../../types';
import { createCardData } from './CardData/CardData';
import CardGrid from './CardGrid';

export default function SummaryCards({ departmentCount, totalEmployees, totalBudget }: SummaryCardsProps) {
  const cards = createCardData(departmentCount, totalEmployees, totalBudget);
  return <CardGrid cards={cards} />;
}