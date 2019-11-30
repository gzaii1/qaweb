import React, {
	useState,
	useEffect,
	useReducer,
} from 'react'
import {
	Button,
	Box,
	CssBaseline,
	Typography,
	Fab,
	FormControl,
	InputLabel,
	FilledInput,
	Select,
	Tooltip,
	Slide,
	Snackbar,
	SnackbarContent,
	IconButton,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
} from '@material-ui/core'
import axios from 'axios'
import 'animate.css'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
	amber,
	green
} from '@material-ui/core/colors'
import {
	Warning as WarningIcon,
	Error as ErrorIcon,
	Info as InfoIcon,
	Close as CloseIcon,
	KeyboardArrowLeftOutlined as KeyboardArrowLeftOutlinedIcon,
	KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon,
	CheckCircle as CheckCircleIcon,
	Done as DoneIcon,
	Add as AddIcon,
	DeleteForever as DeleteForeverIcon,
	Cancel as CancelIcon,
	Edit as EditIcon,
} from '@material-ui/icons'
import {
	makeStyles
} from '@material-ui/core/styles'
import useForm from 'react-hook-form'
import MyDialog from '../../utils/myDialog/MyDialog'
import MyAlert from '../../utils/myAlert/MyAlert'

import axiosUtil from '../../utils/axiosUtil/axiosUtil'

// axios异步获取数据
const AxUtil = new axiosUtil()

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing(1),
	},
}))

function AddNewQuestion({fetchData}){
  // 获取全部问题
  const [dataSource, setDataSource] = React.useState([])
  // 解析每个问题的类型并给与不同的显示方式
  const [type, setType] = useState()
  // 控制显示新问题
  const [newQ, setNewQ] = useState(false)
  // 控制创建问题的步骤数
  const [step, setStep] = useState(1)
  // 新问题的模型
  const [question, setQuestion] = useState({})
  // 控制显示步骤
  const [checked, setChecked] = useState([false, false, false])
  // 确定框flag
  const [dialogFlag, setDialogFlag] = useState(false)

  // animate flag  控制动画
  const [animateFlag, setAnimateFlag] = useState([])


  const classes = useStyles()
  // 页面恢复至初始
  const init = (msg) => {
    // 不清空新问题
    if (msg !== 'targetOnly') {
      // 清空新建内容
      setQuestion({})
      // 重置新建步骤
      setStep(1)
      // 关闭新建块
      setNewQ(false)
      // 清空步骤显示状态
      setChecked([false, false, false])
    }
    // 清空确认框
    setDialogFlag(false)
    // 获取页面初始数据
    fetchData()
  }

  // 保存填写的记录
  const changeQuestion = (e) => {
    let Q = question
    Q[e.target.name] = e.target.value
    setQuestion(Q)
  }

  // 上一步
  const goBack = () => {
    let list = checked
    list[step - 1] = !checked[step - 1]
    setChecked(list)
    setStep(step - 1)
  }
  // 下一步
  const goNext = () => {
    let list = checked
    list[step] = !checked[step]
    setChecked(list)
    if (step === 3) {
      createQuestionSync()
    } else {
      setStep(step + 1)
    }
  }


	// 将填写好的问题提交给后台
	const createQuestionSync = async () => {
		const body = {
			"question_title": question.title,
			"question_text": question.text ? question.text : '',
			"question_type": question.type
		}
		if (body.question_title === '' || body.question_title === undefined) {
			MyAlert.show('请输入问题标题!', 'error')
			return
		} else if (body.question_type === '' || body.question_type === undefined) {
			MyAlert.show('请选择问题的类型!', 'error')
			return
		} else {
      const {success, data} = await AxUtil.setUrl('question/createQuestion/').setType('POST').setBody(body).getData()

      if(success){
        MyAlert.show('问题创建成功!', 'success')
        deleteAnimate('new_Question_Box', 300)
      }else{
        MyAlert.show('未知错误!', 'error')
      }
		}
	}

  // 删除动画效果
  const deleteAnimate = (id, time, type) => {
    setDialogFlag(false)
    document.getElementById(id).classList.add('bounceOutLeft')
    setTimeout(() => {
      init(type)
    }, time)
  }

  const create_new_question = () => {
    setNewQ(true)
  }

  const BTN_GROUP = (e) => {
    return <Box className={''}>
        <Box className={'Fab-group over'}>
  <Box className={'backOrNext block'}></Box>
              <Fab
                variant="extended"
                size="small"
                color="secondary"
                aria-label="like"
                onClick={()=>{
                    const closeFunc = ()=>{
                      deleteAnimate('new_Question_Box', 500)
                    }
                  // 判断是否有必要弹出提示
                  const dataList = Object.values(question)
                  // 没必要
                  if(dataList.every(val => val.replace(/\s+/g, "") === '')||dataList.length===0){
                    closeFunc()
                  }else{ // 必要
                    MyDialog.show('您确定要放弃编辑吗?','^_^',closeFunc)
                  }
                }}
                className={'backOrNext'}
              >
                <Tooltip title="取消编辑">
                  <CancelIcon />
                </Tooltip>
              </Fab>
            </Box>

            <Box className={'Fab-group under'}>
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="like"
                disabled = {step===1}
                onClick={()=>goBack()}
                className={'backOrNext'}
              >
                <Tooltip title="上一步">
                  <KeyboardArrowLeftOutlinedIcon />
                </Tooltip>
              </Fab>

              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="like"
                onClick={()=>goNext()}
                className = {
                  'backOrNext'
                }
                style={{'backgroundColor':`${step===3?'green':''}`}}
              >
                {step===3?
                  <Tooltip title="提交问题">
                    <DoneIcon />
                  </Tooltip>:
                  <Tooltip title="下一步">
                    <KeyboardArrowRightOutlinedIcon/>
                  </Tooltip>
                }
              </Fab>
            </Box>
          </Box>
  }


  const INPUT_CARD = ({
    title,
    type,
  }) => {
    return <FormControl variant="filled" className={`${classes.formControl} INPUT_CARD`}>
            <InputLabel htmlFor={`component-filled-${type}`}>{title}</InputLabel>
            {type!=='type'?
              <FilledInput
                id={`component-filled-${type}`}
                name={type}
                defaultValue={question[type]}
                onChange={(e)=>{changeQuestion(e)}}
               />:
            <Select
              native
              defaultValue={question[type]}
              onChange={(e)=>{changeQuestion(e)}}
              inputProps={{
                name: 'type',
                id: 'filled-age-native-simple',
              }}
            >
              <option value="" />
              <option value={'single'}>单选题</option>
              <option value={'multi'}>多选题</option>
              <option value={'short'}>简答题</option>
            </Select>
        }

          </FormControl>
  }
    return	<Box>
    	    {newQ?<Box id={'new_Question_Box'} className={`box animated bounceInLeft `}>
    						<Box className={'box-title'}>新建问题...</Box>
    							<Box className={`newQ animated bounceInLeft`}>
    								<INPUT_CARD  title='问题的"标题"叫做...' type='title' />
    							</Box>

    						<Slide direction="right" in={checked[1]} mountOnEnter unmountOnExit timeout={400} >
    							<Box className={`newQ`}>
    								<INPUT_CARD  title='问题的"简介"...' type='text' />
    							</Box>
    						</Slide>

    						<Slide direction="right" in={checked[2]} mountOnEnter unmountOnExit timeout={400} >
    							<Box className={`newQ`}>
    								<INPUT_CARD  title='问题的"类型"...' type='type' />
    							</Box>
    						</Slide>

    						<BTN_GROUP />
    					</Box>
    					:
    					<Fab
    						variant="extended"
    						size="small"
    						color="primary"
    						aria-label="add"
    						className={'addicon'}
    						onClick={create_new_question}
    					>
    					<Tooltip title="添加新问题">
    						<AddIcon/>
    					</Tooltip>
    					</Fab>
    				}
    </Box>
}

export default AddNewQuestion
