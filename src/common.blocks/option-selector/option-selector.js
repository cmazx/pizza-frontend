import React from 'react';
import './option-selector.css';

class OptionSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            selectedOption: props.selectedOption
        };
    }

    onSelect(e, item) {
        this.setState((state, props) => ({selectedOption: item.value}));
        this.props.onSelect(e, item.option_id, item.value);
    }

    render() {
        return (
            <div className="option-selector">
                <div className="option-selector__name">{this.props.optionGroup.name}</div>
                {this.props.optionGroup.options.map(optionValue => (
                    <div onClick={(e) => this.onSelect(e, optionValue)} className={
                        (this.state.selectedOption === optionValue.value)
                            ? 'option-selector__value active_selector'
                            : 'option-selector__value'
                    } key={optionValue.value}>{optionValue.value}</div>
                ))}
            </div>
        );
    }
}

export default OptionSelector;
