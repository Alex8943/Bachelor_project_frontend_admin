import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUpdates } from "../service/apiclient"; // Import the getUpdates function

interface Event {
    event: string;
    user: {
        name: string;
        lastName: string;
        email: string;
    };
    timestamp: string;
    [key: string]: any;
}

interface EventContextType {
    events: Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);

    const EXPIRY_DURATION = 24 * 60 * 60 * 1000; 
    // 24 timer, gange 60 minutter, gange 60 sekunder, gange 1000 millisekunder 
    // EXPIRY_DURATION = enhed i millisekunder

    useEffect(() => {
        // Load events from localStorage and filter out expired events
        const savedEvents = localStorage.getItem("events");
        if (savedEvents) {
            const parsedEvents: Event[] = JSON.parse(savedEvents);
            const now = Date.now();

            // Filter out events older than 24 hours
            const validEvents = parsedEvents.filter(
                (event) => now - new Date(event.timestamp).getTime() <= EXPIRY_DURATION
            );

            setEvents(validEvents);

            // Save the filtered events back to localStorage
            localStorage.setItem("events", JSON.stringify(validEvents));
        }

        // Add debug logs inside the SSE handler
const eventSource = getUpdates((data: Event) => {
    console.log("New event received via SSE:", data);

            // Add new event to the state
            setEvents((prevEvents) => {
                console.log("Current events state:", prevEvents);
                console.log("Attempting to add event:", data);

                const isDuplicate = prevEvents.some(
                    (e) =>
                        e.timestamp === data.timestamp &&
                        e.user.email === data.user.email &&
                        e.event === data.event
                );

                if (isDuplicate) {
                    console.log("Duplicate event detected, skipping:", data);
                    return prevEvents; // Skip duplicates
                }

                const updatedEvents = [...prevEvents, data];

                console.log("Updated events state:", updatedEvents);

                // Save updated events to localStorage
                localStorage.setItem("events", JSON.stringify(updatedEvents));

                return updatedEvents;
            });
        });


        // Cleanup SSE connection on unmount
        return () => {
            eventSource.close();
            console.log("SSE connection closed");
        };
    }, []);

    return <EventContext.Provider value={{ events }}>{children}</EventContext.Provider>;
};

export const useEventContext = (): EventContextType => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error("useEventContext must be used within an EventProvider");
    }
    return context;
};
