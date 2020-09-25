import React from "react";

import Boxes from "./Boxes.js";

import { boxColors, isNumeric } from "helpers";

class BoxesContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddBox: false,
            boxWidth: "",
            boxHeight: "",
        };
    }

    onInputChange = (key) => {
        return (event) => {
            let value = event.target.value;
            if (value < 0 || value > 999) return;
            this.updateState(key, event.target.value);
        };
    };

    updateState = (key, value) => {
        this.setState({ [key]: value });
    };

    addBox = () => {
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

    hideAddBox = () => {
        this.setState({
            showAddBox: false,
            boxWidth: "",
            boxHeight: "",
        });
    };

    getUniqueBoxColor = () => {
        let current = new Set();
        this.props.boxes.forEach((box) => current.add(box.color));
        let unique = boxColors.filter((color) => !current.has(color));
        return unique[Math.floor(Math.random() * unique.length)];
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
                addBox={this.addBox}
                hideAddBox={this.hideAddBox}
                removeBox={this.removeBox}
                onInputChange={this.onInputChange}
                updateState={this.updateState}
            />
        );
    }
}

export default BoxesContainer;
