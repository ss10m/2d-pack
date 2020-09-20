// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./NavBar.scss";

const NavBar = (props) => {
    let searchField = (
        <SearchInput
            value={props.orderId}
            handleInputChange={props.handleInputChange}
            onKeyPress={props.onKeyPress}
            submit={props.handleSubmit}
        />
    );

    return (
        <div
            className={classNames("navbar", {
                navExpanded: props.expanded,
            })}
        >
            <div className="top">
                <div className="left">
                    {props.windowSize < 500 && (
                        <div className="navbar-toggle-btn">
                            <FontAwesomeIcon
                                icon="bars"
                                size="2x"
                                className="bars"
                                onClick={props.toggleNavbar}
                            />
                        </div>
                    )}

                    <Link to="/" className="title">
                        <FontAwesomeIcon
                            icon="cubes"
                            size="1x"
                            className="cubes"
                            onClick={props.toggleNavbar}
                        />
                        2D-PACK
                    </Link>
                </div>
                <div className="right">
                    {props.windowSize >= 500 && searchField}
                </div>
            </div>
            {props.expanded && <div className="bottom">{searchField}</div>}
        </div>
    );
};

const SearchInput = ({ handleInputChange, value, onKeyPress, submit }) => {
    return (
        <div className="search-input">
            <div className="icon">
                <FontAwesomeIcon icon="search" size="1x" />
            </div>
            <input
                type="text"
                spellCheck={false}
                value={value}
                placeholder="Order #"
                autoComplete="off"
                onChange={handleInputChange}
                onKeyPress={onKeyPress}
                autoFocus
            />
            <button onClick={submit}>Search</button>
        </div>
    );
};

export default NavBar;
