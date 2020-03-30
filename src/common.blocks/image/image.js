import React from 'react';
import './image.css';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: "hidden-image",
            loaderClassName: "image-loader"
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.src !== prevProps.src) {
            this.setState((state, props) => ({
                className: "hidden-image",
                loaderClassName: "image-loader"
            }));
        }
    }

    render() {
        let className = this.props.imageClassName;
        let showImage = () => {
           this.setState((state, props) => ({className: className, loaderClassName: "hidden-image"}));
        }

        return <div>
            <div className={this.state.loaderClassName}></div>
            <img
                alt=""
                onLoad={showImage}
                key={this.props.src}
                src={this.props.src}
                className={this.state.className}/>
        </div>;
    }
}

export default Image;
