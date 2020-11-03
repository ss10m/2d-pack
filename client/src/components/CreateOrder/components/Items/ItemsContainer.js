// Libraries & utils
import React from "react";

// Components
import Items from "./Items";

// Helpers
import { isNumeric, getRandomImg } from "helpers";
import { ITEM_OUTLINE_COLOR } from "helpers/constants";

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
            if ((key === "itemWidth" || key === "itemHeight") && (value < 0 || value > 999))
                return;
            this.updateState(key, value);
        };
    };

    updateState = (key, value) => {
        this.setState({ [key]: value });
    };

    addItem = () => {
        let { itemUrl, itemWidth, itemHeight, itemId, itemOutlineColor } = this.state;

        if (!itemWidth || !itemHeight || !itemId) return;
        if (!isNumeric(itemWidth)) return;
        if (!isNumeric(itemHeight)) return;

        if (!itemOutlineColor) {
            let outlineColors = Object.values(ITEM_OUTLINE_COLOR);
            let randomColor = Math.floor(Math.random() * outlineColors.length);
            itemOutlineColor = outlineColors[randomColor];
        }

        itemWidth = parseInt(itemWidth);
        itemHeight = parseInt(itemHeight);
        let ratio = Math.max(itemHeight, itemWidth) / Math.min(itemHeight, itemWidth);
        if (!itemUrl) itemUrl = getRandomImg(ratio);

        itemId = String(itemId);
        for (let item of this.props.items) {
            if (item.id === itemId) {
                let notification = {
                    type: "error",
                    message: "Item ID must be unique",
                    duration: 5000,
                };
                return this.props.addNotification(notification);
            }
        }

        let item = {
            url: itemUrl,
            width: itemWidth,
            height: itemHeight,
            id: itemId,
            color: itemOutlineColor.toLowerCase(),
        };

        this.checkImage(item);
    };

    checkImage = (item) => {
        const image = new window.Image();
        image.onload = () => {
            const items = [...this.props.items, item];
            this.props.updateState("items", items);
            this.hideAddItem();
        };
        image.onerror = () => {
            let notification = {
                type: "error",
                message: "Invalid image URL",
                duration: 5000,
            };
            this.props.addNotification(notification);
        };
        image.src = item.url;
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
                itemOutlineColors={Object.values(ITEM_OUTLINE_COLOR)}
            />
        );
    }
}

export default ItemsContainer;
