import React from 'react';
import './App.css';
import MenuCategoryList from './common.blocks/menu-category-list/menu-category-list';
import MenuPositionList from "./common.blocks/menu-position-list/menu-position-list";
import Cart from "./common.blocks/cart/cart";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiEndpoint: "https://pizzario.herokuapp.com/api/v1",
            cdnEndpoint: "https://mazx.ru/pizza",
            categories: [],
            options: [],
            activeCategoryId: null,
            positions: [],
            positionsPage: 1,
            cartPositions: []
        };

        this.onAddToCart = this.onAddToCart.bind(this);
        this.onOrderStart = this.onOrderStart.bind(this);
        this.removeCartPosition = this.removeCartPosition.bind(this);
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchOptions();
        this.fetchPositions();
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
                this.setState({'positions': data.data});
            }).catch(reason => {
            console.log('Positions load failed ', reason);
        })
    }

    onCategorySelect(e, value) {
        this.setState((state, props) => ({activeCategoryId: value}));
    }

    onAddToCart(e, position, options) {
        let positions = this.state.cartPositions;
        positions.push({position: position, options: options});
        this.setState((state, props) => ({cartPositions: positions}));
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
        let newList = this.state.cartPositions.filter((item,position) => {
            return position !== i;
        });
        this.setState((state, props) => ({cartPositions: newList}));
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;
