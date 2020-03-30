import React from 'react';
import './modal.css';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderOption = this.renderOption.bind(this);
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
            .filter(function (item) {
                return item
            })
            .map((option) => {
                let optionGroup;
                optionsGroups.forEach((item) => {
                        if (option.option_id === item.id) {
                            optionGroup = item;
                        }
                    }
                );

                let value = option.value;
                if (option.addPrice) {
                    value += ' +' + option.addPrice + ' EUR';
                }

                return <span key={'modal-span-' + option.option_id}>
                    {optionGroup.name}: <span key={option.option_id + " " + option.value}>{value}</span></span>
            });
    }

    calculateTotals() {
        let total = 0;
        this.props.positions.forEach((item) => {
            let additional = 0;
            if (item.options.length > 0) {
                item.options.forEach((opt) => {
                    if (opt.addPrice) {
                        additional += parseFloat(opt.addPrice);
                    }
                })
            }
            total += parseFloat(item.position.price) + additional;
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

    render() {
        let totals = this.calculateTotals();
        return (
            <div>
                <div onClick={this.openModal} className="modal__order_button">Make order</div>
                <div id={this.props.modalId}
                     className={this.state.visible ? 'modal__wrapper active' : 'modal__wrapper'}>
                    <div className="modal-content">
                        <span className="close" onClick={this.closeModal}>&times;</span>

                        <h2 className="modal__position_list_header">Order confirmation</h2>
                        <div className="modal__position_list">
                            {this.props.positions.map((item, i) => (
                                <div key={'modal_order_position' + i} className="modal__position_list__position">
                                    <div
                                        className="modal__position_list__position_image">
                                        <img src={item.position.image} alt=""/>
                                    </div>
                                    <div
                                        className="modal__position_list__position_info">
                                        <div className="modal__position_list__position_name">
                                            {item.position.name}
                                        </div>
                                        <div className="modal__position_list__position_options">
                                            {this.renderOption(i, item.options)}
                                        </div>
                                    </div>
                                    <div
                                        className="modal__position_list__position_price">
                                        {item.position.price} EUR
                                    </div>

                                    <div className="remove"
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
                        <div className="modal__delivery_info">
                            <h4>Please specify delivery information</h4>
                            <div>
                                <div className="modal__delivery_info__label">Your phone</div>
                                <input id="phone"/>
                            </div>
                            <div>
                                <div className="modal__delivery_info__label">Your address</div>
                                <input id="adress"/>
                            </div>
                        </div>
                        <div>We will call you to confirm the order</div>
                        <br/>
                        <div className="modal__confirm_order_button">Confirm order</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
