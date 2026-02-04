import ReasonItem from './ReasonItem';
import {ReasonsListProps} from "../../types"
export default function ReasonsList({ absenceReasons }: ReasonsListProps) {
  return (
    <div className="space-y-4">
      {absenceReasons.slice(0, 3).map((reason) => (
        <ReasonItem key={reason.reason} reason={reason} />
      ))}
    </div>
  );
}