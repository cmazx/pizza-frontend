import React from 'react';
import './App.css';
import MenuCategoryList from './common.blocks/menu-category-list/menu-category-list';
import MenuPositionList from "./common.blocks/menu-position-list/menu-position-list";
import Cart from "./common.blocks/cart/cart";
import Modal from "./common.blocks/modal/modal";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiEndpoint: "https://pizzario.herokuapp.com/api/v1",
            cdnEndpoint: "https://mazx.ru/pizza",
            listItemPlaceholderUrl: "https://mazx.ru/pizza/pizzabg.jpg",
            categories: [],
            options: [],
            activeCategoryId: null,
            positions: [],
            positionsPage: 1,
            cartPositions: [],
            orderCompleted: false,
            lastOrderToken: "",
            modalVisible: false,
            modalContent: "",
            additionalDeliveryCost: 1,//delivery cost for every 10 pizzas (after first 10)
            fixedDeliveryCost: 5 //cost for delivery that always taken
        };

        this.onAddToCart = this.onAddToCart.bind(this);
        this.onOrderStart = this.onOrderStart.bind(this);
        this.removeCartPosition = this.removeCartPosition.bind(this);
        this.decrementCartPosition = this.decrementCartPosition.bind(this);
        this.incrementCartPosition = this.incrementCartPosition.bind(this);
        this.onConfirmOrder = this.onConfirmOrder.bind(this);
        this.onOrderCompleted = this.onOrderCompleted.bind(this);
        this.commonModalClose = this.commonModalClose.bind(this);
    }

    getStoredCartPositions() {
        let positions = localStorage.getItem('cart.positions');
        return positions ? JSON.parse(positions) : [];
    }

    storeCartPositions(positions) {
        localStorage.setItem('cart.positions', JSON.stringify(positions));
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchOptions();
        this.fetchPositions();
        this.setState({'cartPositions': this.getStoredCartPositions()});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeCategoryId !== this.state.activeCategoryId) {
            this.fetchPositions();
        }
    }

    fetchCategories() {
        fetch(this.state.apiEndpoint + "/categories")
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    'categories': data.data,
                    'activeCategoryId': data.data.length > 0 ? data.data[0].id : null
                });
            }).catch(reason => {
            console.log('Categories load failed ', reason);
        })
    }

    fetchOptions() {
        fetch(this.state.apiEndpoint + "/position-options")
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({'options': data.data})
                ;
            }).catch(reason => {
            console.log('Options load failed ', reason);
        })
    }

    fetchPositions() {
        if (this.state.activeCategoryId === null) {
            return;
        }
        let url = this.state.apiEndpoint + "/categories/" + this.state.activeCategoryId + "/positions";
        if (this.state.positionsPage > 1) {
            url += '?page=' + this.state.positionsPage;
        }
        fetch(url)
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({'positions': data.data.slice(2)});
            }).catch(reason => {
            console.log('Positions load failed ', reason);
        })
    }

    onCategorySelect(e, value) {
        this.setState((state, props) => ({activeCategoryId: value}));
    }

    getPositionIndex(position, options) {
        return position.id + '<>'
            + options.map((option) => (option.option_id + ":" + option.value)).join('<>');
    }

    onFullCart(position, options) {
        //say something to user about cart is full
    }

    onConfirmOrder(idempotencyKey, positions, address, phone) {
        console.log(idempotencyKey, positions, address, phone);
        positions = positions.map(function (position) {
            return {
                id: position.position.id,
                count: position.count,
                options: position.options
                    .filter((option) => (option))
                    .map((option) => ({id: option.option_id, value: option.value}))
            };
        })
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Idempotency-key': idempotencyKey},
            body: JSON.stringify({
                positions: positions,
                address: address,
                phone: "+" + phone //support rfc
            })
        };
        fetch(this.state.apiEndpoint + '/orders', requestOptions)
            .then(response => response.json())
            .then(data => this.onOrderCompleted(data.data.token));
    }

    onOrderCompleted(token) {
        this.setState((state, props) => ({
            orderCompleted: true,
            lastOrderToken: token,
            cartPositions: [],
        }));
        this.storeCartPositions([]);
        this.showModal(<div>
            <h2 className="no-margin-header">Thank you!</h2>
            <div className="green-text">Your order is created.</div>
            <br/>
            Manager will call you to confirm your order.
            <br/><br/>
        </div>);
    }

    showModal(content) {
        this.setState((state, props) => ({
            modalVisible: true,
            modalContent: content,
        }));
    }

    onAddToCart(e, position, options) {
        if (this.state.cartPositions.length > 99) {
            this.onFullCart(position, options);
            return;
        }

        let positions = this.state.cartPositions;
        let index = this.getPositionIndex(position, options);

        let incremented = false;
        let updated = false;
        positions.map((item) => {
            if (item.index === index) {
                if (item.count < 100) {
                    item.count++;
                    updated = true;
                } else {
                    this.onFullCart(position, options);
                }
                incremented = true;
            }
            return item;
        });
        if (!incremented) {
            updated = true;
            positions.push({index: index, position: position, options: options, count: 1});
        }

        if (updated) {
            this.storeCartPositions(positions);
            this.setState((state, props) => ({cartPositions: positions}));
        }
    }

    onOrderStart() {
        console.log(this.state.cartPositions);
    }

    activeCategoryAboutPizza() {
        return this.state.categories.filter((cat) => {
            if (this.state.activeCategoryId !== cat.id) {
                return false;
            }
            return cat.name.toLowerCase() === 'pizza';
        }).length > 0;
    }

    removeCartPosition(i) {
        let newList = this.state.cartPositions.filter((item, position) => {
            return position !== i;
        });
        this.setState((state, props) => ({cartPositions: newList}));
        this.storeCartPositions(newList);
    }

    incrementCartPosition(i) {
        let newList = this.state.cartPositions.map((item, position) => {
            if (position === i && item.count < 100)
                item.count++;
            return item;
        });
        this.storeCartPositions(newList);
        this.setState((state, props) => ({cartPositions: newList}));
    }

    decrementCartPosition(i) {
        let newList = this.state.cartPositions.map((item, position) => {
            if (position === i && item.count > 1)
                item.count--;
            return item;
        });
        this.storeCartPositions(newList);
        this.setState((state, props) => ({cartPositions: newList}));
    }

    commonModalClose() {
        this.setState((state, props) => ({modalVisible: false, modalContent: ''}));
    }

    render() {
        if (!this.state.activeCategoryId) {
            return "";
        }
        return (
            <div className="App">
                <Cart onClick={this.onOrderStart}
                      optionsGroups={this.state.options}
                      removePosition={this.removeCartPosition}
                      onConfirmOrder={this.onConfirmOrder}
                      decrementPosition={this.decrementCartPosition}
                      incrementPosition={this.incrementCartPosition}
                      fixedDeliveryCost={this.state.fixedDeliveryCost}
                      additionalDeliveryCost={this.state.additionalDeliveryCost}
                      positions={this.state.cartPositions}/>
                <div className="App-container">
                    <div className="App-container__wrapper">
                        <div className="App-container__background-wrapper">
                            <img src={this.state.cdnEndpoint + '/bg.jpg'} alt="" className="App-container__background"/>
                        </div>
                        <MenuCategoryList
                            onSelect={(e, v) => {
                                this.onCategorySelect(e, v)
                            }}
                            activeCategoryId={this.state.activeCategoryId}
                            items={this.state.categories}
                        />
                        <div className="App-container__position-list">
                            <MenuPositionList
                                items={this.state.positions}
                                optionGroups={this.state.options}
                                onAddToCart={this.onAddToCart}
                                pizzaList={this.activeCategoryAboutPizza()}
                                placeholderUrl={this.state.listItemPlaceholderUrl}
                            />
                        </div>
                    </div>
                </div>

                <Modal modalId="commonModal"
                       visible={this.state.modalVisible}
                       onClose={this.commonModalClose}
                       text={this.state.modalContent}/>
            </div>
        );
    }

}

export default App;
