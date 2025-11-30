"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EventDetail({ params }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const { id } = await params;
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      
      if (data.success) {
        setEvent(data.data);
      } else {
        router.push("/events");
      }
    } catch (error) {
      router.push("/events");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { id } = await params;
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.push("/events");
      }
    } catch (error) {
      alert("Failed to delete event");
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

  if (loading) {
    return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  }

  if (!event) {
    return <div className="max-w-2xl mx-auto p-6">Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Details</h1>
        <div className="flex gap-2">
          <Link
            href="/events"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </Link>
          <Link
            href={`/events/${event.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={deleteEvent}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
          {event.description && (
            <p className="text-gray-600">{event.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Start Date & Time</h3>
            <p>{formatDate(event.startDate)}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">End Date & Time</h3>
            <p>{formatDate(event.endDate)}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Recurrence</h3>
          {event.isRecurring ? (
            <div>
              <p>Frequency: {event.frequency}</p>
              {event.frequency === "WEEKLY" && event.daysOfWeek && (
                <p>Days: {event.daysOfWeek}</p>
              )}
            </div>
          ) : (
            <p>One-time event</p>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Status</h3>
          <p>{event.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div className="text-sm text-gray-500 pt-4 border-t">
          <p>Created: {formatDate(event.createdAt)}</p>
          <p>Updated: {formatDate(event.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}