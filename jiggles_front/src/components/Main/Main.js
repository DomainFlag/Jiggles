import React from "react"
import {Component} from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {ACTIONS} from "../../reducers/main"

import Release from "./Release/Release";
import News from "./News/News";
import Settings from "../Settings/Settings"
import Search from "../Search/Search";

import recommendations from "../../dummy/recommandations";

import logo from "./../../resources/assets/logo.svg";
import Button from "../Components/Button/Button";

import "./style.sass"

class CarouselChangeling extends Component {
    constructor(props) {
        super(props);

        this.state.changelings = this.props.changelings;
    }

    render = () => (
        <div className="main-dynamic-content">
            {
                this.state.changelings.map((changeling) => (
                    <div className="main-dynamic-label">
                        <p className="main-dynamic-label-value">
                            { `Currently recommended ${this.props.type}`}
                        </p>

                        <div className="main-dynamic-container">
                            {
                                changeling.map((recommendation) => (
                                    <iframe
                                        className="main-content-widget"
                                        src={recommendation}
                                        width="240" height="240" frameBorder="0"
                                        allowTransparency="true"
                                        allow="encrypted-media"/>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

class Divider extends Component {
    constructor(props) {
        super(props);
    }

    render = () => (
        <div className="main-divider"/>
    )
}

export class Main extends Component {
    constructor(props) {
        super(props);

        props.fetchEntertainmentContent();

        this.state = {
            toggleSearch: {
                trigger: false,
                first_container: {
                    opacity: 1.0
                },
                second_container: {
                    display: "none"
                }
            }
        }
    }

    componentDidMount = () => {
        ReactDOM.findDOMNode(this).parentNode.className = "extendable";
    };

    refreshPage = () => {
        window.location.reload();
    };

    onToggleSearch = () => {
        this.setState((prevState) =>
            (prevState.toggleSearch.trigger) ? ({
                toggleSearch: {
                    trigger: false,
                    first_container: {
                        opacity: 1.0
                    },
                    second_container: {
                        display: "none"
                    }
                }
            }) : ({
                toggleSearch: {
                    trigger: true,
                    first_container: {
                        opacity: 0.4
                    },
                    second_container: {
                        display: "flex"
                    }
                }
            })
        );
    };

    render = () => (
        <div className="main">
            <div className="main-container"
                 style={{display: this.state.toggleSearch.second_container.display}}>
                {
                    this.state.toggleSearch.trigger ? (
                        <Search onToggleSearch={this.onToggleSearch}/>
                    ) : null
                }
            </div>

            <div className="main-container"
                 style={{opacity: this.state.toggleSearch.first_container.opacity}}>
                <div className="main-header">

                    <div className="main-header-container">
                        <img id="main-header-logo" src={logo} onClick={this.refreshPage}/>

                        <Button value="Search" capsLocked={false} iconBased={true} selectable={null}
                                backgroundColor="#148491" onClick={this.onToggleSearch}/>
                    </div>

                    <div className="main-header-miscellaneous">
                        <div className="main-header-links">
                            <Link to="/forum">
                                <p className="main-header-link">Forum</p>
                            </Link>
                            <Link to="/map">
                                <p className="main-header-link">Map</p>
                            </Link>
                            <Link to="/studio">
                                <p className="main-header-link">Studio</p>
                            </Link>
                        </div>

                        <Settings/>
                    </div>
                </div>

                {
                    this.props.search ? (
                        <div className="main-dynamic">
                        </div>
                    ) : (
                        <div className="main-dynamic">
                            <CarouselChangeling/>
                        </div>
                    )
                }

                <div className="main-body">
                    <Release content={this.props.releases} label="Releases"/>
                    <Divider/>
                    <News content={this.props.news} label="News"/>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    fetchEntertainmentContent: () => dispatch(ACTIONS.ENTERTAINER_CONTENT())
});

const mapStateToProps = (state) => ({
    releases: state.main.content.releases,
    news: state.main.content.news,
    search: state.main.search
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);