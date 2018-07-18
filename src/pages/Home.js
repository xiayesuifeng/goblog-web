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
    Card, CardContent, CardActions, Button, CardHeader, Avatar
} from '@material-ui/core/index.es'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

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
        margin:theme.spacing.unit * 3,
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
    }
})

class Home extends Component {
    state = {
        mobileOpen: false,
        title: 'GoBlog',
        categories: [],
        tags: [],
        articles: [],
        category: 0,
        tag: '',
        login:false
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps !== this.props) {
            let url = '/api/article'
            if (nextProps.match.params.type !== undefined) {
                if (nextProps.match.params.type === 'category') {
                    url = '/api/article/category/' + nextProps.match.params.id
                    this.setState({category: parseInt(nextProps.match.params.id),tag:''})
                } else if (nextProps.match.params.type === 'tag') {
                    url = '/api/tag/' + nextProps.match.params.id
                    this.setState({tag: nextProps.match.params.id,category:0})
                }
            }else{
                this.setState({tag: '0',category:0})
            }
            this.getArticles(url)
        }
    }

    componentWillMount () {
        this.setState({login:(Cookies.get('goblog-session')!==undefined)})

        axios.get('/api/name')
            .then(r => {
                this.setState({title: r.data})
            })
        axios.get('/api/category')
            .then(r => {
                if (r.data.code === 0)
                    this.setState({categories: r.data.categorys})
            })
        axios.get('/api/tag')
            .then(r => {
                if (r.data.code === 0)
                    this.setState({tags: r.data.tags})
            })
        this.getArticles('/api/article')
    }


    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen})
    }

    getArticles(url) {
        axios.get(url)
            .then(r => {
                if (r.data.code === 0) {
                    this.setState({articles:[]})
                    let articles = r.data.articles
                    for (let i = 0; i < articles.length; i++) {
                        axios.get('/api/article/uuid/' + articles[i].Uuid + '/description')
                            .then(r => {
                                let article
                                if (r.data.code === 0) {
                                    article = {...articles[i], desc: r.data.html}
                                } else {
                                    article = {...articles[i], desc: ''}
                                }
                                this.setState({articles: [...this.state.articles, article]})
                            })
                    }
                }
            })
    }

    render () {
        const {classes} = this.props

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

        return (
            <div className={classes.root}>
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
                <main className={classes.content}>
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
                                    <div dangerouslySetInnerHTML={{__html: article.desc}}/>
                                </CardContent>
                                <CardActions className={classes.cardAction}>
                                    <Button size="small" color="primary" component={Link}
                                            to={'/category/' + article.category_id}>归类于 {this.state.categories[article.category_id - 1].name}</Button>
                                    <Button size="small" color="primary" className={classes.readArticle} component={Link} to={"/article/"+article.ID}>阅读全文</Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                    <Button variant="fab" color="primary" aria-label="add" className={classes.addFAB} component={Link} to={"/articleEditor"}>
                        <AddIcon />
                    </Button>
                </main>
            </div>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home)