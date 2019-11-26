import React from 'react'
import {
	Button,
	Box,
    Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
} from '@material-ui/core'
import 'animate.css'
import ReactDOM from 'react-dom'

class MyAlert extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      flag:false,
      title:'',
      text:'',
      func:()=>{},
    }

    this.show = this.show.bind(this)
    this.init = this.init.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount(){
    this.init()
  }

  componentWillUnmount(){
    this.init()
  }

  // 展示toast内容
  show(title="title", text="text",func=()=>{console.log('test')}){
    this.setState((prevState)=>{
      return {
        flag:true,
        title,
        text,
        func,
      }
    })
  }

  // 初始化显示
  init(){
    this.setState((prevState)=>{
      return {
        flag:false,
        title:'',
        text:'',
        func:()=>{},
      }
    })
  }

  // 关闭toast
  handleClose(){
    this.setState((prevState)=>{
      return {
        flag:false,
        msg:prevState.msg,
        type:prevState.type,
      }
    })
  }

  render(){
    return <Box>
            <Dialog
                open={this.state.flag}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {this.state.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions onChange={()=>{
                console.log('changle了奥')
            }}>
                <Button onClick={this.handleClose} color="primary">
                取消
                </Button>
                <Button onClick={()=>{
                    this.state.func()
                    this.handleClose()
                }} color="primary" autoFocus>
                确定
                </Button>
            </DialogActions>
            </Dialog>
          </Box>
  }

}

let div = document.createElement('div')
let props = {

}

document.body.appendChild(div)

let AlertBox = ReactDOM.render(React.createElement(
  MyAlert,
  props,
),div)

export default AlertBox