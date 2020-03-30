import React from 'react';
import './cart.css';
import OrderConfirmation from "../order-confirmation/order-confirmation";

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.onConfirmOrder = this.onConfirmOrder.bind(this);
        this.state = {
            visible: false,
            idempotencyKey: this.getNewIdempotencyKey()
        };
    }

    onConfirmOrder(positions, address, phone) {
        this.props.onConfirmOrder(this.state.idempotencyKey, positions, address, phone);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.positions && this.props.positions.length > 0 && this.props.positions !== prevProps.positions) {
            this.setState({idempotencyKey: this.getNewIdempotencyKey()});
        }
    }


    getNewIdempotencyKey() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                // eslint-disable-next-line no-mixed-operators,eqeqeq
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
    }

    render() {
        let count = 0;
        this.props.positions.forEach((item) => (count += item.count));
        let className = 'cart' + (count < 1 ? ' hidden' : '');

        let s = count > 1 ? 's' : '';
        return <div className={className}>
            <div className="cart__content">
                <div className="cart__content__text">
                    You have <span className="cart__content__text__counter">{count}</span> position{s} in your cart
                </div>
                <OrderConfirmation positions={this.props.positions}
                                   optionsGroups={this.props.optionsGroups}
                                   removePosition={this.props.removePosition}
                                   onConfirmOrder={this.onConfirmOrder}
                                   incrementPosition={this.props.incrementPosition}
                                   decrementPosition={this.props.decrementPosition}
                                   fixedDeliveryCost={this.props.fixedDeliveryCost}
                                   additionalDeliveryCost={this.props.additionalDeliveryCost}
                                   modalId="order-modal"/>
            </div>

        </div>;
    }
}

export default Cart;
