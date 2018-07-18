import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
    Button,
    IconButton,
    MenuItem,
    Paper, Snackbar,
    TextField,
    Tooltip
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DoneIcon from '@material-ui/icons/Done'
import axios from 'axios'
import 'codemirror/lib/codemirror.css'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import 'tui-editor/dist/tui-editor-extScrollSync.js'
import Editor from 'tui-editor'

const styles = theme => ({
    root: {
        display: 'flex',
        textAlign: 'left',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    },
    info: {
        width: '100%',
        display: 'inline-flex',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.unit
    },
    editor: {
        display: 'inline-flex',
        flexDirection: 'column',
        padding: theme.spacing.unit * 3,
        width: '80%',
        height: '80%'
    },
    ArrowBackButton: {
        zIndex: 99999,
        position: 'fixed',
        top: theme.spacing.unit,
        left: theme.spacing.unit
    },
    doneFAB: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    },
    nameField: {
        flex: 1,
        marginLeft: theme.spacing.unit
    },
    categoryField: {
        minWidth: 150
    },
    tagField: {
        width: 150,
        marginLeft: theme.spacing.unit
    },
    editorDiv: {
        flex: 1
    }
})

class ArticleEditor extends Component {
    state = {
        edit: false,
        categories: [],
        tags: [],
        tag: '',
        category: 0,
        title: '',
        snackBarOpen: false,
        message: ''
    }

    componentDidMount () {
        let editor = new Editor({
            el: document.querySelector('#tui-editor'),
            previewStyle: 'vertical',
            language: 'zh',
            height: '100%',
            exts: ['scrollSync', 'table', 'colorSyntax'],
        })

        this.setState({editor})
    }

    componentWillMount () {
        let id = this.props.match.params.id
        if (id !== undefined) {
            axios.get('/api/article/id/' + id)
                .then(r => {
                    if (r.data.code === 0) {
                        axios.get('/api/article/uuid/' + r.data.article.Uuid + '/markdown')
                            .then(r => {
                                if (r.data.code === 0) {
                                    this.state.editor.setValue(r.data.markdown)
                                }
                            })
                        console.log(r.data)
                        this.setState({
                            tag: r.data.article.tag,
                            category: r.data.article.category_id,
                            title: r.data.article.title,
                            edit: true
                        })
                    }
                })
        }

        axios.get('/api/category')
            .then(r => {
                if (r.data.code === 0)
                    this.setState({categories: r.data.categorys})
            })

    }

    handleSubmit = () => {
        let id = this.props.match.params.id
        let data = {
            title: this.state.title,
            category_id: this.state.category,
            tag: this.state.tag,
            context: this.state.editor.getValue()
        }
        if (this.state.edit) {
            axios.put('/api/article/' + id, data)
                .then(r => {
                    if (r.data.code === 0) {
                        this.props.history.push('/article/' + id)
                    } else {
                        this.setState({snackBarOpen: true, message: r.data.message})
                    }
                })
                .catch(result => {
                    this.setState({snackBarOpen: true, message: '提交失败'})
                })
        } else {
            axios.post('/api/article', data)
                .then(r => {
                    if (r.data.code === 0) {
                        this.props.history.push('/')
                    } else {
                        this.setState({snackBarOpen: true, message: r.data.message})
                    }
                })
                .catch(result => {
                    this.setState({snackBarOpen: true, message: '提交失败'})
                })
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackBarOpen: false})
    }

    render () {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <Tooltip id="tooltip-fab" title="返回">
                    <IconButton aria-label="ArrowBack" className={classes.ArrowBackButton}
                                onClick={() => this.props.history.goBack()}>
                        <ArrowBackIcon/>
                    </IconButton>
                </Tooltip>
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
                <Paper className={classes.editor}>
                    <div className={classes.info}>
                        <TextField
                            select
                            label="分类"
                            value={this.state.category}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            className={classes.categoryField}
                            margin="normal"
                            onChange={e => this.setState({category: e.target.value})}
                        >
                            {this.state.categories.map(category => (
                                <MenuItem key={category.ID} value={category.ID}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="标签"
                            margin="normal"
                            value={this.state.tag}
                            className={classes.tagField}
                            onChange={e => this.setState({tag: e.target.value})}
                        />
                        <TextField
                            id="name"
                            label="标题"
                            value={this.state.title}
                            margin="normal"
                            className={classes.nameField}
                            onChange={e => this.setState({title: e.target.value})}
                        />
                    </div>
                    <div className={classes.editorDiv}>
                        <div id="tui-editor"/>
                    </div>
                </Paper>
                <Tooltip title="提交">
                    <Button variant="fab" color="primary" className={classes.doneFAB} onClick={this.handleSubmit}>
                        <DoneIcon/>
                    </Button>
                </Tooltip>
            </div>
        )
    }
}

ArticleEditor.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ArticleEditor)