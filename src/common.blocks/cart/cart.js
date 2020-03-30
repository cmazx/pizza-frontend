import React from 'react';
import './cart.css';
import Modal from "../modal/modal";

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    render() {
        let count = this.props.positions.length;
        let className = 'cart' + (count < 1 ? ' hidden' : '');

        let s = count > 1 ? 's' : '';
        return <div className={className}>
            <div className="cart__content">
                <div className="cart__content__text"
                >You have <span className="cart__content__text__counter">{count}</span> position{s} in your cart</div>
                <Modal positions={this.props.positions}
                       optionsGroups={this.props.optionsGroups}
                       removePosition={this.props.removePosition}
                       modalId="order-modal" />
            </div>

        </div>;
    }
}

export default Cart;
