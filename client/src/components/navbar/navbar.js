import React from "react";
import { Link, withRouter } from "react-router-dom";

import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import { setNavbar, toggleNavbar } from "../../store/actions";

import "./navbar.scss";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: "",
        };
    }

    componentDidUpdate() {
        let { navbarExpanded, windowSize } = this.props;
        if (navbarExpanded && windowSize >= 500) {
            console.log("2135213523");
            this.props.setNavbar(false);
        }
    }

    handleSubmit = (event) => {
        console.log("handleSubmit");
        event.preventDefault();
        let orderId = this.state.orderId;
        let intOnly = /^\d+$/.test(orderId);
        let intLen = orderId.toString().length;
        if (!intOnly || !intLen) return;
        this.setState({ orderId: "" });
        this.props.history.push("/order/" + orderId);
    };

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            this.handleSubmit(event);
        }
    };

    handleInputChange = (event) => {
        event.preventDefault();
        this.setState({ orderId: event.target.value });
    };

    toggleNavbar = (event) => {
        event.preventDefault();
        this.props.toggleNavbar();
    };

    render() {
        let { windowSize, navbarExpanded } = this.props;

        let expanded = navbarExpanded && windowSize < 500;

        let searchField = (
            <SearchField
                value={this.state.orderId}
                handleInputChange={this.handleInputChange}
                onKeyPress={this.onKeyPress}
                submit={this.handleSubmit}
            />
        );

        return (
            <div
                className={classNames("navbar", {
                    navExpanded: expanded,
                })}
            >
                <div className="top">
                    <div className="left">
                        {windowSize < 500 && (
                            <div className="navbar-toggle-btn">
                                <FontAwesomeIcon
                                    icon="bars"
                                    size="2x"
                                    className="bars"
                                    onClick={this.toggleNavbar}
                                />
                            </div>
                        )}
                        <Link to="/" className="title">
                            2D-PACK
                        </Link>
                    </div>
                    <div className="right">
                        {windowSize >= 500 && searchField}
                    </div>
                </div>

                {expanded && <div className="bottom">{searchField}</div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        navbarExpanded: state.navbarExpanded,
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setNavbar: (state) => {
        dispatch(setNavbar(state));
    },
    toggleNavbar: () => {
        dispatch(toggleNavbar());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));

const SearchField = ({ handleInputChange, value, onKeyPress, submit }) => {
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
