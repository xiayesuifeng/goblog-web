import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles/index'
import { Avatar, IconButton, Paper, Tooltip, Hidden, Snackbar, Toolbar, Typography, AppBar } from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    root: {
        textAlign: 'left',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    },
    context: {
        paddingLeft: theme.spacing.unit * 20,
        paddingRight: theme.spacing.unit * 20,
        paddingBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2,
    },
    article: {
        display: 'inline-flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 10,
            minWidth:800,
        },
        [theme.breakpoints.down('sm')]: {
            margin:0,
            width:'100%',
            height: '100%'
        },
    },
    header: {
        padding: theme.spacing.unit * 3,
        display: 'inline-flex',
        alignItems: 'center'
    },
    headerInfo: {
        paddingLeft: theme.spacing.unit,
        display: 'inline-flex',
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'column',
    },
    info: {
        display: 'inline-flex',
        justifyContent: 'space-between',
    },
    ArrowBackButton: {
        zIndex: 99999,
        position: 'fixed',
        top: theme.spacing.unit,
        left: theme.spacing.unit
    },
    speedDial: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    }
})

class Article extends Component {
    state = {
        article: {},
        category: '',
        html: '',
        open: false,
        hidden: false,
        snackBarOpen: false,
        message: '',
        login: false
    }

    componentWillMount () {
        this.setState({login: (Cookies.get('goblog-session') !== undefined)})
        axios.get('/api/article/id/' + this.props.match.params.id)
            .then(r => {
                if (r.data.code === 0) {
                    axios.get('/api/article/uuid/' + r.data.article.Uuid + '/html')
                        .then(r => {
                            if (r.data.code === 0)
                                this.setState({html: r.data.html})
                        })
                    axios.get('/api/category/' + r.data.article.category_id)
                        .then(r => {
                            if (r.data.code === 0)
                                this.setState({category: r.data.category.name})
                        })
                    this.setState({article: r.data.article})
                }
                console.log(r.data.article)
            })
    }

    handleClick = () => {
        this.setState(state => ({
            open: !state.open,
        }))
    }

    handleOpen = () => {
        if (!this.state.hidden) {
            this.setState({open: true})
        }
    }

    handleClose = () => {
        this.setState({open: false})
    }

    handleDelete = () => {
        axios.delete('/api/article/' + this.props.match.params.id)
            .then(r => {
                if (r.data.code === 0)
                    this.props.history.push('/')
                else
                    this.setState({snackBarOpen: true, message: '删除失败!错误:' + r.data.message})
            })

    }

    render () {
        const {classes} = this.props

        let isTouch
        if (typeof document !== 'undefined') {
            isTouch = 'ontouchstart' in document.documentElement
        }

        return (
            <div className={classes.root}>
                <Hidden mdUp>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            component={Link} to="/"
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit">{this.state.article.title}</Typography>
                    </Toolbar>
                </AppBar>
                </Hidden>
                <Hidden smDown>
                    <Tooltip id="tooltip-fab" title="返回首页">
                        <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton} component={Link} to="/">
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                </Hidden>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                />
                <Hidden mdUp>
                    <div className={classes.toolbar}/>
                </Hidden>
                <Paper className={classes.article}>
                    <div className={classes.header}>
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                            {this.state.category}
                        </Avatar>
                        <div className={classes.headerInfo}>
                            <div className={classes.info}>
                                <span>{this.state.article.title}</span>
                                <span>发布于 {this.state.article.CreatedAt}</span>
                            </div>
                            <div className={classes.info}>
                                <span>{this.state.article.tag}</span>
                                <span>更新于 {this.state.article.UpdatedAt}</span>
                            </div>
                        </div>
                    </div>
                    <div className={classes.context} dangerouslySetInnerHTML={{__html: this.state.html}}/>
                </Paper>
                {this.state.login &&
                    <SpeedDial
                        ariaLabel="SpeedDial"
                        className={classes.speedDial}
                        hidden={this.state.hidden}
                        icon={<SpeedDialIcon/>}
                        onBlur={this.handleClose}
                        onClick={this.handleClick}
                        onClose={this.handleClose}
                        onFocus={isTouch ? undefined : this.handleOpen}
                        onMouseEnter={isTouch ? undefined : this.handleOpen}
                        onMouseLeave={this.handleClose}
                        open={this.state.open}
                    >
                        <SpeedDialAction
                            icon={<DeleteIcon/>}
                            tooltipTitle="删除"
                            onClick={this.handleDelete}
                        />
                        <SpeedDialAction
                            icon={<EditIcon/>}
                            tooltipTitle="编辑"
                            onClick={() => this.props.history.push('/articleEditor/' + this.props.match.params.id)}
                        />
                    </SpeedDial>}
            </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Article)