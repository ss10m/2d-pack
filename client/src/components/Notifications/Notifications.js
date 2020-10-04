// Libraries & utils
import React from "react";

// Components
import Notification from "./components/Notification/NotificationContainer";

// SCSS
import "./Notifications.scss";

function Notifications({ notifications, counter, remove }) {
    return (
        <div className="notifications">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    counter={counter}
                    remove={remove}
                />
            ))}
        </div>
    );
}

export default Notifications;
