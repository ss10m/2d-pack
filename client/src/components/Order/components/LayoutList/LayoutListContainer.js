// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";

// Components
import LayoutList from "./LayoutList";

// Helpers
import { parseBoxInfo } from "helpers";

class LayoutContainer extends React.Component {
    zoomIn = (index) => {
        this.props.setZoomIn(index);
    };

    render() {
        let { items, windowSize } = this.props;
        let canvasWidth = Math.max(300, Math.min(450, windowSize - 30));
        return (
            <LayoutList
                items={items}
                canvasWidth={canvasWidth}
                parseBoxInfo={parseBoxInfo}
                zoomIn={this.zoomIn}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.items,
        windowSize: state.windowSize,
    };
};

export default connect(mapStateToProps)(LayoutContainer);
