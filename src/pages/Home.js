import React, { Component } from 'react'
import logo from '../logo.svg'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import ShareIcon from '@material-ui/icons/Share'
import {
    Drawer,
    Hidden,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Divider,
    ListItemText,
    MenuItem,
    MenuList,
    Card, CardContent, CardActions, Button, CardHeader, Avatar, TextField, Snackbar
} from '@material-ui/core'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import CategoryIcon from '@material-ui/icons/Category'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import TuiEditorViewer from '../component/TuiEditorViewer'

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
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    header: {
        height: 249,
        width: 249,
    },
    logo: {
        height: 200,
        width: 200,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
    card: {
        textAlign: 'left',
        margin: theme.spacing.unit * 3,
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 10,
        },
    },
    cardAction: {
        position: 'relative'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    },
    readArticle: {
        position: 'absolute',
        right: 10
    },
    addFAB: {
        zIndex: 99999,
        position: 'fixed',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 3
    },
})

class Home extends Component {
    state = {
        mobileOpen: false,
        dialogOpen: false,
        speedDialOpen: false,
        snackBarOpen: false,
        title: 'GoBlog',
        message: '',
        categories: [],
        tags: [],
        articles: [],
        category: 0,
        addCategory: '',
        editID: -1,
        tag: '',
        login: false
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps !== this.props) {
            let url = '/api/article'
            if (nextProps.match.params.type !== undefined) {
                if (nextProps.match.params.type === 'category') {
                    url = '/api/article/category/' + nextProps.match.params.id
                    this.setState({category: parseInt(nextProps.match.params.id), tag: ''})
                } else if (nextProps.match.params.type === 'tag') {
                    url = '/api/tag/' + nextProps.match.params.id
                    this.setState({tag: nextProps.match.params.id, category: 0})
                }
            } else {
                this.setState({tag: '0', category: 0})
            }
            this.getArticles(url)
        }
    }

    componentWillMount () {
        this.setState({login: (Cookies.get('goblog-session') !== undefined)})

        axios.get('/api/name')
            .then(r => {
                this.setState({title: r.data})
            })
        axios.get('/api/tag')
            .then(r => {
                if (r.data.code === 0)
                    this.setState({tags: r.data.tags})
            })
        this.getArticles('/api/article')
        this.getCategories()
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen})
    }

    getArticles (url) {
        axios.get(url)
            .then(r => {
                if (r.data.code === 0) {
                    let articles = r.data.articles
                    for (let i = 0; i < articles.length; i++) {
                        axios.get('/api/article/uuid/' + articles[i].Uuid + '/description_md')
                            .then(r => {
                                if (r.data.code === 0) {
                                    articles[i] = {...articles[i], desc: r.data.markdown}
                                } else {
                                    articles[i] = {...articles[i], desc: ''}
                                }
                                this.setState({articles: articles})
                            })
                    }
                }
            })
    }

    getCategories () {
        axios.get('/api/category')
            .then(r => {
                if (r.data.code === 0)
                    this.setState({categories: r.data.categorys})
            })
    }

    getCategory (id) {
        for (let i = 0; i < this.state.categories.length; i++) {
            if (this.state.categories[i].ID === id)
                return this.state.categories[i].name
        }
        return '已删除的分类'
    }

    handleClick = () => {
        this.setState(state => ({
            speedDialOpen: !state.speedDialOpen,
        }))
    }

    handleOpen = () => {
        if (this.state.login) {
            this.setState({speedDialOpen: true})
        }
    }

    handleClose = () => {
        this.setState({speedDialOpen: false})
    }

    handleLogout = () => {
        axios.post('/api/logout')
            .then(r=>{
                if (r.data.code === 0){
                    Cookies.remove('goblog-session')
                    this.setState({login:false,snackBarOpen:true,message: '退出成功'})
                } else {
                    this.setState({snackBarOpen:true,message: '错误:'+r.data.message})
                }
            })
            .catch(()=>{
                this.setState({snackBarOpen:true,message: '网络错误'})
            })
    }

    addCategory = () => {
        if (this.state.addCategory !== '') {
            axios.post('/api/category', {
                'name': this.state.addCategory
            })
                .then(r => {
                    if (r.data.code === 0) {
                        this.setState({snackBarOpen: true, message: '添加成功', addCategory: ''})
                        this.getCategories()
                    } else
                        this.setState({snackBarOpen: true, message: '错误:' + r.data.message})
                })
        }
    }

    delCategory = id => () => {
        axios.delete('/api/category/' + id)
            .then(r => {
                if (r.data.code === 0) {
                    this.setState({snackBarOpen: true, message: '删除成功'})
                    this.getCategories()

                } else
                    this.setState({snackBarOpen: true, message: '错误:' + r.data.message})
            })
    }

    editCategory = () => {
        axios.put('/api/category/' + this.state.editID, {
            'name': this.state.addCategory
        })
            .then(r => {
                if (r.data.code === 0) {
                    this.setState({snackBarOpen: true, message: '编辑成功', addCategory: '', editID: -1})
                    this.getCategories()
                } else
                    this.setState({snackBarOpen: true, message: '错误:' + r.data.message})
            })
    }

    handleEdit = category => () => {
        this.setState({editID: category.ID, addCategory: category.name})
    }

    render () {
        const {classes} = this.props

        let isTouch
        if (typeof document !== 'undefined') {
            isTouch = 'ontouchstart' in document.documentElement
        }

        const drawer = (
            <div>
                <div className={classes.header}>
                    <img src={logo} alt="logo" className={classes.logo}/>
                    <Typography variant="title">{this.state.title}</Typography>
                </div>
                <Divider/>
                <MenuList>
                    <MenuItem component={Link} to='/'>
                        <ListItemText inset primary="全部分类"/>
                    </MenuItem>
                    {this.state.categories.map((category) => {
                        return (
                            <MenuItem selected={this.state.category === category.ID} component={Link}
                                      to={'/category/' + category.ID}>
                                <ListItemText inset primary={category.name}/>
                            </MenuItem>
                        )
                    })}
                </MenuList>
                <Divider/>
                <MenuList>
                    <MenuItem component={Link} to='/'>
                        <ListItemText inset primary="全部标签"/>
                    </MenuItem>
                    {this.state.tags.map((tag) => {
                        return (
                            <MenuItem selected={this.state.tag === tag} component={Link} to={'/tag/' + tag}>
                                <ListItemText inset primary={tag}/>
                            </MenuItem>
                        )
                    })}
                </MenuList>
            </div>
        )

        const categoryDialog = (
            <Dialog
                // fullScreen={fullScreen}
                open={this.state.dialogOpen}
                onClose={this.handleClose}
                aria-labelledby="dialog-title"
            >
                <DialogTitle id="dialog-title">{'分类管理'}</DialogTitle>
                <DialogContent>
                    <TextField
                        id="category"
                        label='分类名'
                        type="text"
                        value={this.state.addCategory}
                        onChange={e => this.setState({addCategory: e.target.value})}
                        margin="normal"
                        InputProps={{
                            endAdornment: <InputAdornment position="start">
                                {this.state.editID === -1 ?
                                    <IconButton onClick={this.addCategory}>
                                        <AddIcon/>
                                    </IconButton>
                                    :
                                    <IconButton onClick={this.editCategory}>
                                        <DoneIcon/>
                                    </IconButton>
                                }
                            </InputAdornment>,
                        }}
                    />
                    <List>
                        {this.state.categories.map(category => {
                                return (
                                    <ListItem>
                                        <ListItemText
                                            primary={category.name}
                                            secondary={'ID:' + category.ID}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.handleEdit(category)}>
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton onClick={this.delCategory(category.ID)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            }
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({dialogOpen: false})} color="primary" autoFocus>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        )

        return (
            <div className={classes.root}>
                {categoryDialog}
                <Hidden mdUp>
                    <AppBar>
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
                <main className={classes.content}>'
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={this.state.snackBarOpen}
                        autoHideDuration={3000}
                        onClose={() => this.setState({snackBarOpen: false})}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.message}</span>}
                    />
                    <Hidden mdUp>
                        <div className={classes.toolbar}/>
                    </Hidden>
                    {this.state.articles.map((article) => {
                        return (
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="Recipe" className={classes.avatar}>
                                            {article.tag}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton>
                                            <ShareIcon/>
                                        </IconButton>
                                    }
                                    title={article.title}
                                    subheader={article.CreatedAt}
                                />
                                <CardContent>
                                    <TuiEditorViewer value={article.desc}/>
                                </CardContent>
                                <CardActions className={classes.cardAction}>
                                    <Button size="small" color="primary" component={Link}
                                            to={'/category/' + article.category_id}>归类于 {this.getCategory(article.category_id)}</Button>
                                    <Button size="small" color="primary" className={classes.readArticle}
                                            component={Link} to={'/article/' + article.ID}>阅读全文</Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                    <SpeedDial
                        ariaLabel="SpeedDial"
                        className={classes.addFAB}
                        hidden={!this.state.login}
                        icon={<SpeedDialIcon/>}
                        onBlur={this.handleClose}
                        onClick={this.handleClick}
                        onClose={this.handleClose}
                        onFocus={isTouch ? undefined : this.handleOpen}
                        onMouseEnter={isTouch ? undefined : this.handleOpen}
                        onMouseLeave={this.handleClose}
                        open={this.state.speedDialOpen}
                    >
                        <SpeedDialAction
                            icon={<ExitToAppIcon/>}
                            tooltipTitle="退出登录"
                            onClick={this.handleLogout}
                        />
                        <SpeedDialAction
                            icon={<CategoryIcon/>}
                            tooltipTitle="分类"
                            onClick={() => this.setState({dialogOpen: true, speedDialOpen: false})}
                        />
                        <SpeedDialAction
                            icon={<AddIcon/>}
                            tooltipTitle="添加"
                            onClick={() => this.props.history.push('/articleEditor')}
                        />
                    </SpeedDial>
                </main>
            </div>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home)