// Libraries & utils
import React from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";

// Components
import Layout from "components/Layout/Layout";
import ZoomInModal from "./ZoomInModal";

// Constants
import { PREV_BOX, NEXT_BOX, LEFT_KEY, RIGHT_KEY, ESCAPE_KEY } from "helpers/constants";

class ZoomInModalContainer extends React.Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        this.setupHistoryListener();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        this.historyListener();
    }

    setupHistoryListener = () => {
        let { history, location } = this.props;
        history.push(location.pathname);
        this.historyListener = history.listen((newLocation, action) => {
            console.log(action);
            if (action === "POP") {
                this.props.setZoomIn(null);
            }
        });
    };

    handleBackgroundClick = (event) => {
        event.preventDefault();
        if (event.target.className === "layout") {
            this.closeZoomIn();
        }
    };

    closeZoomIn = () => {
        this.props.setZoomIn(null);
        this.props.history.go(-1);
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
                this.closeZoomIn();
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
        if (nextIndex !== null) this.props.setZoomIn(nextIndex);
    };

    render() {
        const { zoomIn } = this.props;
        const items = this.props.items[zoomIn];
        let { height, width } = items.box;

        let canvasWidth = Math.max(320, Math.min(this.props.windowSize - 50, 800));
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
                hideZoom={this.closeZoomIn}
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
    items: state.items,
});

export default withRouter(connect(mapStateToProps)(ZoomInModalContainer));
