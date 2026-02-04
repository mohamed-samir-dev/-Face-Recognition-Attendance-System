import { X } from 'lucide-react';
import { ModalProps } from '../types';

export default function Modal({ isOpen, onClose, request, onStatusUpdate }: ModalProps) {
  if (!isOpen || !request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Leave Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Employee Name</label>
              <p className="text-gray-900 font-medium">{request.employeeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employee ID</label>
              <p className="text-gray-900">{request.employeeId}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Leave Type</label>
              <p className="text-gray-900">{request.leaveType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900">{new Date(request.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">End Date</label>
              <p className="text-gray-900">{new Date(request.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Leave Days</label>
              <p className="text-gray-900 font-semibold">{request.leaveDays} {request.leaveDays === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Reason</label>
            <p className="text-gray-900 mt-1">{request.reason || 'No reason provided'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Submitted</label>
              <p className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{new Date(request.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {request.status === "Pending" && (
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={() => {
                onStatusUpdate(request.id, "Rejected");
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
            >
              Reject
            </button>
            <button
              onClick={() => {
                onStatusUpdate(request.id, "Approved");
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}