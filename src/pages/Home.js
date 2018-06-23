import React, {Component} from 'react';
import logo from '../logo.svg'
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MenuIcon from '@material-ui/icons/Menu';
import {Drawer, Hidden, AppBar, Toolbar, IconButton, Typography, Divider, ListItemText, MenuItem, MenuList} from "@material-ui/core/index.es";

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
    },
    header: {
        height: 250,
        width: 250,
    },
    logo: {
        height: 200,
        width: 200,
    }
});

class Home extends Component {
    state = {
        mobileOpen: false,
        title: "GoBlog",
        categories: [],
        tags: [],
        category: '',
        tag: ''
    };

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    render() {
        const {classes} = this.props;

        const drawer = (
            <div>
                <div className={classes.header}>
                    <img src={logo} alt="logo" className={classes.logo}/>
                    <Typography variant="title">{this.state.title}</Typography>
                </div>
                <Divider/>
                <MenuList>
                    <MenuItem>
                        <ListItemText inset primary="全部分类"/>
                    </MenuItem>
                    {this.state.categories.map((category) => {
                        return (
                            <MenuItem selected={this.state.category===category}>
                                <ListItemText inset primary={category}/>
                            </MenuItem>
                        )
                    })}
                </MenuList>
                <Divider/>
                <MenuList>
                    <MenuItem>
                        <ListItemText inset primary="全部标签"/>
                    </MenuItem>
                    {this.state.tags.map((tag) => {
                        return (
                            <MenuItem selected={this.state.tag===tag}>
                                <ListItemText inset primary={tag}/>
                            </MenuItem>
                        )
                    })}
                </MenuList>
            </div>
        );

        return (
            <div className="Home">
                <Hidden mdUp>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit">{this.state.title}</Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="temporary"
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <main className={classes.content}>
                    <Hidden mdUp>
                        <div className={classes.toolbar}/>
                    </Hidden>
                </main>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);