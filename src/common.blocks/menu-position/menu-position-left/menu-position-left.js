import React from 'react';
import './menu-position-left.css';
import MenuPosition from "../menu-position";

class MenuPositionLeft extends MenuPosition {
    constructor(props) {
        super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseUnHover = this.handleMouseUnHover.bind(this);
        this.renderInfoColumn = this.renderInfoColumn.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
        this.state = {
            count: 1,
            selectedOptions: props.selectedOptions,
            isHovering: false,
            componentClassName: 'menu-position-left',
            showImage: true,
        };
    }

    render() {
        return <div className={this.getPositionClassName()}>
            <div className={this.state.componentClassName + "__wrap"}>
                {this.renderInfoColumn()}
                {this.renderImageColumn()}
            </div>
        </div>;
    }
}

export default MenuPositionLeft;
