//c4w 8.7
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginBottom: 16,
  },
  customWidth: {
    width: 150,
  },
  btn:{width: '50%', margin: '0 auto'},
};

export default class TodoPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      date: '',
      errors: {} ,
      value: 2
    };
  }

 
getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
 }

  render() {

    return  <div>
      <TextField
        id="text-field-ptext"
        floatingLabelText='任务名'
        floatingLabelFixed={true}

        style={{width: '90%',margin: '5%'}}
        multiLine={true}
        value={this.props.todo.title}
        onChange={this.props.handleChange} 
    />
    <div style={{width:'100%'}}>
    <DatePicker hintText="xxxx-xx-xx"
    floatingLabelText='截止日期'
    floatingLabelFixed={true}
    style={{width: '40%',margin: '5%',float: 'left'}}
     />
    <TimePicker
      floatingLabelText='截止时间'
      floatingLabelFixed={true}

      style={{width: '40%',margin: '5%',float:'right'}}
      format="24hr"
      hintText="24hr"
    />
    </div>

    <div style={{width:'100%'}}>
    <SelectField value={this.state.recur} 
     style={{width: '40%',margin: '5%',float:'left'}}
    floatingLabelText='重复提醒'
    floatingLabelFixed={true}

     >
      <MenuItem value={1} primaryText="每天" />
      <MenuItem value={2} primaryText="每周" />
      <MenuItem value={3} primaryText="每月" />
      <MenuItem value={4} primaryText="每年" />
    </SelectField>

    <SelectField value={this.state.recur} 
     style={{width: '40%',margin: '5%',float:'right'}}
    floatingLabelText='提前提醒'
    floatingLabelFixed={true}

     >
      <MenuItem value={1} primaryText="当天" />
      <MenuItem value={2} primaryText="1天" />
      <MenuItem value={3} primaryText="2天" />
      <MenuItem value={4} primaryText="3天" />
      <MenuItem value={5} primaryText="5天" />
      <MenuItem value={5} primaryText="1周" />
    </SelectField>
    </div>

  </div>;
  }
}
TodoPage.propTypes = {
  todo: React.PropTypes.object,
 };

TodoPage.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};