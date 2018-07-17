import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Button, Paper, TextField } from '@material-ui/core/index.es'
import axios from 'axios'

const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    },
    login: {
        padding: theme.spacing.unit * 3
    }
})

class Login extends Component {
    state = {
        password:'',
        message: ''
    }

    handleLogin = () => {
        if (this.state.password === '')
            return
        axios.post('/api/login',{
            password:this.state.password
        })
            .then(r=>{
                if (r.data.code === 0) {
                    this.setState({message:''})
                    this.props.history.push('/')
                } else if (r.data.message==='password errors'){
                    this.setState({message:'密码错误'})
                } else {
                    this.setState({message:r.data.message})
                }
            })
    }

    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <Paper className={classes.login}>
                    <span>登录</span>
                    <TextField
                        error={this.state.message!==''}
                        id="password"
                        label={this.state.message!==''?this.state.message:'密码'}
                        type="password"
                        value={this.state.password}
                        onChange={e => this.setState({password:e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={this.handleLogin}>登录</Button>
                </Paper>
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login)