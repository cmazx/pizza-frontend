import React from 'react';
import './menu-position-list.css';
import MenuPosition from "../menu-position/menu-position";
import MenuPositionLeft from "../menu-position/menu-position-left/menu-position-left";

class MenuPositionList extends React.Component {

    render() {

        return (
            <div className="menu-position-list">
                {this.props.items.map((item, i) => {
                    let matrixPosition = ((i+1) % 4);
                    let reflected = (matrixPosition === 3) || (matrixPosition === 0);

                    if (i%2) {
                        return <MenuPosition {...item}
                                             key={i}
                                             optionGroups={this.props.optionGroups}
                                             onAddToCart={this.props.onAddToCart}
                                             index={matrixPosition}
                                             pizzaPosition = {this.props.pizzaList}
                                             reflected={reflected}/>;
                    } else {
                        return <MenuPositionLeft {...item}
                                                 key={i}
                                                 optionGroups={this.props.optionGroups}
                                                 index={matrixPosition}
                                                 onAddToCart={this.props.onAddToCart}
                                                 pizzaPosition = {this.props.pizzaList}
                                                 reflected={reflected}/>;
                    }
                })}
            </div>
        );
    }
}

export default MenuPositionList;
