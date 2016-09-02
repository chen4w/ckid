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
    this.onEditingChange = this.onEditingChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
 }

handleToggle  (){ 
  this.setState({open: !this.state.open});
}
  handleChange(event) {
    var cd = this.state.childData;
    var value = event.target.value;
    cd.title=value;
    this.setState({childData: cd});
    updateText.call({
      todoId: cd._id,
      newText: value,
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
    console.log('childData:'+childData);
    this.setState({open: true,childData:childData});
  }
  render() {
    const actions = [
      <FlatButton
        label="完成"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleToggle}
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
          onClick={this.handleChildClick.bind(null,todo)}
          editing={todo._id === editingTodo}
          onEditingChange={this.onEditingChange.bind(null,todo)}
        />
      ));
    }

    return (
      <div className="page lists-show">
        <Dialog
        contentStyle={{width: '100%',maxWidth: 600,}}
        actions={actions}
        modal={false}
         open={this.state.open} openSecondary={true}>
       <TodoPage  
        handleChange={this.handleChange.bind(null)}
        handleToggle={this.handleToggle.bind(null)}
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