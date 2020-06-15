import React, { Fragment } from "react";
import { Rect, Text, Label, Tag } from "react-konva";

import LayoutImage from "../layoutImage/layoutImage.js";

class Layout extends React.Component {
    drawLayout = () => {
        const { items } = this.props;
        const canvasWidth = this.props.canvasWidth;
        const canvasHeight = (items["box"].height / items["box"].width) * canvasWidth;
        const boxWidth = items["box"].width;
        const boxHeight = items["box"].height;
        const { offsetX, offsetY } = this.calculcateOffsets(items, canvasWidth, canvasHeight);

        let ret = [];
        for (let item of items["items"]) {
            ret.push(
                <Fragment key={item.id}>
                    <Rect
                        name="rectange2"
                        x={canvasWidth * (item.x / boxWidth) + offsetX}
                        y={canvasHeight * (item.y / boxHeight) + offsetY}
                        width={canvasWidth * (item.width / boxWidth)}
                        height={canvasHeight * (item.height / boxHeight)}
                        fill={item.bcolor}
                        stroke="black"
                        strokeWidth={1}
                    />
                    <LayoutImage
                        src={item.url}
                        img={item.img}
                        x={canvasWidth * (item.x / boxWidth) + offsetX + 5}
                        y={canvasHeight * (item.y / boxHeight) + offsetY + 5}
                        width={canvasWidth * (item.width / boxWidth) - 10}
                        height={canvasHeight * (item.height / boxHeight) - 10}
                    />
                    <Label
                        x={canvasWidth * (item.x / boxWidth) + offsetX + 5}
                        y={canvasHeight * (item.y / boxHeight) + offsetY + 5}
                    >
                        <Tag fill="black" shadowColor="black" />
                        <Text text={item.id} fontSize={16} padding={3} fill="white" />
                    </Label>
                </Fragment>
            );
        }
        return ret;
    };

    calculcateOffsets = (currentBox, canvasWidth, canvasHeight) => {
        let maxPosX = 0;
        let maxPosY = 0;

        currentBox["items"].forEach((item) => {
            if (item.x + item.width > maxPosX) maxPosX = item.x + item.width;
            if (item.y + item.height > maxPosY) maxPosY = item.y + item.height;
        });

        let offsetX = Math.round((((currentBox.box.width - maxPosX) / currentBox.box.width) * canvasWidth) / 2);
        let offsetY = Math.round((((currentBox.box.height - maxPosY) / currentBox.box.height) * canvasHeight) / 2);

        return { offsetX: offsetX, offsetY: offsetY };
    };

    render() {
        return this.drawLayout();
    }
}

export default Layout;
