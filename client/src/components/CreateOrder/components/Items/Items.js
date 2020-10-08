// Libraries & utils
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, FormControl, Dropdown } from "react-bootstrap";

// SCSS
import "./Items.scss";

function Items(props) {
    let { showAddItem, updateState } = props;
    return (
        <div className="create-order-items">
            <ItemsHeader showAddItem={showAddItem} updateState={updateState} />
            <ItemsList {...props} />
        </div>
    );
}

function ItemsHeader({ showAddItem, updateState }) {
    return (
        <div
            className="create-order-header"
            style={showAddItem ? { borderBottomColor: "#f5f5f5" } : {}}
        >
            <div className="header-title">
                <div>
                    <FontAwesomeIcon icon="clipboard-list" size="sm" className="icon-color" />
                </div>
                <span>Items</span>
            </div>
            <div className="opt-btn">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateState("showAddItem", true)}
                >
                    Add Item
                </button>
            </div>
        </div>
    );
}

function ItemsList(props) {
    let { items, showAddItem, updateState } = props;
    if ((items === undefined || items.length === 0) && showAddItem === false) {
        return (
            <div className="empty-items">
                <FontAwesomeIcon
                    icon="plus-circle"
                    size="5x"
                    className="icon-color"
                    onClick={() => updateState("showAddItem", true)}
                />
            </div>
        );
    } else {
        let ret = [];
        if (showAddItem) ret.push(<AddItem key="addItem" {...props} />);
        items.forEach((item, index) => {
            ret.push(
                <Item key={index} index={index} item={item} removeItem={props.removeItem} />
            );
        });
        return ret;
    }
}

function Item({ item, index, removeItem }) {
    return (
        <div className="item" key={index}>
            <div className="img">
                <img src={item.url} alt=""></img>
            </div>
            <div className="dimensions">
                <div>WIDTH</div>
                <div>{item.width + " IN"}</div>
            </div>
            <div className="dimensions">
                <div>HEIGHT</div>
                <div>{item.height + " IN"}</div>
            </div>
            <div className="remove-btn">
                <div className="icon" onClick={() => removeItem(item)}>
                    <FontAwesomeIcon icon="times" size="2x" />
                </div>
            </div>
        </div>
    );
}

function AddItem(props) {
    return (
        <div className="add-item" key="addBox">
            <InputGroup size="sm">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-white">
                        Image URL
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="(leave blank for random image)"
                    value={props.itemUrl}
                    onChange={props.onInputChange("itemUrl")}
                />
            </InputGroup>

            <div className="input-fields">
                <div>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text className="bg-secondary text-white text-field">
                                Width
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={props.itemWidth}
                            onChange={props.onInputChange("itemWidth")}
                            type={"number"}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text className="bg-white">in</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text className="bg-secondary text-white text-field">
                                Height
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={props.itemHeight}
                            onChange={props.onInputChange("itemHeight")}
                            type={"number"}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text className="bg-white">in</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </div>

            <div className="input-fields">
                <div>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text className="bg-secondary text-white text-field">
                                Item ID
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={props.itemId}
                            onChange={props.onInputChange("itemId")}
                            type={"number"}
                        />
                    </InputGroup>
                </div>
                <div>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="secondary"
                            id="dropdown-basic"
                            size="sm"
                            block
                        >
                            {props.itemOutlineColor
                                ? props.itemOutlineColor
                                : "Outline Color"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {props.itemOutlineColors.map((color, i) => (
                                <Dropdown.Item
                                    key={i}
                                    onClick={() =>
                                        props.updateState("itemOutlineColor", color)
                                    }
                                >
                                    {color}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <div className="control-btns">
                <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={props.addItem}
                >
                    Confirm
                </button>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={props.hideAddItem}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default Items;
