import { AbsenceReasonsProps } from '../types';
import ReasonsList from './components/ReasonsList';

export default function AbsenceReasons({ absenceReasons }: AbsenceReasonsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Absence Reasons</h3>
      <ReasonsList absenceReasons={absenceReasons} />
    </div>
  );
}