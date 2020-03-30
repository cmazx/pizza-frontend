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
        let bgItems = [];
        //items to fill gaps for pizza
        if(this.props.pizzaList){
            let bgItemsCount = this.props.items.length % 4;
            bgItemsCount = bgItemsCount > 0 ? (4 - bgItemsCount) : 0;
            for (let i = 0; i < bgItemsCount; i++) {
                let matrixPosition = ((this.props.items.length + i + 1) % 4);
                bgItems.push({'index': matrixPosition, 'reflected': (matrixPosition === 3) || (matrixPosition === 0)})
            }
        }
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
                {bgItems.map((item) => {
                    return <div className={'positionPlaceholder index' + item.index + (item.reflected ? ' reflected' : '')}>
                        <img src={this.props.placeholderUrl}/>
                    </div>
                })}
            </div>
        );
    }
}

export default MenuPositionList;
