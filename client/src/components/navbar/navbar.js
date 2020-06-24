import React from "react";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";

import "./navbar.css";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: "",
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var orderId = this.state.orderId;
        var intOnly = /^\d+$/.test(orderId);
        var intLen = orderId.toString().length;

        if (!intOnly || intLen !== 6) return;
        this.props.setOrderId(orderId);
        this.setState({ orderId: "" });
        this.props.history.push("/order/" + orderId);
    };

    handleInputChange = (event) => {
        event.preventDefault();

        this.setState({ orderId: event.target.value });
    };

    render() {
        return (
            <Navbar bg="dark" expand="lg" fixed="top">
                <Navbar.Brand className="navbar-header">
                    <Link to={"/"} className="navbar-header">
                        <b>2D-SHIP</b>
                    </Link>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    <Form onSubmit={this.handleSubmit} inline>
                        <FormControl
                            type="text"
                            placeholder="Order #"
                            className="mr-sm-2"
                            value={this.state.orderId}
                            onChange={this.handleInputChange}
                            required
                        />
                        <Button variant="outline-light" type="submit">
                            Search
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(NavBar);
