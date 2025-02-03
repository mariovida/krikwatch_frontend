import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

import AddTimeModal from "./AddTimeModal";

moment.locale("en-GB", {
  week: {
    dow: 1,
  },
});
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [events, setEvents] = useState<
    { id?: number; title: string; start: Date; end: Date }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    id?: number;
    title: string;
    start: Date;
    end: Date;
  } | null>(null);

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
          const formattedEvents = response.data.availability[0].map(
            (availability: {
              id: number;
              user_name: string;
              start_time: string | number | Date;
              end_time: string | number | Date;
            }) => ({
              id: availability.id,
              title: `${availability.user_name}`,
              start: new Date(availability.start_time),
              end: new Date(availability.end_time),
            })
          );
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
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: {
    id?: number;
    title: string;
    start: Date;
    end: Date;
  }) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleSubmitNewEvent = async (newEvent: {
    id?: number;
    user_name: string;
    start_time: string;
    end_time: string;
  }) => {
    const { user_name, start_time, end_time, id } = newEvent;

    try {
      const token = localStorage.getItem("accessToken");

      if (id) {
        await axios.put(
          `${backendUrl}/api/calendar/${id}`,
          { user_name, start_time, end_time },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(
          events.map((event) =>
            event.id === id
              ? {
                  ...event,
                  title: user_name,
                  start: new Date(start_time),
                  end: new Date(end_time),
                }
              : event
          )
        );
        window.location.reload();
      } else {
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
            title: user_name,
            start: new Date(start_time),
            end: new Date(end_time),
          },
        ]);
        window.location.reload();
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating availability:", error);
    }
  };

  return (
    <>
      <section style={{ paddingBottom: "80px" }} className="custom-calendar">
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <div style={{ height: "660px" }}>
                <Calendar
                  localizer={localizer}
                  culture="en-GB"
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  step={30}
                  defaultView="month"
                  min={new Date(2025, 1, 1, 7, 0)}
                  max={new Date(2025, 1, 1, 21, 0)}
                  style={{ height: "100%" }}
                  views={{
                    day: true,
                    month: true,
                  }}
                  selectable
                  onSelectEvent={handleSelectEvent}
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
        selectedDate={selectedEvent || selectedDate}
        eventToEdit={selectedEvent}
      />
    </>
  );
};

export default CalendarPage;
