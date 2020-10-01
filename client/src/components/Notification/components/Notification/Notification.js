// Libraries & utils
import React from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./Notification.scss";

const Notification = React.forwardRef((props, ref) => {
    const { notification } = props;
    return (
        <div
            ref={ref.notificationRef}
            style={props.outerStyle}
            key={notification.id}
            onClick={props.removeNotification}
            onTransitionEnd={props.onTransitionEnd}
            onAnimationEnd={props.onAnimationEnd}
        >
            <div
                className={props.innerClass}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            >
                <div className="body">
                    <div className="icon">
                        <FontAwesomeIcon icon={props.icon} size="2x" />
                    </div>
                    <div className="message">{notification.message}</div>
                </div>
                <div className="indicator">
                    <div style={props.indicatorStyle} ref={ref.indicatorRef} />
                </div>
            </div>
        </div>
    );
});

export default Notification;
