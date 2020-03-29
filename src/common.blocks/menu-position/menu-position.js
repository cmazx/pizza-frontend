import React from 'react';
import './menu-position.css';
import OptionSelector from "../option-selector/option-selector";
import Button from "../button/Button";

class MenuPosition extends React.Component {
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
        };
    }

    keyPress(e) {
        this.setState((state, props) => ({counter: e.target.value}));
    }

    addToCart(e) {
        this.props.onAddToCart(e.target, this.state.selectedOptions)
    }

    handleMouseHover() {
        this.setState({isHovering: true});
    }

    handleMouseUnHover() {
        this.setState({isHovering: false});
    }

    onInfoBlur() {
        this.setState((state, props) => ({focused: false}));
    }

    getGroupedOptions() {
        let groups = [];
        this.props.options.forEach(  (optionValue) => {
            if (!groups[optionValue.option_id]) {
                let group = {"options": [], "name": ""};
                this.props.optionGroups.forEach((optionGroupItem) => {
                    if (optionGroupItem.id === optionValue.option_id) {
                        group.name = optionGroupItem.name;
                    }
                })
                groups[optionValue.option_id] = group;
            }

            groups[optionValue.option_id].options.push(optionValue);
        })
        return groups;
    }

    render() {
        let onOptionSelect =  (e, id, v) => {
            let options = this.state.selectedOptions;
            options[id] = v;
            this.setState((state, props) => ({selectedOptions: options}));
            console.log(options);
        }
        let imageClassName = 'menu-position__image ' + (this.props.reflected ? 'reflected' : '');
        let positionClassName = 'menu-position'
            + (this.props.reflected ? ' reflected' : '')
            + (this.state.isHovering ? ' focused' : '');

        return (
            <div className={positionClassName}>
                <div className="menu-position__wrap">
                    <div className="menu-position__image_column">
                        <img className={imageClassName} alt="" src={this.props.image}/>
                    </div>
                    <div className="menu-position__info_column"
                         onMouseEnter={this.handleMouseHover}
                         onMouseLeave={this.handleMouseUnHover}>
                        <div className="menu-position__info_column__name">{this.props.name}</div>
                        <div className="menu-position__info_column__description">{this.props.description}</div>
                        {this.getGroupedOptions().map((optionGroup) => {
                            return <OptionSelector optionGroup={optionGroup}
                                                   key={optionGroup.name}
                                                   selectedOption={this.state.selectedOption}
                                                   onSelect={onOptionSelect}/>

                        })}
                        <div className="menu-position__info_column__purchase">
                            <Button onClick={this.addToCart} text="Add"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuPosition;
