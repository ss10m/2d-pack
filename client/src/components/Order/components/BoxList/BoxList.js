import React from "react";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BoxList.scss";

function BoxList(props) {
    console.log(props);
    return (
        <div className="order-list">
            <div className="order-list-boxes">
                <OrderId orderId={props.orderId} />
                <BoxesContainer {...props} />
                <CarrierOptions
                    carrier={props.carrier}
                    fetchingLabels={props.fetchingLabels}
                    updateState={props.updateState}
                />
                <PrintLabelsBtn
                    fetchingLabels={props.fetchingLabels}
                    printLabels={props.printLabels}
                />
            </div>
        </div>
    );
}

function OrderId({ orderId }) {
    return (
        <div className="order-list-id-container">
            <div className="order-list-id-icon">
                <FontAwesomeIcon icon="file-alt" size="sm" />
            </div>
            {"Order #" + orderId}
        </div>
    );
}

function BoxesContainer(props) {
    return (
        <div
            style={{
                boxShadow: "0px 0px 2px 1px #80808030",
                borderRadius: "5px 5px 0 0",
            }}
        >
            <BoxesHeader updateState={props.updateState} />
            <Boxes {...props} />
            {props.showAddBox && <AddBox {...props} />}
        </div>
    );
}

function BoxesHeader({ updateState }) {
    return (
        <div className="order-list-boxes-header">
            <div className="order-list-boxes-header-icon">
                <FontAwesomeIcon icon="box" size="sm" />
            </div>
            <div className="order-list-boxes-title">Boxes</div>
            <div className="order-list-box-btn">
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
            className="order-list-box grow"
            style={{
                height: props.showDetailsIndex === index ? "120px" : "50px",
            }}
            onClick={() => props.showBoxDetails(index)}
        >
            <div
                className="order-list-box-bar"
                style={{
                    backgroundColor: box.color,
                }}
            >
                {index + 1}
            </div>

            <div className="order-list-box-rows ">
                <div
                    className="order-list-box-top-row"
                    style={{
                        height: props.showDetailsIndex !== index ? "100%" : "50%",
                    }}
                >
                    <div className="order-list-box-info">
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
                    <div className="order-list-box-btn">
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
        <div className="order-list-box-details ">
            <div className="order-list-box-details-info">
                <div className="order-list-box-details-info-top">Width</div>
                <div className="order-list-box-details-info-bottom">{box.width + " in"}</div>
            </div>
            <div className="order-list-box-details-info">
                <div className="order-list-box-details-info-top">Height</div>
                <div className="order-list-box-details-info-bottom">{box.height + " in"}</div>
            </div>
            <div className="order-list-box-details-info">
                <div className="order-list-box-details-info-top">Weight</div>
                <div className="order-list-box-details-info-bottom">{box.weight + " lb"}</div>
            </div>
        </div>
    );
}

function AddBox(props) {
    let color = props.boxSize ? props.boxSize.color : "#808080";
    return (
        <div className="order-list-add-new-box">
            <div className="order-list-box-bar" style={{ backgroundColor: color }}>
                {props.boxes.length + 1}
            </div>
            <div className="order-list-add-new-box-inside">
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
            <div className="order-list-add-new-box-btn">
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
            <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                size="sm"
                className="test1111"
            >
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

function CarrierOptions({ carrier, fetchingLabels, updateState }) {
    return (
        <ButtonGroup className="order-group-toggle display-only">
            <CarrierButton
                carrier={carrier}
                name="Auto"
                fetchingLabels={fetchingLabels}
                updateState={updateState}
            />
            <CarrierButton
                carrier={carrier}
                name="Purolator"
                fetchingLabels={fetchingLabels}
                updateState={updateState}
            />
            <CarrierButton
                carrier={carrier}
                name="FedEx"
                fetchingLabels={fetchingLabels}
                updateState={updateState}
            />
            <CarrierButton
                carrier={carrier}
                name="Canada Post"
                fetchingLabels={fetchingLabels}
                updateState={updateState}
            />
        </ButtonGroup>
    );
}

function CarrierButton({ carrier, name, fetchingLabels, updateState }) {
    return (
        <Button
            variant="secondary"
            onClick={() => {
                updateState({ carrier: name });
            }}
            active={carrier === name}
            disabled={fetchingLabels}
        >
            {name}
        </Button>
    );
}

function PrintLabelsBtn({ fetchingLabels, printLabels }) {
    return (
        <div className="order-list-print-btn">
            <Button variant="secondary" onClick={printLabels} disabled={fetchingLabels} block>
                {fetchingLabels && (
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="order-btn-spinner"
                    />
                )}
                {fetchingLabels ? "Loading" : "Print Labels"}
            </Button>
        </div>
    );
}

export default BoxList;
