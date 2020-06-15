import React from "react";
import { Image } from "react-konva";

class LayoutImage extends React.Component {
    render() {
        const isRotated = this.props.height > this.props.width ? true : false;
        const rotation = isRotated ? 90 : 0;
        const x = isRotated ? this.props.x + this.props.width : this.props.x;
        let width = this.props.width;
        let height = this.props.height;
        if (isRotated) [width, height] = [height, width];
        return (
            <Image
                x={x}
                y={this.props.y}
                width={width}
                height={height}
                image={this.props.img}
                rotation={rotation}
                preventDefault={false}
            />
        );
    }
}

export default LayoutImage;
