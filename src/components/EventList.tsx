import React from "react";
import { useEventContext } from "../components/eventContext";

const EventList: React.FC = () => {
    const { events } = useEventContext();

    return (
        <div style={{ padding: "20px", backgroundColor: "#f5f5f5", border: "1px solid #ddd" }}>
            <h3>Saved Events</h3>
            {events.length > 0 ? (
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            <strong>Event:</strong> {event.event} <br />
                            <strong>User:</strong> {event.user.name} {event.user.lastName} <br />
                            <strong>Email:</strong> {event.user.email} <br />
                            <strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events saved yet.</p>
            )}
        </div>
    );
};

export default EventList;
