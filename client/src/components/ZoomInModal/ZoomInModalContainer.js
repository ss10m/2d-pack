// Libraries & utils
import React from "react";
import ReactDOM from "react-dom";

// Redux
import { connect } from "react-redux";
import { hideZoom, showZoom } from "store/actions";

// Components
import Layout from "components/Layout/Layout";
import ZoomInModal from "./ZoomInModal";

// Constants
import { PREV_BOX, NEXT_BOX, LEFT_KEY, RIGHT_KEY, ESCAPE_KEY } from "helpers/constants";

class ZoomModal extends React.Component {
    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick, true);
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleOutsideClick, true);
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleOutsideClick = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.hideZoom();
        }
    };

    handleBackgroundClick = (event) => {
        event.preventDefault();
        let className = event.target.className;
        if (className === "zoom-in-modal" || className === "layout") {
            this.props.hideZoom();
        }
    };

    handleKeyDown = (event) => {
        switch (event.keyCode) {
            case LEFT_KEY:
                this.changeItems(PREV_BOX);
                break;
            case RIGHT_KEY:
                this.changeItems(NEXT_BOX);
                break;
            case ESCAPE_KEY:
                this.props.hideZoom();
                break;
            default:
                break;
        }
    };

    changeItems = (direction) => {
        var { zoomIn, items } = this.props;
        if (items.length <= 1 || zoomIn === null) return;
        let nextIndex = null;
        switch (direction) {
            case PREV_BOX:
                if (zoomIn - 1 >= 0) nextIndex = zoomIn - 1;
                else if (zoomIn === 0) nextIndex = items.length - 1;
                break;
            case NEXT_BOX:
                if (zoomIn + 1 < items.length) nextIndex = zoomIn + 1;
                else if (zoomIn + 1 === items.length) nextIndex = 0;
                break;
            default:
                return;
        }
        if (nextIndex !== null) this.props.showZoom(nextIndex);
    };

    render() {
        const { zoomIn, hideZoom } = this.props;
        const items = this.props.items[zoomIn];
        let { height, width } = items.box;

        let canvasWidth = Math.min(this.props.windowSize - 50, 800);
        let canvasHeight = (height / width) * canvasWidth;
        if (window.innerHeight - 100 < canvasHeight) {
            canvasHeight = window.innerHeight - 100;
            canvasWidth = (width / height) * canvasHeight;
        }

        let totalLayouts = this.props.items.length;
        let showArrows = totalLayouts > 1;

        return (
            <ZoomInModal
                items={items}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                showArrows={showArrows}
                onBackgroundClick={this.handleBackgroundClick}
                changeItems={this.changeItems}
                hideZoom={hideZoom}
                PREV_BOX={PREV_BOX}
                NEXT_BOX={NEXT_BOX}
                Layout={Layout}
                currentLayout={zoomIn + 1}
                totalLayouts={totalLayouts}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    windowSize: state.windowSize,
    zoomIn: state.zoomIn,
    items: state.items,
});

const mapDispatchToProps = (dispatch) => ({
    hideZoom: () => {
        dispatch(hideZoom());
    },
    showZoom: (index) => {
        dispatch(showZoom(index));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ZoomModal);
