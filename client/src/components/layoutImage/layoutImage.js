import React from "react";
import { Image } from "react-konva";

class LayoutImage extends React.Component {
    render() {
        var isRotated = this.props.height > this.props.width ? true : false;
        var rotation = isRotated ? 90 : 0;
        var x = isRotated ? this.props.x + this.props.width : this.props.x;
        var width = this.props.width;
        var height = this.props.height;
        if (isRotated) [width, height] = [height, width];
        return (
            <Image x={x} y={this.props.y} width={width} height={height} image={this.props.img} rotation={rotation} />
        );
    }
}

export default LayoutImage;
