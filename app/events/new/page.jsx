"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateEvent as createEventAPI } from "../../services/PostServices";

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
    frequency: "",
    daysOfWeek: [],
    recurringEndDate: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else {
          delete newErrors.title;
        }
        break;
      case 'startDate':
        if (!value) {
          newErrors.startDate = 'Start date is required';
        } else {
          delete newErrors.startDate;
          if (formData.endDate && value >= formData.endDate) {
            newErrors.endDate = 'End date must be after start date';
          } else {
            delete newErrors.endDate;
          }
        }
        break;
      case 'endDate':
        if (!value) {
          newErrors.endDate = 'End date is required';
        } else if (formData.startDate && value <= formData.startDate) {
          newErrors.endDate = 'End date must be after start date';
        } else {
          delete newErrors.endDate;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        ...formData,
        daysOfWeek: formData.daysOfWeek.length > 0 ? formData.daysOfWeek.join(",") : null,
        recurringEndDate: formData.recurringEndDate || null,
      };

      const result = await createEventAPI(payload);
      
      if (result.success) {
        router.push("/");
      } else {
        alert(result.message || "Failed to create event");
      }
    } catch (error) {
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const weekdays = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Create Event</h1>
              <p className="text-gray-600 text-sm sm:text-base">Add a new event to your calendar</p>
            </div>
            <Link
              href="/"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base sm:text-lg ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
                rows="3"
                placeholder="Add event description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base sm:text-lg ${
                    errors.startDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  min={formData.startDate || new Date().toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base sm:text-lg ${
                    errors.endDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isRecurring: e.target.checked,
                    frequency: e.target.checked ? prev.frequency : "",
                    daysOfWeek: e.target.checked ? prev.daysOfWeek : [],
                    recurringEndDate: e.target.checked ? prev.recurringEndDate : ""
                  }))}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <div>
                  <span className="text-base sm:text-lg font-semibold text-gray-800">Recurring Event</span>
                  <p className="text-gray-600 text-xs sm:text-sm">Make this event repeat on a schedule</p>
                </div>
              </label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-6 bg-blue-50 rounded-xl p-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      frequency: e.target.value,
                      daysOfWeek: e.target.value === "WEEKLY" ? prev.daysOfWeek : []
                    }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg bg-white"
                  >
                    <option value="">Select frequency</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>

                {formData.frequency === "WEEKLY" && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Days of Week
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {weekdays.map(day => (
                        <label key={day.value} className="flex items-center bg-white rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.daysOfWeek.includes(day.value)}
                            onChange={() => handleDayToggle(day.value)}
                            className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <span className="text-sm font-medium text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Recurring End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringEndDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg bg-white"
                  />
                  <p className="text-sm text-gray-600 mt-2">Leave empty for indefinite recurrence</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}