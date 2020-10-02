import React, { Fragment } from "react";
import { Rect, Image, Text, Label, Tag } from "react-konva";

import { calculcateOffsets } from "helpers";

function Layout(props) {
    const { items, canvasWidth, canvasHeight } = props;
    const boxWidth = items["box"].width;
    const boxHeight = items["box"].height;
    const { offsetX, offsetY } = calculcateOffsets(items, canvasWidth, canvasHeight);

    let ret = [];
    items.items.forEach((item) => {
        ret.push(
            <Fragment key={item.id}>
                <Rect
                    name="rectange2"
                    x={canvasWidth * (item.x / boxWidth) + offsetX}
                    y={canvasHeight * (item.y / boxHeight) + offsetY}
                    width={canvasWidth * (item.width / boxWidth)}
                    height={canvasHeight * (item.height / boxHeight)}
                    fill={item.color}
                    stroke="black"
                    strokeWidth={1}
                    preventDefault={false}
                />
                <Preview
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
                    preventDefault={false}
                >
                    <Tag fill="black" shadowColor="black" preventDefault={false} />
                    <Text
                        text={item.id}
                        fontSize={16}
                        padding={3}
                        fill="white"
                        preventDefault={false}
                    />
                </Label>
            </Fragment>
        );
    });
    return ret;
}

function Preview(props) {
    let { width, height } = props;
    const isRotated = height > width ? true : false;
    const rotation = isRotated ? 90 : 0;
    const x = isRotated ? props.x + width : props.x;
    const y = props.y;
    if (isRotated) [width, height] = [height, width];
    return (
        <Image
            x={x}
            y={y}
            width={width}
            height={height}
            image={props.img}
            rotation={rotation}
            preventDefault={false}
        />
    );
}

export default Layout;
