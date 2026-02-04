import { Users, UserCheck, UserX, Calendar } from 'lucide-react';

export const METRIC_CONFIGS = [
  {
    key: 'totalMembers',
    title: 'Total Team Members',
    icon: <Users className="w-6 h-6 text-blue-600" />,
    color: 'bg-blue-100'
  },
  {
    key: 'presentToday',
    title: 'Present Today',
    icon: <UserCheck className="w-6 h-6 text-green-600" />,
    color: 'bg-green-100'
  },
  {
    key: 'onLeaveToday',
    title: 'On Leave Today',
    icon: <Calendar className="w-6 h-6 text-orange-600" />,
    color: 'bg-orange-100'
  },
  {
    key: 'absentToday',
    title: 'Absent Today',
    icon: <UserX className="w-6 h-6 text-red-600" />,
    color: 'bg-red-100'
  }
];