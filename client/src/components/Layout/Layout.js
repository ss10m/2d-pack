// Libraries & utils
import React, { Fragment } from "react";
import { Rect, Image, Text, Label, Tag } from "react-konva";

// Helpers
import { calculcateOffsets } from "helpers";

function Layout(props) {
    const {
        items: { items, box },
        canvasWidth,
        canvasHeight,
    } = props;
    const boxWidth = box.width;
    const boxHeight = box.height;
    const { offsetX, offsetY } = calculcateOffsets(items, box, canvasWidth, canvasHeight);
    const centerOffset = 5;
    const sizeOffset = 10;

    let ret = [];
    items.forEach((item) => {
        ret.push(
            <Fragment key={item.id}>
                <Rect
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
                    x={canvasWidth * (item.x / boxWidth) + offsetX + centerOffset}
                    y={canvasHeight * (item.y / boxHeight) + offsetY + centerOffset}
                    width={canvasWidth * (item.width / boxWidth) - sizeOffset}
                    height={canvasHeight * (item.height / boxHeight) - sizeOffset}
                    rotated={item.rotated}
                />
                <Label
                    x={canvasWidth * (item.x / boxWidth) + offsetX + centerOffset}
                    y={canvasHeight * (item.y / boxHeight) + offsetY + centerOffset}
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
    const isRotated = props.rotated;
    const rotation = isRotated ? 270 : 0;
    const x = props.x;
    const y = isRotated ? props.y + height : props.y;
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
