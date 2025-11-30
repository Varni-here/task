"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GetAllEvents } from "../services/GetServices";
import { StopEvent, HardDeleteEvent, RestoreEvent } from "../services/PostServices";
import EventModal from "../components/EventModal";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [deleteModal, setDeleteModal] = useState({ show: false, event: null });
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const params = activeTab === "stopped" ? { stopped: "true" } : {};
      const data = await GetAllEvents(params);
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopEvent = async (id) => {
    try {
      const data = await StopEvent(id);
      if (data.success) {
        setEvents(events.filter(event => event.id !== id));
        setDeleteModal({ show: false, event: null });
      }
    } catch (error) {
      console.error("Failed to stop event:", error);
    }
  };

  const handleHardDelete = async (id) => {
    try {
      const data = await HardDeleteEvent(id);
      if (data.success) {
        setEvents(events.filter(event => event.id !== id));
        setDeleteModal({ show: false, event: null });
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleRestoreEvent = async (id) => {
    try {
      const data = await RestoreEvent(id);
      if (data.success) {
        setEvents(events.filter(event => event.id !== id));
      }
    } catch (error) {
      console.error("Failed to restore event:", error);
    }
  };

  const handleViewEvent = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const handleEventUpdate = () => {
    fetchEvents();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFrequencyDisplay = (event) => {
    if (!event.isRecurring) return "One-time";
    
    let display = event.frequency;
    if (event.frequency === "WEEKLY" && event.daysOfWeek) {
      display += ` (${event.daysOfWeek})`;
    }
    return display;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">All Events</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and organize your events</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </Link>
              <Link
                href="/events/new"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4 sm:mt-6 bg-gray-100 p-1 rounded-lg sm:rounded-xl">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === "active"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="hidden sm:inline">Active Events</span>
              <span className="sm:hidden">Active</span>
            </button>
            <button
              onClick={() => setActiveTab("stopped")}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === "stopped"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="hidden sm:inline">Stopped Events</span>
              <span className="sm:hidden">Stopped</span>
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first event</p>
            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-200 border border-gray-100"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mt-1 sm:mt-2 flex-shrink-0 ${
                        event.isRecurring ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{event.description}</p>
                        )}
                        <div className="grid grid-cols-1 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Start: {formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>End: {formatDate(event.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{getFrequencyDisplay(event)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium flex items-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ show: true, event })}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {activeTab === "active" ? "Stop" : "Delete"}
                    </button>
                    {activeTab === "stopped" && (
                      <button
                        onClick={() => handleRestoreEvent(event.id)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Delete Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {activeTab === "active" ? "Stop Event" : "Delete Event"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "active" 
                    ? `Are you sure you want to stop "${deleteModal.event?.title}"? You can reactivate it later from stopped events.`
                    : `Are you sure you want to permanently delete "${deleteModal.event?.title}"? This action cannot be undone.`
                  }
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({ show: false, event: null })}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  {activeTab === "active" ? (
                    <button
                      onClick={() => handleStopEvent(deleteModal.event.id)}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium"
                    >
                      Stop Event
                    </button>
                  ) : (
                    <button
                      onClick={() => handleHardDelete(deleteModal.event.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                    >
                      Delete Forever
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Event Modal */}
        <EventModal
          eventId={selectedEventId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEventUpdate={handleEventUpdate}
        />
      </div>
    </div>
  );
}