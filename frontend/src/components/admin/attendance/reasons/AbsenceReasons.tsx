import { AbsenceReasonsProps } from '../types';
import ReasonsList from './components/ReasonsList';

export default function AbsenceReasons({ absenceReasons }: AbsenceReasonsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Common Absence Reasons</h3>
      <ReasonsList absenceReasons={absenceReasons} />
    </div>
  );
}