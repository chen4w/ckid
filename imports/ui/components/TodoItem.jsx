import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import { displayError } from '../helpers/errors.js';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle(value => {
      if (value) {
        updateText.call({
          todoId: this.props.todo._id,
          newText: value,
        }, displayError);
      }
    }, 300);

    this.setTodoCheckStatus = this.setTodoCheckStatus.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onEditingChange(this.props.todo._id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.todo._id, false);
  }

  setTodoCheckStatus(event) {
    setCheckedStatus.call({
      todoId: this.props.todo._id,
      newCheckedStatus: event.target.checked,
    });
  }

  updateTodo(event) {
    this.throttledUpdate(event.target.value);
  }

  deleteTodo() {
    remove.call({ todoId: this.props.todo._id }, displayError);
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing,
    });
    const week_name=['日','一','二','三','四','五','六'];
    const rdt = todo.remindAt;
    const dtn = new Date();
    const str_remind = rdt? ((rdt.getFullYear()==dtn.getFullYear()?'':rdt.getFullYear()+'年')
      +(rdt.getMonth()+1)+'月'+rdt.getDate()+'日' 
      +' 星期'+ week_name[rdt.getDay()]
      + ' '+rdt.getHours()+':'+rdt.getMinutes() ):'';
    
    const name_col = (rdt && rdt.getTime()<dtn.getTime())?'red':'#333333'

    return (
      <div>
      <div className={todoClass}>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus}
          />
          <span className="checkbox-custom"></span>
        </label>
          

        <input
          type="text"
          value = {todo.title}
          placeholder="Task name"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={{color: name_col}}
          onChange={this.updateTodo}
        />
        <a
          className="delete-item"
          href="#"
          onClick={this.deleteTodo}
          onMouseDown={this.deleteTodo}
        >
          <span className="icon-trash"></span>
        </a>

        {/*c4w 8.7*/}
        <a
          className="edit-item"
          href="#"
          onClick={this.props.onClick}
          onMouseDown={this.props.onClick}
        >
        <span className="icon-edit"></span>
      </a>  
      
      </div>
      <span className="span-remind">{str_remind}</span>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todo: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};
