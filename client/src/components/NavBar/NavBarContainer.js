// Libraries & utils
import React from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { setNavbar, toggleNavbar } from "store/actions";

// Components
import NavBar from "./NavBar.js";

class NavBarContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: "",
        };
    }

    componentDidUpdate() {
        let { navbarExpanded, windowSize } = this.props;
        if (navbarExpanded && windowSize >= 500) {
            this.props.setNavbar(false);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let orderId = this.state.orderId;
        if (!orderId.length) return;
        this.setState({ orderId: "" });
        if (this.props.navbarExpanded) {
            this.props.setNavbar(false);
        }
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

    render() {
        let { navbarExpanded, windowSize, toggleNavbar } = this.props;
        let expanded = navbarExpanded && windowSize < 500;

        return (
            <NavBar
                orderId={this.state.orderId}
                expanded={expanded}
                windowSize={windowSize}
                toggleNavbar={toggleNavbar}
                handleInputChange={this.handleInputChange}
                onKeyPress={this.onKeyPress}
                handleSubmit={this.handleSubmit}
            />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarContainer));
