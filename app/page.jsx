"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./components/EventModal";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(transformEventsForCalendar(data.data));
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformEventsForCalendar = (events) => {
    const calendarEvents = [];
    
    events.forEach(event => {
      if (!event.isRecurring) {
        calendarEvents.push({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
        });
      } else {
        // Generate recurring events from start date to recurring end date
        const startDate = new Date(event.startDate);
        const endDate = event.recurringEndDate ? new Date(event.recurringEndDate) : new Date(new Date().getFullYear() + 2, 11, 31);
        
        generateRecurringEvents(event, startDate, endDate).forEach(recurringEvent => {
          calendarEvents.push(recurringEvent);
        });
      }
    });
    
    return calendarEvents;
  };

  const generateRecurringEvents = (event, startDate, endDate) => {
    const events = [];
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    if (event.frequency === 'MONTHLY') {
      let currentDate = new Date(eventStart);
      const originalDay = eventStart.getDate();
      
      while (currentDate <= endDate) {
        const eventEndTime = new Date(currentDate.getTime() + duration);
        events.push({
          id: `${event.id}-${currentDate.getTime()}`,
          title: event.title,
          start: new Date(currentDate),
          end: eventEndTime,
          backgroundColor: '#10b981',
          borderColor: '#059669',
        });
        
        // Move to next month, keeping the same day
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(originalDay);
      }
    } else {
      // Handle daily and weekly recurring events
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        let shouldAdd = false;
        
        if (event.frequency === 'DAILY') {
          shouldAdd = true;
        } else if (event.frequency === 'WEEKLY' && event.daysOfWeek) {
          const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const dayName = dayNames[currentDate.getDay()];
          shouldAdd = event.daysOfWeek.includes(dayName);
        }
        
        if (shouldAdd && currentDate >= eventStart) {
          const eventEndTime = new Date(currentDate.getTime() + duration);
          events.push({
            id: `${event.id}-${currentDate.getTime()}`,
            title: event.title,
            start: new Date(currentDate),
            end: eventEndTime,
            backgroundColor: '#10b981',
            borderColor: '#059669',
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return events;
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id.split('-')[0];
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

  const handleDateClick = (dateInfo) => {
    const date = dateInfo.dateStr;
    window.location.href = `/events/new?date=${date}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Event Calendar</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your events and schedule</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/events"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">View List</span>
                <span className="sm:hidden">List</span>
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
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'today'
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={2}
            moreLinkClick="popover"
            eventTextColor="white"
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity text-xs sm:text-sm"
            dayCellClassNames="hover:bg-blue-50 cursor-pointer transition-colors"
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day'
            }}
            dayHeaderClassNames="text-xs sm:text-sm"
            titleFormat={{ year: 'numeric', month: 'short' }}
          />
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Guide</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600 text-sm sm:text-base">One-time Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 text-sm sm:text-base">Recurring Events</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Tap date to create • Tap event for details
            </div>
          </div>
        </div>
        
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