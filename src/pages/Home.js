import React, { Component } from 'react';
import logo from '../logo.svg'
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
    logo: {
        height: '250px',
        width: '250px',
    }
});

class Home extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="Home">
                <img src={logo} alt="logo" className={classes.logo}/>
            <p>GoBlog</p>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);