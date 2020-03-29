import React from 'react';
import './menu-category-list.css';

class MenuCategoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCategoryId: props.activeCategoryId
        };
    }

    onSelect(e, value) {
        this.setState((state, props) => ({activeCategoryId: value}));
        this.props.onSelect(e,value);
    }

    render() {
        console.log("active category id",this.state.activeCategoryId);
        return (
            <div className="menu-category-list">
                <div className="menu-category-list__wrapper">
                {this.props.items.map(item => (
                    <div className={"menu-category-list__item " + (item.id === this.state.activeCategoryId ? "active" : "")}
                         key={item.id}
                         onClick={(event) => this.onSelect(event,item.id)}
                    >{item.name}</div>
                ))}
                </div>
            </div>
        );
    }
}

export default MenuCategoryList;
