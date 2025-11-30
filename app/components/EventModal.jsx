"use client";
import { useState, useEffect } from "react";
import { GetSingleEvent } from "../services/GetServices";
import { StopEvent, HardDeleteEvent, RestoreEvent } from "../services/PostServices";

export default function EventModal({ eventId, isOpen, onClose, onEventUpdate }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null });

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEvent();
    }
  }, [isOpen, eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await GetSingleEvent(eventId);
      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopEvent = async () => {
    try {
      const data = await StopEvent(eventId);
      if (data.success) {
        onEventUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Failed to stop event:", error);
    }
    setDeleteModal({ show: false, type: null });
  };

  const handleHardDelete = async () => {
    try {
      const data = await HardDeleteEvent(eventId);
      if (data.success) {
        onEventUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
    setDeleteModal({ show: false, type: null });
  };

  const handleRestoreEvent = async () => {
    try {
      const data = await RestoreEvent(eventId);
      if (data.success) {
        onEventUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Failed to restore event:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFrequencyDisplay = (event) => {
    if (!event?.isRecurring) return "One-time event";
    
    let display = event.frequency;
    if (event.frequency === "WEEKLY" && event.daysOfWeek) {
      display += ` (${event.daysOfWeek})`;
    }
    return display;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full sm:w-auto sm:max-w-2xl mx-auto
        bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:scale-95'}
        max-h-[90vh] overflow-y-auto
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-2xl p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Event Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : event ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Event Info */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                    event.isRecurring ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{event.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:text-base">
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Start: {formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>End: {formatDate(event.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{getFrequencyDisplay(event)}</span>
                  </div>
                  {event.recurringEndDate && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Recurring until: {formatDate(event.recurringEndDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <a
                  href={`/events/${event.id}/edit`}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </a>
                
                {event.isActive ? (
                  <button
                    onClick={() => setDeleteModal({ show: true, type: 'stop' })}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Stop
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRestoreEvent}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restore
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, type: 'delete' })}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Forever
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Event not found</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {deleteModal.type === 'stop' ? 'Stop Event' : 'Delete Event'}
              </h3>
              <p className="text-gray-600 mb-6">
                {deleteModal.type === 'stop' 
                  ? `Are you sure you want to stop "${event?.title}"? You can reactivate it later.`
                  : `Are you sure you want to permanently delete "${event?.title}"? This action cannot be undone.`
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, type: null })}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteModal.type === 'stop' ? handleStopEvent : handleHardDelete}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium ${
                    deleteModal.type === 'stop' 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {deleteModal.type === 'stop' ? 'Stop Event' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}