import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Todos } from './todos.js';
import { Lists } from '../lists/lists.js';

export const insert = new ValidatedMethod({
  name: 'todos.insert',
  validate: new SimpleSchema({
    listId: { type: String },
    title: { type: String },
  }).validator(),
  run({ listId, title }) {
    const list = Lists.findOne(listId);

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('todos.insert.accessDenied',
        'Cannot add todos to a private list that is not yours');
    }

    const todo = {
      listId,
      title,
      checked: false,
      createdAt: new Date(),
    };

    Todos.insert(todo);
  },
});

export const setCheckedStatus = new ValidatedMethod({
  name: 'todos.makeChecked',
  validate: new SimpleSchema({
    todoId: { type: String },
    newCheckedStatus: { type: Boolean },
  }).validator(),
  run({ todoId, newCheckedStatus }) {
    const todo = Todos.findOne(todoId);

    if (todo.checked === newCheckedStatus) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('todos.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private list that is not yours');
    }
    //todo 记录check日志
    const nv=  {} 
    //check 周期任务时,运算出下一次remindAt
    if(newCheckedStatus && todo.remindAt && todo.freType && todo.freType!='0'){
      let lr= todo.remindAt;
      let nr= new Date();
      //每天重复
      if(todo.freType=='1'){
        nr.setDate(lr.getDate() + 1);
        //每周重复
      }else if(todo.freType=='2'){
        nr.setDate(lr.getDate() + 7);
        //每月重复
      }else if(todo.freType=='3'){
        nr.setMonth(lr.getMonth() + 1);
        //每年重复
      }else if(todo.freType=='4'){
        nr.setFullYear(lr.getFullYear() + 1);
      }
      nv.remindAt=nr;
    }else nv.checked=true;

    Todos.update(todoId, { $set:nv});
  },
});

export const updateText = new ValidatedMethod({
  name: 'todos.updateText',
  validate: new SimpleSchema({
    todoId: { type: String },
    newText: { type: String },
  }).validator(),
  run({ todoId, newText }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId);

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('todos.updateText.accessDenied',
        'Cannot edit todos in a private list that is not yours');
    }

    Todos.update(todoId, {
      $set: { title: newText },
    });
  },
});

export const updateTodo = new ValidatedMethod({
  name: 'todos.updateTodo',
  validate: null,
  run({ todoId, todoObj }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId);

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('todos.updateText.accessDenied',
        'Cannot edit todos in a private list that is not yours');
    }
    console.log('updateTodo')
    Todos.update(todoId, {
      $set: todoObj,
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'todos.remove',
  validate: new SimpleSchema({
    todoId: { type: String },
  }).validator(),
  run({ todoId }) {
    const todo = Todos.findOne(todoId);

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('todos.remove.accessDenied',
        'Cannot remove todos in a private list that is not yours');
    }

    Todos.remove(todoId);
  },
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck([
  insert,
  setCheckedStatus,
  updateText,
  updateTodo,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(TODOS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
