// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./ExtendedNavBar.scss";

const ExtendedBar = (props) => {
    return (
        <div className="extended-bar">
            <Link
                to="/streamers"
                className="link"
                onClick={() => props.toggleNavBar()}
            >
                <FontAwesomeIcon icon="bars" style={{ marginRight: "10px" }} />
                FOLLOWING
            </Link>
        </div>
    );
};

export default ExtendedBar;
