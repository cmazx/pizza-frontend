import React from 'react';
import './menu-position.css';
import OptionSelector from "../option-selector/option-selector";
import Button from "../button/Button";
import Image from "../image/image.js";

class MenuPosition extends React.Component {
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
            componentClassName: 'menu-position',
            showImage: true,
        };
    }

    keyPress(e) {
        this.setState((state, props) => ({counter: e.target.value}));
    }

    addToCart(e) {
        console.log('???', this.state.selectedOptions);
        this.props.onAddToCart(
            e.target,
            this.props.position,
            this.state.selectedOptions.length > 0 ? this.state.selectedOptions.slice() : []
        )
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
        let defaultValues = [];

        this.props.position.options.forEach((optionValue) => {
            if (!groups[optionValue.option_id]) {
                let optionGroup = this.props.optionGroups
                    .filter((group) => (group.id === optionValue.option_id))
                    .shift();
                groups[optionValue.option_id] = {"options": [], "name": optionGroup.name};
                defaultValues[optionValue.option_id] = optionValue;
            }
            groups[optionValue.option_id].options.push(optionValue);
        });

        return groups;
    }

    renderImageColumn() {
        let imageClassName = this.state.componentClassName + "__image"
            + (this.props.pizzaPosition ? '' : '_non_pizza')
            + (this.props.reflected ? ' reflected' : '');
        return <div className={this.state.componentClassName + "__image_column"}>
            <Image src={this.props.position.image} imageClassName={imageClassName}/>
        </div>;
    }

    onOptionSelect(e, id, v) {
        let options = this.state.selectedOptions;
        options[id] = v;
        this.setState((state, props) => ({selectedOptions: options}));
    }

    renderInfoColumn() {
        return <div className={this.state.componentClassName + "__info_column"}
                    onMouseEnter={this.handleMouseHover}
                    onMouseLeave={this.handleMouseUnHover}>
            <div className={this.state.componentClassName + "__info_column__name"}>{this.props.position.name}</div>
            <div className={this.state.componentClassName + "__info_column__description"}
            >{this.props.position.description}</div>
            <div className={this.state.componentClassName + "__info_column__bottom"}>
                {this.props.groups.map((optionGroup) => {
                    return <OptionSelector optionGroup={optionGroup}
                                           key={optionGroup.name}
                                           onSelect={this.onOptionSelect}/>

                })}
                <div className={this.state.componentClassName + "__info_column__purchase"}>
                    <div className={this.state.componentClassName + "__info_column__price"}>
                        {this.props.position.price} EUR
                    </div>
                    <Button onClick={this.addToCart} text="Add"/>
                </div>
            </div>
        </div>
    }

    getPositionClassName() {
        return this.state.componentClassName
            + (this.props.reflected ? ' reflected' : '')
            + (this.state.isHovering ? ' focused' : '');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.position.image !== prevProps.position.image && prevState.showImage) {
            this.setState((state, props) => ({showImage: false}));
        }
    }

    render() {
        return (
            <div key={"pos" + this.props.position.id} className={this.getPositionClassName()}>
                <div className={this.state.componentClassName + "__wrap"}>
                    {this.renderImageColumn()}
                    {this.renderInfoColumn()}
                </div>
            </div>
        );
    }
}

export default MenuPosition;
