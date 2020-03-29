import React from 'react';
import './App.css';
import MenuCategoryList from './common.blocks/menu-category-list/menu-category-list';
import MenuPositionList from "./common.blocks/menu-position-list/menu-position-list";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiEndpoint: "https://pizzario.herokuapp.com/api/v1",
            cdnEndpoint: "https://mazx.ru/pizza",
            categories: [],
            options: [{"id":1,"name":"Size"}],
            activeCategoryId: null,
            positions: [],
            positionsPage: 1
        };
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
        console.log(value);
        this.setState((state, props) => ({activeCategoryId: value}));
    }

    onAddToCart(e) {
        console.log(e);
    }

    render() {
        if (!this.state.activeCategoryId) {
            return "";
        }

        return (
            <div className="App">
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
                            />
                        </div>
                    </div>
                </div>
                <footer>

                </footer>
            </div>
        );
    }

}

export default App;
