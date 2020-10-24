// Libraries & utils
import React from "react";
import { Stage, Layer } from "react-konva";

// Components
import Layout from "components/Layout/Layout";

// SCSS
import "./LayoutList.scss";

function LayoutList(props) {
    let { items, canvasWidth, zoomIn } = props;
    let canvasHeight = 0;
    let layouts = [];
    let totalLayouts = items.length;
    items.forEach((items, i) => {
        canvasHeight = (items.box.height / items.box.width) * canvasWidth;
        layouts.push(
            <div className="layout" key={i}>
                <Header box={items.box} currentLayout={i + 1} totalLayouts={totalLayouts} />
                <div className="stage" onClick={() => zoomIn(i)}>
                    <Stage width={canvasWidth} height={canvasHeight}>
                        <Layer>
                            <Layout
                                items={items}
                                canvasWidth={canvasWidth}
                                canvasHeight={canvasHeight}
                                zoomEnabled={true}
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    });
    return <div className="order-layouts">{layouts}</div>;
}

function Header({ box: { name, width, height }, currentLayout, totalLayouts }) {
    return (
        <div className="header">
            <p>{name}</p>
            <p>{`${width} in x ${height} in`}</p>
            <p>{`${currentLayout} of ${totalLayouts}`}</p>
        </div>
    );
}

export default LayoutList;
