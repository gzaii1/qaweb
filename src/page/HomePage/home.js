import React, {
	useState,
	useEffect,
	useReducer,
} from 'react';
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
	Container,
	AppBar,
	Tab,
	Tabs,
} from '@material-ui/core';
import axios from 'axios';
import './home.css';
import 'animate.css';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	amber,
	green
} from '@material-ui/core/colors';
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
} from '@material-ui/icons';
import {
	makeStyles
} from '@material-ui/core/styles';
import useForm from 'react-hook-form'
import SingleChoice from '../components/SingleChoice'
import MultiChoice from '../components/MultiChoice'
import ShortAnswer from '../components/ShortAnswer'
import AddNewQuestion from '../components/AddNewQuestion'
import MyAlert from '../../utils/myAlert/MyAlert'
import MyDialog from '../../utils/myDialog/MyDialog'

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing(1),
	},
}));



const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const HomePage = React.memo((props) => {
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

		useEffect(() => {
			fetchData()
		}, [])

		async function fetchData() {
			// 为给定 ID 的 user 创建请求
			let data = await axios.get('http://guohan912.cn/api/question/getAllQuestion/')
			if (data.status === 200) {
				setDataSource(data.data.data)
			}
			console.log('fetchdata')
		}

		// 删除动画效果
		const deleteAnimate = (id, time, type) => {
			setDialogFlag(false)
			document.getElementById(id).classList.add('bounceOutLeft')
			setTimeout(() => {
				init(type)
			}, time)
		}

		// 删除问题
		const deleteQuestion = async (id) => {
			const body = {
				"question_id": id ? id : ''
			}
			const data = await axios.post('http://guohan912.cn/api/question/deleteQuestionById/', body)
			if (data.status === 200) {
				MyAlert.show('问题已删除!', 'success')
				// 删除动画
				deleteAnimate(id, 500, 'targetOnly')
			} else {
				MyAlert.show('未知错误!', 'error')
			}
		}

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
		const classes = useStyles();

	return (
		<Box className={'HomePage'}>
			<Typography
					component="div"
					role="tabpanel"
					aria-labelledby={`simple-tab-1`}
				>
				<div className={classes.root}>
				 <AppBar position="static">
					 		<Tabs onChange={()=>{}} aria-label="simple tabs example">
						 		<Tab label="构建问卷" />
					 		</Tabs>
				 </AppBar>
			 </div>
		</Typography>
		<Box style={{'width':'100%','height':'1rem'}}></Box>
			<CssBaseline />
			<Container fixed>
				{dataSource.map((data,idx)=>{
				return <Box id={data.question_id} className={'box animated bounceInLeft'} key={data.question_id}>
					{ /*<Box id={data.question_id} className={'box animated bounceInLeft'} key={`box_${idx}`}>*/ }
							{/* {type[data.question_type](data.option_list, data.question_id)} */}
							{data.question_type==="single"?
								<SingleChoice data={data} animateFlag={animateFlag} fetchData={fetchData} /> :
								data.question_type==="multi"?
								<MultiChoice data={data} animateFlag={animateFlag} fetchData={fetchData} /> :
								data.question_type==='short'?
								<ShortAnswer data={data} animateFlag={animateFlag} fetchData={fetchData} /> :null
							}

							<Box className={'Fab-group-main'}>
								<Fab
									variant="extended"
									size = "small"
									color="primary"
									aria-label="like"
									onClick={()=>{

										if(animateFlag.includes(data.question_id)){
											setAnimateFlag(animateFlag.filter(val=>{return val!==data.question_id}))
										}else{
											setAnimateFlag([...animateFlag,data.question_id])
										}
									}}
									className={'addicon-red'}
									>
									<Tooltip title="编辑问题">
										<EditIcon />
									</Tooltip>
								</Fab>
								<Fab
									variant="extended"
									size = "small"
									color="secondary"
									aria-label="like"
									onClick={()=>
										MyDialog.show('您确定要删除该问题吗?', 'QAQ', () => { deleteQuestion(data.question_id)})
									}
									className={'addicon-red'}
									>
									<Tooltip title="删除该问题">
										<DeleteForeverIcon />
									</Tooltip>
								</Fab>
								</Box>
						</Box>
				})}
					<Box className={'AddNewQuestion animated bounceInLeft'}>
						<AddNewQuestion fetchData={fetchData} />
					</Box>
				</Container>

				<Box className={'myfooter'}></Box>
		</Box>
	)
})

export default HomePage;
