'use client';

import { TableRowProps } from '../../../../../types';
import UserNameCell from '../cells/UserNameCell';
import StatusCell from '../cells/StatusCell';
import ActionsCell from '../cells/ActionsCell';


export default function TableRow({ user, deleting, onEdit, onDelete, onChangePassword, getStatusColor, getStatusText, hideDelete }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <UserNameCell image={user.image} name={user.name} />
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.email || "No contact"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.Department || user.department || "Not Assigned"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.jobTitle || "Not Assigned"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.accountType || "Employee"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
        ${user.salary?.toLocaleString() || "Not Set"}
      </td>
      <StatusCell 
        status={user.status}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
      <ActionsCell 
        user={user}
        deleting={deleting}
        onEdit={onEdit}
        onDelete={onDelete}
        onChangePassword={onChangePassword}
        hideDelete={hideDelete}
      />
    </tr>
  );
}