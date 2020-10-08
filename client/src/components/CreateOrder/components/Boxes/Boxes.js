// Libraries & utils
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, FormControl } from "react-bootstrap";

// SCSS
import "./Boxes.scss";

function Boxes(props) {
    let { showAddBox, updateState } = props;
    return (
        <div className="create-order-boxes">
            <BoxesHeader showAddBox={showAddBox} updateState={updateState} />
            <BoxList {...props} />
        </div>
    );
}

function BoxesHeader({ showAddBox, updateState }) {
    return (
        <div
            className="create-order-header"
            style={showAddBox ? { borderBottomColor: "#f5f5f5" } : {}}
        >
            <div className="header-title">
                <div>
                    <FontAwesomeIcon icon="box" size="sm" className="icon-color" />
                </div>
                <span>Boxes</span>
            </div>
            <div className="opt-btn">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateState("showAddBox", true)}
                >
                    Add Box
                </button>
            </div>
        </div>
    );
}

function BoxList(props) {
    let { boxes, showAddBox, updateState } = props;
    if ((boxes === undefined || boxes.length === 0) && showAddBox === false) {
        return (
            <div className="empty-boxes">
                <FontAwesomeIcon
                    icon="plus-circle"
                    size="5x"
                    className="icon-color"
                    onClick={() => updateState("showAddBox", true)}
                />
            </div>
        );
    } else {
        let ret = [];
        if (showAddBox) ret.push(<AddBox key="addBox" {...props} />);
        boxes.forEach((box, index) => {
            ret.push(<Box box={box} key={index} index={index} removeBox={props.removeBox} />);
        });

        return ret;
    }
}

function Box({ box, index, removeBox }) {
    return (
        <div className="box" key={index}>
            <div className="indicator" style={{ backgroundColor: box.color }} />
            <div className="name">{`Box #${index + 1}`}</div>
            <div className="dimensions">
                <div>WIDTH</div>
                <div>{box.width + " IN"}</div>
            </div>
            <div className="dimensions">
                <div>HEIGHT</div>
                <div>{box.height + " IN"}</div>
            </div>
            <div className="remove-btn">
                <div className="icon" onClick={() => removeBox(box)}>
                    <FontAwesomeIcon icon="times" size="2x" />
                </div>
            </div>
        </div>
    );
}

function AddBox(props) {
    let { boxes } = props;
    if (boxes.length >= 7) return;
    return (
        <div className="add-box" key="addBox">
            <InputGroup size="sm">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-white">
                        Box Name
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={`Box #${boxes.length + 1}`} disabled />
            </InputGroup>

            <div className="input-fields">
                <div>
                    <InputGroup size="sm" className="width">
                        <InputGroup.Prepend>
                            <InputGroup.Text className="bg-secondary text-white text-field">
                                Width
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={props.boxWidth}
                            onChange={props.onInputChange("boxWidth")}
                            type={"number"}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text className="bg-white">in</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div>
                    <InputGroup size="sm" className="width" style={{ float: "right" }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="bg-secondary text-white text-field">
                                Height
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={props.boxHeight}
                            onChange={props.onInputChange("boxHeight")}
                            type={"number"}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text className="bg-white">in</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </div>

            <div className="control-btns">
                <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={props.addBox}
                >
                    Confirm
                </button>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={props.hideAddBox}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default Boxes;
