import React, {
    useState,
    useEffect,
    useMemo,
} from 'react'
import {
    Box,
	Paper,
	RadioGroup,
	Radio,
	Tooltip,
	IconButton,
    InputBase,
    Button,
    ButtonGroup,
    Switch,
    FormLabel,
    FormGroup,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Typography,
} from '@material-ui/core'
import axios from 'axios'
import '../HomePage/home.css'
import './MultiChoice.css'
import {Animated} from "react-animated-css"
import moment from 'moment'
// import 'animate.css'
import {
	Warning as WarningIcon,
	HighlightOff as HighlightOffIcon,
	Error as ErrorIcon,
	Info as InfoIcon,
	CheckCircle as CheckCircleIcon,
	Add as AddIcon,
    DeleteSweep as DeleteSweepIcon
} from '@material-ui/icons'
import {
	makeStyles
} from '@material-ui/core/styles'
import useForm from 'react-hook-form'
import MyAlert from '../../utils/myAlert/MyAlert'
import MyDialog from '../../utils/myDialog/MyDialog'

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


const MultiChoice = React.memo(({data, animateFlag, fetchData})=>{
    const question_id = data.question_id
    const { register, handleSubmit, setValue, getValues } = useForm({
        // 设置初始值
        defaultValues:{
            [`edit_${question_id}`]:data.right_answer[0]
        }
    })

	// 表单提交
  	const onSubmit = (value, event) => {
          let obj= {
            question_id,
            question_index:data.option_list.length,
            option_val:value[event.target.name],
            longtext:'',
            create_time:moment().format('YYYY-MM-DD hh:mm:ss'),
            correctness:false
        }
        // 添加新option
        childFetchData(obj, 'option/addOptionById/')
		}
    const classes = useStyles()

    // 添加新option
    const childFetchData = async(obj, url)=>{
        const {success, data, message} = await AxUtil.setUrl(url).setType('POST').setBody(obj).getData()
        fetchData()
        if(success){
            MyAlert.show(message,"success")
            setValue(question_id, '')
        }else{
            MyAlert.show(message,"error")
        }
    }

    // 更新option
    const updateOption = (question_index, correctness)=>{
        let obj = {
            question_id,
            question_type:"multi",
            option_val:data.option_list[question_index].option_val,
            correctness,
            question_index,
        }
        // 添加新修改option
        childFetchData(obj, 'option/updateOneOption/')
    }

    // 删除option
    const deleteOption = (question_index)=>{
        let obj = {
            question_id,
            question_index,
        }

        // 添加新修改option
        MyDialog.show("确定删除吗?","QwQ",()=>{childFetchData(obj, 'option/deleteOptionById/')})
        // childFetchData(obj, 'http://localhost:8000/api/api/api/option/deleteOptionById/')
    }

    return <React.Fragment>
      <Typography variant="h5" component="h3">
        {`${data.question_title}(复选题)`}
      </Typography>
      <Typography component="p">
        {data.question_text}
      </Typography>
        <form onSubmit={handleSubmit(onSubmit)} name={question_id}>
            <FormGroup defaultValue="female" aria-label="gender" className={'radioGroup'} >
                {data.option_list.map((val,idx)=>{
                        return <FormControlLabel
                            className={'animated bounceInLeft'}
                            key={`FormControlLabel_submit_${idx}`}
                            value={JSON.stringify(val.question_index)}
                            control={<Checkbox checked={false} onChange={()=>{
                                console.log(111)
                            }} value="gilad" />
                                    }
                            label={val.option_val}
                            name={`submit_${question_id}`}
                            inputRef={register}
                            className={`${classes.formControl} radio animated bounceInLeft`}
                            />
                })}
                <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={animateFlag.includes(question_id)}>
                    <Paper
                            id={`paper_${question_id}`}
                            className={`${classes.root} add_btn_group`}
                            name={question_id}
                            >
                            <Tooltip title="添加选项">
                                <IconButton className={classes.iconButton} aria-label="menu" type="submit" >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>

                            <InputBase
                                className={classes.input}
                                placeholder="请输入要添加的内容"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                name = {question_id}
                                inputRef={register}
                            />
                    </Paper>
                </Animated>
            </FormGroup>

            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={animateFlag.includes(question_id)} style={{'float':'left'}}>
                {/* 编辑内容 */}
                <FormGroup id={`edit_${question_id}`} defaultValue={getValues()[`edit_${question_id}`]} aria-label="gender" className={'radioGroup_edit'}>
                    {data.option_list.map((val,idx)=>{
                            return <FormControlLabel
                            className={'animated bounceInLeft'}
                            key={`FormControlLabel_submit_${idx}`}
                            value={JSON.stringify(data.question_index)}
                            control={<Switch
                                        checked={val.correctness}
                                        value={val.question_index}
                                        onChange={(e)=>{
                                            updateOption(e.target.value, !val.correctness)
                                        }}
                                      />
                                    }
                            // label={val.option_val}
                            name={`submit_${question_id}`}
                            inputRef={register}
                            className={`${classes.formControl} radio animated bounceInLeft`}
                            />
                    })}
                </FormGroup>
            </Animated>

            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={animateFlag.includes(question_id)} className={'radioGroup_delete'}>
            <RadioGroup id={`edit_${question_id}`} defaultValue={getValues()[`edit_${question_id}`]} aria-label="gender">
                    {data.option_list.map((val,idx)=>{
                            return <FormControlLabel
                                key={`FormControlLabel_${idx}`}
                                value={JSON.stringify(val.question_index)}
                                control={<Box className={'ButtonArea'} key={`iconDel_box_${idx}`}>
                                    <IconButton
                                        key={`iconDel_${idx}`}
                                        className={classes.iconButton}
                                        aria-label="menu"
                                        onClick={()=>{
                                        deleteOption(idx)
                                    }}>
                                        <DeleteSweepIcon key={`iconDel_btn_${idx}`} />
                                    </IconButton>
                            </Box> }
                                className={`${classes.formControl} radio`}
                                />
                    })}
                </RadioGroup>
            </Animated>
    </form>
</React.Fragment>
})

export default MultiChoice
