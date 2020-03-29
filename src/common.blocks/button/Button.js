import React from 'react';
import './button.css';

class Button extends React.Component {
    render() {
        return (
            <div className="button" onClick={this.props.onClick}>{this.props.text}</div>
        );
    }
}

export default Button;
