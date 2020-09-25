import React from "react";
import { Toast } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { removeToast } from "store/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./toast.css";

class ToastCustom extends React.Component {
    removeToast = (toast) => {
        this.props.dispatch(removeToast(toast));
    };

    getToasts = () => {
        var toasts = this.props.toasts.map((toast, index) => (
            <Toast
                key={index}
                onClose={() => this.removeToast(toast)}
                className="toastAnimation"
            >
                <Toast.Header>
                    <div
                        className={
                            "toast-box rounded mr-2 toast-box-" + toast.type
                        }
                    />
                    <strong className="mr-auto">{toast.title}</strong>
                </Toast.Header>
                <Toast.Body>{toast.msg}</Toast.Body>
            </Toast>
        ));
        return toasts;
    };

    getToasts2 = () => {
        var toasts = this.props.toasts.map((toast, index) => (
            <div key={index} className="toast-new newAnimation">
                <div className="toast_identifier"></div>
                <div className="toast_container">
                    <div className="toast_top">
                        <div className="toast_body">{toast.msg}</div>
                        <div className="toast_close">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => this.removeToast(toast)}
                            >
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </div>
                    </div>
                    <div className="toast_bottom"></div>
                </div>
            </div>
        ));
        return toasts;
    };

    render() {
        return (
            <div className="toast-custom">
                <div className="toast-container">{this.getToasts()}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        toasts: state.toasts,
    };
}

export default withRouter(connect(mapStateToProps)(ToastCustom));
