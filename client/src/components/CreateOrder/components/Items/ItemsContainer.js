import React from "react";

import Items from "./Items";

import { itemOutlineColors, isNumeric, getRandomImg } from "helpers";

class ItemsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddItem: false,
            itemUrl: "",
            itemWidth: "",
            itemHeight: "",
            itemId: "",
            itemOutlineColor: "",
        };
    }

    onInputChange = (key) => {
        return (event) => {
            let value = event.target.value;
            if (key === "itemId" && (value < 0 || value > 999999)) return;
            if (
                (key === "itemWidth" || key === "itemHeight") &&
                (value < 0 || value > 999)
            )
                return;
            this.updateState(key, value);
        };
    };

    updateState = (key, value) => {
        this.setState({ [key]: value });
    };

    addItem = () => {
        console.log("ADDING ITEM");
        let {
            itemUrl,
            itemWidth,
            itemHeight,
            itemId,
            itemOutlineColor,
        } = this.state;

        if (!itemWidth || !itemHeight || !itemId || !itemOutlineColor) return;
        if (!isNumeric(itemWidth)) return;
        if (!isNumeric(itemHeight)) return;

        if (!itemUrl) itemUrl = getRandomImg();
        /*
        if (!itemUrl.match(/(http|https)\:\/\//i))
            itemUrl = "https://" + itemUrl;
        */

        let item = {
            url: itemUrl,
            width: parseInt(itemWidth),
            height: parseInt(itemHeight),
            id: itemId,
            color: itemOutlineColor.toLowerCase(),
        };

        const items = [...this.props.items, item];
        this.props.updateState("items", items);
        this.hideAddItem();
    };

    hideAddItem = () => {
        this.setState({
            showAddItem: false,
            itemUrl: "",
            itemWidth: "",
            itemHeight: "",
            itemId: "",
            itemOutlineColor: "",
        });
    };

    removeItem = (item) => {
        let { items } = this.props;
        let updatedItems = items.filter((currentItem) => currentItem !== item);
        this.props.updateState("items", updatedItems);
    };

    render() {
        return (
            <Items
                {...this.state}
                items={this.props.items}
                addItem={this.addItem}
                hideAddItem={this.hideAddItem}
                removeItem={this.removeItem}
                onInputChange={this.onInputChange}
                updateState={this.updateState}
                itemOutlineColors={itemOutlineColors}
            />
        );
    }
}

export default ItemsContainer;
