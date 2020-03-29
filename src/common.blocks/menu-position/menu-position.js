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
            componentClassName: 'menu-position',
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
        this.props.options.forEach((optionValue) => {
            if (!groups[optionValue.option_id]) {
                let optionGroup = this.props.optionGroups
                    .filter((group) => (group.id === optionValue.option_id))
                    .shift();
                groups[optionValue.option_id] = {"options": [], "name": optionGroup.name};
            }

            groups[optionValue.option_id].options.push(optionValue);
        })
        return groups;
    }

    getImageClassName() {
        return this.state.componentClassName + "__image"
            + (this.props.pizzaPosition ? '' : '_non_pizza')
            + (this.props.reflected ? ' reflected' : '')
    }

    renderImageColumn() {
        return <div className={this.state.componentClassName + "__image_column"}>
            <img className={this.getImageClassName()} alt="" src={this.props.image}/>
        </div>;
    }

    renderInfoColumn() {
        let onOptionSelect = (e, id, v) => {
            let options = this.state.selectedOptions;
            options[id] = v;
            this.setState((state, props) => ({selectedOptions: options}));
        }
        return <div className={this.state.componentClassName + "__info_column"}
                    onMouseEnter={this.handleMouseHover}
                    onMouseLeave={this.handleMouseUnHover}>
            <div className={this.state.componentClassName + "__info_column__name"}>{this.props.name}</div>
            <div className={this.state.componentClassName + "__info_column__description"}
            >{this.props.description}</div>
            {this.getGroupedOptions().map((optionGroup) => {
                return <OptionSelector optionGroup={optionGroup}
                                       key={optionGroup.name}
                                       selectedOption={this.state.selectedOption}
                                       onSelect={onOptionSelect}/>

            })}
            <div className={this.state.componentClassName + "__info_column__purchase"}>
                <Button onClick={this.addToCart} text="Add"/>
            </div>
        </div>
    }

    getPositionClassName() {
        return this.state.componentClassName
            + (this.props.reflected ? ' reflected' : '')
            + (this.state.isHovering ? ' focused' : '');
    }

    render() {
        return (
            <div className={this.getPositionClassName()}>
                <div className={this.state.componentClassName + "__wrap"}>
                    {this.renderImageColumn()}
                    {this.renderInfoColumn()}
                </div>
            </div>
        );
    }
}

export default MenuPosition;
