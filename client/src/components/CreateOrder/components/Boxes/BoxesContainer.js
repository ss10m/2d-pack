// Libraries & utils
import React from "react";

// Componenets
import Boxes from "./Boxes.js";

// Helpers
import { isNumeric } from "helpers";
import { BOX_COLOR } from "helpers/constants";

class BoxesContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addBox: false,
            boxWidth: "",
            boxHeight: "",
        };
    }

    onInputChange = (key) => {
        return (event) => {
            let value = event.target.value;
            if (value < 0 || value > 999) return;
            this.setState({ [key]: value });
        };
    };

    showAddBox = () => {
        let { boxes } = this.props;
        if (boxes.length > 6) return;
        this.setState({
            addBox: true,
        });
    };

    hideAddBox = () => {
        this.setState({
            addBox: false,
            boxWidth: "",
            boxHeight: "",
        });
    };

    confirmAddBox = () => {
        let { boxWidth, boxHeight } = this.state;
        if (!boxWidth || !boxHeight) return;
        if (!isNumeric(boxWidth)) return;
        if (!isNumeric(boxHeight)) return;

        let newBox = {
            width: parseInt(boxWidth),
            height: parseInt(boxHeight),
            color: this.getUniqueBoxColor(),
            weight: 10,
        };
        const boxes = [...this.props.boxes, newBox];
        this.props.updateState("boxes", boxes);
        this.hideAddBox();
    };

    getUniqueBoxColor = () => {
        let current = new Set();
        this.props.boxes.forEach((box) => current.add(box.color));
        let unique = Object.entries(BOX_COLOR).filter(([key, value]) => !current.has(value));
        return unique[Math.floor(Math.random() * unique.length)][1];
    };

    removeBox = (box) => {
        let { boxes } = this.props;
        let updatedBoxes = boxes.filter((currentBox) => currentBox !== box);
        this.props.updateState("boxes", updatedBoxes);
    };

    render() {
        return (
            <Boxes
                {...this.state}
                boxes={this.props.boxes}
                showAddBox={this.showAddBox}
                confirmAddBox={this.confirmAddBox}
                hideAddBox={this.hideAddBox}
                removeBox={this.removeBox}
                onInputChange={this.onInputChange}
            />
        );
    }
}

export default BoxesContainer;
