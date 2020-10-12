// Libraries & utils
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";

// SCSS
import "./BoxList.scss";

function BoxList(props) {
    return (
        <div className="box-list">
            <OrderId orderId={props.orderId} />
            <BoxesContainer {...props} />
            <CarrierOptions carrier={props.carrier} updateState={props.updateState} />
            <PrintLabelsButton
                fetchingLabels={props.fetchingLabels}
                printLabels={props.printLabels}
            />
        </div>
    );
}

function OrderId({ orderId }) {
    return (
        <div className="box-list-id">
            <div className="icon">
                <FontAwesomeIcon icon="file-alt" size="sm" />
            </div>
            {"Order #" + orderId}
        </div>
    );
}

function BoxesContainer(props) {
    return (
        <div className="box-list-container">
            <BoxesHeader updateState={props.updateState} />
            <Boxes {...props} />
            {props.showAddBox && <AddBox {...props} />}
        </div>
    );
}

function BoxesHeader({ updateState }) {
    return (
        <div className="box-list-header">
            <div className="icon">
                <FontAwesomeIcon icon="box" size="sm" />
            </div>
            <div className="title">Boxes</div>
            <div className="add-box-btn">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={() => updateState({ showAddBox: true })}
                >
                    Add Box
                </button>
            </div>
        </div>
    );
}

function Boxes(props) {
    return props.boxes.map((box, index) => (
        <Box
            key={index}
            box={box}
            index={index}
            showDetailsIndex={props.showDetailsIndex}
            showBoxDetails={props.showBoxDetails}
            removeBox={props.removeBox}
        />
    ));
}

function Box(props) {
    let { box, index } = props;
    return (
        <div
            key={index}
            className="box"
            style={{
                height: props.showDetailsIndex === index ? "120px" : "50px",
            }}
            onClick={() => props.showBoxDetails(index)}
        >
            <div
                className="indicator"
                style={{
                    backgroundColor: box.color,
                }}
            >
                {index + 1}
            </div>

            <div className="box-list-rows">
                <div
                    className="top"
                    style={{
                        height: props.showDetailsIndex !== index ? "100%" : "50%",
                    }}
                >
                    <div className="info">
                        {box.name}
                        {box.quantity > 1 && (
                            <span
                                style={{
                                    color: "red",
                                    marginLeft: "15px",
                                    fontWeight: "500",
                                }}
                            >
                                {"x" + box.quantity}
                            </span>
                        )}
                    </div>
                    <div className="remove-btn">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={(e) => props.removeBox(e, index)}
                        >
                            <FontAwesomeIcon icon="times" size="lg" />
                        </button>
                    </div>
                </div>
                {props.showDetailsIndex === index && <BoxExpanded box={box} />}
            </div>
        </div>
    );
}

function BoxExpanded({ box }) {
    return (
        <div className="expanded">
            <div className="info">
                <div className="upper">Width</div>
                <div className="lower">{box.width + " in"}</div>
            </div>
            <div className="info">
                <div className="upper">Height</div>
                <div className="lower">{box.height + " in"}</div>
            </div>
            <div className="info">
                <div className="upper">Weight</div>
                <div className="lower">{box.weight + " lb"}</div>
            </div>
        </div>
    );
}

function AddBox(props) {
    let color = props.boxSize ? props.boxSize.color : "#808080";
    return (
        <div className="box-list-add-box">
            <div className="indicator" style={{ backgroundColor: color }}>
                {props.boxes.length + 1}
            </div>
            <div className="details">
                <BoxSizes
                    choices={props.choices}
                    boxSize={props.boxSize}
                    updateState={props.updateState}
                />
                <BoxQuantity
                    boxQuantity={props.boxQuantity}
                    updateState={props.updateState}
                />
            </div>
            <div className="add-box-btn">
                <button
                    type="button"
                    className="btn btn-success btn-sm btn-block"
                    onClick={props.confirmAddBox}
                >
                    Confirm
                </button>
                <button
                    type="button"
                    className="btn btn-danger btn-sm btn-block"
                    onClick={props.hideAddBox}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function BoxSizes(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                {props.boxSize ? props.boxSize.name : "Box Size"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {props.choices.map((boxSize, i) => (
                    <Dropdown.Item key={i} onClick={() => props.updateState({ boxSize })}>
                        {boxSize.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

function BoxQuantity(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                {props.boxQuantity ? "Quantity " + props.boxQuantity : "Box Quantity"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {[...Array(10).keys()].map((i) => (
                    <Dropdown.Item
                        key={i + 1}
                        onClick={() => props.updateState({ boxQuantity: i + 1 })}
                    >
                        {"Quantity " + (i + 1)}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

function CarrierOptions({ carrier, updateState }) {
    return (
        <ButtonGroup className="box-list-group-toggle">
            <CarrierButton carrier={carrier} name="Auto" updateState={updateState} />
            <CarrierButton carrier={carrier} name="Purolator" updateState={updateState} />
            <CarrierButton carrier={carrier} name="FedEx" updateState={updateState} />
            <CarrierButton carrier={carrier} name="Canada Post" updateState={updateState} />
        </ButtonGroup>
    );
}

function CarrierButton({ carrier, name, updateState }) {
    return (
        <Button
            variant="secondary"
            onClick={() => {
                updateState({ carrier: name });
            }}
            active={carrier === name}
        >
            {name}
        </Button>
    );
}

function PrintLabelsButton({ fetchingLabels, printLabels }) {
    return (
        <Button variant="secondary" onClick={printLabels} disabled={fetchingLabels} block>
            {fetchingLabels && (
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="box-list-submit-spinner"
                />
            )}
            {fetchingLabels ? "Loading" : "Print Labels"}
        </Button>
    );
}

export default BoxList;
