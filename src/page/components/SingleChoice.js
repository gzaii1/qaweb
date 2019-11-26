import React, {
    useState,
    useEffect,
    useMemo,
} from 'react';
import {
  Box,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  Tooltip,
  IconButton,
  InputBase,
  Button,
  ButtonGroup,
  FormGroup,
  Switch,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import '../HomePage/home.css';
import './SingleChoice.css';
import {Animated} from "react-animated-css";
import moment from 'moment'
// import 'animate.css';
import {
	Warning as WarningIcon,
	HighlightOff as HighlightOffIcon,
	Error as ErrorIcon,
	Info as InfoIcon,
	CheckCircle as CheckCircleIcon,
	Add as AddIcon,
    DeleteSweep as DeleteSweepIcon
} from '@material-ui/icons';
import {
	makeStyles
} from '@material-ui/core/styles';
import useForm from 'react-hook-form'

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


const SingleChoice = React.memo(({data, animateFlag, fetchData})=>{
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
            correctness:false,
        }
        // 添加新option
        childFetchData(obj, 'http://guohan912.cn/api/option/addOptionById/')
		}
    const classes = useStyles()

    // 添加新option
    const childFetchData = async(obj, url)=>{
        let responseJson = await axios.post(url, obj)
        fetchData()
        if(responseJson.data.success){
            MyAlert.show(responseJson.data.message,"success")
            setValue(question_id, '')
        }else{
            MyAlert.show(responseJson.data.message,"error")
        }
    }

    // 更新option
    const updateOption = (question_index)=>{
        let obj = {
            question_id,
            question_type:"single",
            option_val:data.option_list[question_index].option_val,
            correctness:true,
            question_index
        }
        // 添加新修改option
        childFetchData(obj, 'http://guohan912.cn/api/option/updateOneOption/')
    }

    // 删除option
    const deleteOption = (question_index)=>{
        let obj = {
            question_id,
            question_index,
        }

        // 添加新修改option
        MyDialog.show("确定删除吗?","QwQ",()=>{childFetchData(obj, 'http://guohan912.cn/api/option/deleteOptionById/')})
        // childFetchData(obj, 'http://guohan912.cn/api/option/deleteOptionById/')
    }

    return <React.Fragment>
      <Typography variant="h5" component="h3">
        {`${data.question_title}(单选题)`}
      </Typography>
      <Typography component="p">
        {data.question_text}
      </Typography>
        <form onSubmit={handleSubmit(onSubmit)} name={question_id}>
            <RadioGroup defaultValue="female" aria-label="gender" className={'radioGroup'} >
                {data.option_list.map((val,idx)=>{
                        return <FormControlLabel
                            className={'animated bounceInLeft'}
                            key={`FormControlLabel_submit_${idx}`}
                            value={JSON.stringify(val.question_index)}
                            control={<Radio
                                        color='primary'
                                        onChange={(e)=>{
                                            setValue(`submit_${question_id}`, e.target.value)
                                        }}/>
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
            </RadioGroup>

            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={animateFlag.includes(question_id)} style={{'float':'left'}}>
                {/* 编辑内容 */}
                <FormGroup id={`edit_${question_id}`} defaultValue={getValues()[`edit_${question_id}`]} aria-label="gender" className={'radioGroup_edit'}>
                    {data.option_list.map((val,idx)=>{
                            return <FormControlLabel
                                key={`FormControlLabel_${idx}`}
                                name={`edit_${question_id}`}
                                inputRef={register}
                                value={JSON.stringify(val.question_index)}
                                control={<Switch
                                    checked={val.correctness}
                                    value={val.question_index}
                                    onChange={(e)=>{
                                        updateOption(e.target.value, question_id)
                                        setValue(`edit_${question_id}`, parseInt(e.target.value))
                                    }}
                                /> }
                                className={`${classes.formControl} radio`}
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

export default SingleChoice;
