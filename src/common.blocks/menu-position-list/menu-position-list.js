import React from 'react';
import './menu-position-list.css';
import MenuPosition from "../menu-position/menu-position";
import MenuPositionLeft from "../menu-position/menu-position-left/menu-position-left";

class MenuPositionList extends React.Component {
    getGroupedOptions(position) {
        let groups = [];
        let defaultValues = [];

        position.options.forEach((optionValue) => {
            if (!groups[optionValue.option_id]) {
                let optionGroup = this.props.optionGroups
                    .filter((group) => (group.id === optionValue.option_id))
                    .shift();
                groups[optionValue.option_id] = {"options": [], "name": optionGroup.name};
                defaultValues[optionValue.option_id] = optionValue;
            }
            groups[optionValue.option_id].options.push(optionValue);
        });

        return {groups: groups, defaults: defaultValues};
    }


    render() {

        return (
            <div className="menu-position-list">
                {this.props.items.map((item, i) => {
                    let matrixPosition = ((i + 1) % 4);
                    let reflected = (matrixPosition === 3) || (matrixPosition === 0);
                    let groupData = this.getGroupedOptions(item);
                    if (i % 2) {
                        return <MenuPosition position={item}
                                             key={item.id}
                                             optionGroups={this.props.optionGroups}
                                             onAddToCart={this.props.onAddToCart}
                                             index={matrixPosition}
                                             pizzaPosition={this.props.pizzaList}
                                             selectedOptions={groupData.defaults}
                                             groups={groupData.groups}
                                             reflected={reflected}/>;
                    } else {
                        return <MenuPositionLeft position={item}
                                                 key={item.id}
                                                 optionGroups={this.props.optionGroups}
                                                 index={matrixPosition}
                                                 onAddToCart={this.props.onAddToCart}
                                                 pizzaPosition={this.props.pizzaList}
                                                 selectedOptions={groupData.defaults}
                                                 groups={groupData.groups}
                                                 reflected={reflected}/>;
                    }
                })}
            </div>
        );
    }
}

export default MenuPositionList;
