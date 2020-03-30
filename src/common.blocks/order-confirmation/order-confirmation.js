import React from 'react';
import './order-confirmation.css';

class OrderConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            addressWrapperClassName: '',
            phoneWrapperClassName: ''
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.onConfirmOrder = this.onConfirmOrder.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    openModal() {
        this.setState((state, props) => ({visible: true}));
        let hideCallback = () => {
            this.setState((state, props) => ({visible: false}));
        }
        var modal = document.getElementById(this.props.modalId);

        window.onclick = function (event) {
            if (event.target === modal) {
                hideCallback();
            }
        }
    }

    closeModal() {
        this.setState((state, props) => ({visible: false}));
    }

    renderOption(i, options) {
        let optionsGroups = this.props.optionsGroups;
        return options
            .filter((option) => (option))
            .map((option) => {
                let optionGroupName='';
                optionsGroups.forEach((item) => {
                        if (option.option_id === item.id) {
                            optionGroupName = item.name;
                        }
                    }
                );


                return <span key={'modal-span-' + option.option_id}>
                    {optionGroupName}: <span key={option.option_id + " " + option.value}>{option.value}</span></span>
            });
    }

    calculateSubtotal(item) {
        let price = parseFloat(item.position.price);
        item.options
            .filter((option) => (option))
            .forEach((option) => {
                if (option.addPrice && parseFloat(option.addPrice) > 0) {
                    price += parseFloat(option.addPrice);
                }
            });

        return (price * item.count);
    }

    calculateTotals() {
        let total = 0;
        this.props.positions.forEach((item) => {
            total += this.calculateSubtotal(item);
        })

        return {total: total.toFixed(2), totalUSD: (total * 1.11).toFixed(2)};
    }

    removePosition(e, i) {
        this.props.removePosition(i);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.positions.length < 1 && this.state.visible === true) {
            this.setState({visible: false});
        }
    }

    onConfirmOrder() {
        let address = document.getElementById('address').value;
        let phone = document.getElementById('phone').value;
        if (this.isValid(address, phone)) {
            this.props.onConfirmOrder(this.props.positions, address, phone);
        }
    }

    isValid(address, phone) {
        let state = {'addressWrapperClassName': '', 'phoneWrapperClassName': ''};
        let valid = true;
        if (address.length > 255 || address.length < 5) {
            state['addressWrapperClassName'] = 'validation_error';
            valid = false;
        }
        if (phone.match('^[0-9]{6,20}$') === null) {
            state['phoneWrapperClassName'] = 'validation_error';
            valid = false;
        }
        this.setState(state);
        return valid;
    }

    render() {
        let totals = this.calculateTotals();
        return (
            <div>
                <div onClick={this.openModal} className="order-confirmation__order_button">Make order</div>
                <div id={this.props.modalId}
                     className={this.state.visible ? 'order-confirmation__wrapper active' : 'order-confirmation__wrapper'}>
                    <div className="order-confirmation__modal-content">
                        <span className="order-confirmation__close" onClick={this.closeModal}>&times;</span>

                        <h2 className="order-confirmation__list_header">Order confirmation</h2>
                        <div className="order-confirmation__list">
                            {this.props.positions.map((item, i) => (
                                <div key={'order-confirmation__order_position' + i}
                                     className="order-confirmation__list__position">
                                    <div className="order-confirmation__list__count">
                                        <div className="order-confirmation__list__count__quantity-wrapper">
                                            <div
                                                className={"order-confirmation__list__count__incrementor "
                                                + (item.count < 100 ? '' : 'hidden')}
                                                onClick={(e) => (this.props.incrementPosition(i))}>▲
                                            </div>
                                            <div
                                                className="order-confirmation__list__count__count">{item.count}</div>
                                            <div
                                                className={"order-confirmation__list__count__decrementor "
                                                + (item.count > 1 ? '' : 'hidden')}
                                                onClick={(e) => (this.props.decrementPosition(i))}>▼
                                            </div>
                                        </div>
                                        <div className="order-confirmation__list__count__multiplier">x</div>
                                    </div>
                                    <div className="order-confirmation__list__position_image">
                                        <img src={item.position.image} alt=""/>
                                    </div>
                                    <div className="order-confirmation__list__position_info">
                                        <div className="order-confirmation__list__position_name">
                                            {item.position.name}
                                        </div>
                                        <div className="order-confirmation__list__position_options">
                                            {this.renderOption(i, item.options)}
                                        </div>
                                    </div>
                                    <div className="order-confirmation__list__position_price">
                                        {this.calculateSubtotal(item).toFixed(2)} EUR
                                    </div>

                                    <div className="order-confirmation__remove"
                                         onClick={(event => (this.removePosition(event, i)))}>&times;
                                    </div>

                                </div>
                            ))}
                        </div>
                        <hr/>
                        <div>
                            <b>Total:</b> <span>{totals.total} EUR</span> (<span>{totals.totalUSD} USD </span>)
                        </div>
                        <div>Only cash pay on delivery available.</div>
                        <br/>
                        <div className="order-confirmation__contacts">
                            <h4>Please specify delivery information</h4>
                            <div className={'order-confirmation__contacts__field ' + this.state.phoneWrapperClassName}>
                                <div className="order-confirmation__contacts__field__label">Your phone</div>
                                <div className="field_wrapper">
                                    <input id="phone"/>
                                    <div className="order-confirmation__contacts__field__requirements">
                                        Phone must contain only numbers and have length between 5 and 20 symbols
                                    </div>
                                </div>
                            </div>
                            <div
                                className={'order-confirmation__contacts__field ' + this.state.addressWrapperClassName}>
                                <div className="order-confirmation__contacts__field__label">Your address</div>
                                <div className="field_wrapper">
                                    <input id="address"/>
                                    <div className="order-confirmation__contacts__field__requirements">
                                        Address must have length between 5 and 255 symbols
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>We will call you to confirm the order</div>
                        <br/>
                        <div onClick={this.onConfirmOrder} className="order-confirmation__confirm_order_button">Confirm
                            order
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderConfirmation;
