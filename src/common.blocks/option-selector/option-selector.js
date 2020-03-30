import React from 'react';
import './option-selector.css';

class OptionSelector extends React.Component {
    constructor(props) {
        super(props);
        let selectedOption;
        this.props.optionGroup.options.forEach((optionValue) => {
                if (selectedOption === undefined) {
                    selectedOption = optionValue;
                }
            }
        );
        this.state = {
            count: 1,
            selectedOption: selectedOption
        };
    }

    componentDidMount() {
        this.props.onSelect(this, this.state.selectedOption);
    }

    onSelect(e, item) {
        this.setState((state, props) => ({selectedOption: item}));
        this.props.onSelect(e, item.option_id, item);
    }

    render() {
        return (
            <div className="option-selector">
                {this.props.optionGroup.options.map(optionValue => (
                    <div onClick={(e) => this.onSelect(e, optionValue)} className={
                        (this.state.selectedOption.value === optionValue.value)
                            ? 'option-selector__value active_selector'
                            : 'option-selector__value'
                    } key={optionValue.value}>{optionValue.value}</div>
                ))}
            </div>
        );
    }
}

export default OptionSelector;
