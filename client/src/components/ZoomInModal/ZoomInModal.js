// Libraries & utils
import React from "react";
import classNames from "classnames";
import { Stage, Layer } from "react-konva";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./ZoomInModal.scss";

function ZoomInModal(props) {
    let { items, canvasWidth, canvasHeight, Layout } = props;
    return (
        <div className="zoom-in-modal" onClick={props.onBackgroundClick}>
            <Header
                box={items.box}
                currentLayout={props.currentLayout}
                totalLayouts={props.totalLayouts}
            />
            <NavigationButtons
                showArrows={props.showArrows}
                changeItems={props.changeItems}
                hideZoom={props.hideZoom}
                NEXT_BOX={props.NEXT_BOX}
                PREV_BOX={props.PREV_BOX}
            />
            <LayoutWrapper
                items={items}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                Layout={Layout}
            />
        </div>
    );
}

function Header({ box: { name, width, height }, currentLayout, totalLayouts }) {
    let header = `${name} [${width} in x ${height} in] - ${currentLayout} of ${totalLayouts}`;
    return <div className="header">{header}</div>;
}

function NavigationButtons(props) {
    let { hideZoom, changeItems, NEXT_BOX, PREV_BOX } = props;
    return (
        <>
            <NavigationIcon className={"exit"} icon={"times"} onClick={hideZoom} />
            {props.showArrows && (
                <>
                    <NavigationIcon
                        className={"next"}
                        icon={"chevron-right"}
                        onClick={() => changeItems(NEXT_BOX)}
                    />
                    <NavigationIcon
                        className={"prev"}
                        icon={"chevron-left"}
                        onClick={() => changeItems(PREV_BOX)}
                    />
                </>
            )}
        </>
    );
}

function NavigationIcon(props) {
    let { className, icon, onClick } = props;
    return (
        <div
            className={classNames("navigation-btn", "animation", className)}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} size="2x" />
        </div>
    );
}

function LayoutWrapper(props) {
    let { items, canvasWidth, canvasHeight, Layout } = props;
    return (
        <div className="layout">
            <div className="box">
                <Stage width={canvasWidth} height={canvasHeight}>
                    <Layer>
                        <Layout
                            items={items}
                            canvasWidth={canvasWidth}
                            canvasHeight={canvasHeight}
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}

export default ZoomInModal;
