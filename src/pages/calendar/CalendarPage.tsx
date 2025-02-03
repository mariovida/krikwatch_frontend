import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

import AddTimeModal from "./AddTimeModal";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (import.meta.env.VITE_ENV === "production") {
      backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
    }

    const [events, setEvents] = useState<{ id?: number; title: string; start: Date; end: Date }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<{ start: Date; end: Date } | null>(null);

    useEffect(() => {
        const fetchAvailability = async () => {
          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${backendUrl}/api/calendar`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response && response.data && response.data.availability) {
                const formattedEvents = response.data.availability[0].map((availability: { id: number; user_name: string; start_time: string | number | Date; end_time: string | number | Date; }) => ({
                  id: availability.id,
                  title: `${availability.user_name} - Available`,
                  start: new Date(availability.start_time),
                  end: new Date(availability.end_time),
                }));
                setEvents(formattedEvents);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchAvailability();
    }, [backendUrl]);

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setSelectedDate({ start, end });
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
    
      // Handle new event submission
      const handleSubmitNewEvent = async (newEvent: { user_name: string; start_time: string; end_time: string }) => {
        const { user_name, start_time, end_time } = newEvent;
        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            `${backendUrl}/api/calendar`,
            { user_name, start_time, end_time },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEvents([
            ...events,
            {
              title: `${user_name} - Available`,
              start: new Date(start_time),
              end: new Date(end_time),
            },
          ]);
        } catch (error) {
          console.error("Error adding availability:", error);
        }
      };

    return (
    <>
    <section>
        <div className="wrapper">
            <div className="row">
                <div className="col-12">
                    <div style={{ height: "700px" }}>
                    <h2>Availability Calendar</h2>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        step={30}
                        defaultView="month"
                        min={new Date(2025, 1, 1, 8, 0)}
                        max={new Date(2025, 1, 1, 21, 0)} 
                        style={{ height: "100%" }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                    />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <AddTimeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitNewEvent}
        selectedDate={selectedDate}
      />
    </>
    );
};

export default CalendarPage;