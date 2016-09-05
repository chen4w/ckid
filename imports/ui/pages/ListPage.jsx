import React from 'react';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import TodoPage from '../pages/TodoPage.jsx';
import Message from '../components/Message.jsx';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { displayError } from '../helpers/errors.js';


import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
  setCheckedStatus,
  updateText,
  updateTodo,
  remove,
} from '../../api/todos/methods.js';

var divStyle = {
  background: "#eee",
  padding: "20px",
  margin: "20px"
};

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingTodo: null,
      open:false,
      childData:{title:'222'},
      recur:2
    };
  }
getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
 }

handleToggle  (){ 
  this.setState({open: !this.state.open});
 }
handleOk(){
  this.setState({open: false});
  var cd = this.state.childData;
  var tid = cd._id;
  console.log(cd._id);
  //delete cd._id;
  updateTodo.call({
    todoId: cd._id,
    todoObj:{
      title: cd.title,
      endAt: cd.endAt,
      remindAt: cd.remindAt,
      desc: cd.desc,
      freType: cd.freType,
      priority: cd.priority,
    }
  }, displayError);
}

onEditingChange(childData, editing) {
    //console.log('onEditingChange');
    this.setState({
      editingTodo: editing ? childData._id : null,
    });
    if(editing){
      this.setState({childData:childData});
    }
}
handleChildClick(childData,event) {
    this.setState({open: true,childData:childData});
  }
  render() {
    const actions = [
      <FlatButton
        label="完成"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleOk.bind(this)}
      />,
    ];

    const { list, listExists, loading, todos } = this.props;
    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage/>;
    }

    let Todos;
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title="No tasks here"
          subtitle="Add new tasks using the field above"
        />
      );
    } else {
      Todos = todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo._id}
          onClick={this.handleChildClick.bind(this,todo)}
          editing={todo._id === editingTodo}
          onEditingChange={this.onEditingChange.bind(this,todo)}
        />
      ));
    }

    return (
      <div className="page lists-show">
        <Dialog
        contentStyle={{width: '100%',maxWidth: 600,}}
        autoScrollBodyContent={true}
        actions={actions}
        modal={false}
         open={this.state.open} openSecondary={true}>
       <TodoPage  
        todo={this.state.childData}        
       />       
        </Dialog>
      
      <ListHeader list={list}/>
        <div className="content-scrollable list-items">
          {loading ? <Message title="Loading tasks..."/> : Todos}
        </div>

      </div>
    );
  }
}

ListPage.propTypes = {
  list: React.PropTypes.object,
  todos: React.PropTypes.array,
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
};
ListPage.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};