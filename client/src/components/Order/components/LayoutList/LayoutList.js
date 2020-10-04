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
                <div className="header">
                    {props.parseBoxInfo(items.box, i + 1, totalLayouts)}
                </div>
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

export default LayoutList;
