import React from 'react';
import './menu-position-left.css';
import MenuPosition from "../menu-position";

class MenuPositionLeft extends MenuPosition {
    constructor(props) {
        super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseUnHover = this.handleMouseUnHover.bind(this);
        let selectedOptions = {};
        props.options.forEach(item => {
            if (item.active) {
                selectedOptions[item.id] = item;
            }
        })
        this.state = {
            count: 1,
            selectedOptions: selectedOptions,
            isHovering: false,
            componentClassName: 'menu-position-left'
        };
    }

    render() {
        return (
            <div className={this.getPositionClassName()}>
                <div className={this.state.componentClassName + "__wrap"}>
                    {this.renderInfoColumn()}
                    {this.renderImageColumn()}
                </div>
            </div>
        );
    }
}

export default MenuPositionLeft;
