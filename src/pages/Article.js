import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles/index'
import { Avatar, Button, IconButton, Paper, Tooltip } from '@material-ui/core/index.es'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import axios from 'axios'
import { Link } from 'react-router-dom'

const styles = theme => ({
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
        margin: theme.spacing.unit * 3,
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 10,
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
    }
})

class Article extends Component {
    state = {
        article: {},
        category: '',
        html: ''
    }

    componentWillMount () {
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

    render () {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <Tooltip id="tooltip-fab" title="返回首页">
                    <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton} component={Link} to="/">
                        <ArrowBackIcon/>
                    </IconButton>
                </Tooltip>
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
            </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Article)