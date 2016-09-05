/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Todos } from '../todos.js';
import { Lists } from '../../lists/lists.js';

Meteor.publishComposite('todos.inList', function todosInList(listId) {
  new SimpleSchema({
    listId: { type: String },
  }).validate({ listId });

  const userId = this.userId;

  return {
    find() {
      const query = {
        _id: listId,
        $or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the todos
      const options = {
        fields: { _id: 1, name: 1 },
      };

      return Lists.find(query, options);
    },

    children: [{
      find(list) {
        console.log('list :'+list.name+' '+list._id);
        if(list.name=='全部'){
          const lists = Lists.find({ $or: [
            { userId: { $exists: false } },
            { userId: userId },
          ] }).fetch();
          var cout=0;
          let lids = lists.map((l, index) => {
            cout+=l.incompleteCount;
            return l._id;
          })
          list.incompleteCount=cout;
          console.log('in:'+lids);
          return Todos.find({ listId: {$in: lids} }, {fields: Todos.publicFields});   
        }else       
          return Todos.find({ listId: list._id }, { fields: Todos.publicFields });
      },
    }],
  };
});

//c4w 8.6
Meteor.publishComposite('todos.inTodo', function todosInTodo(todoId) {
  new SimpleSchema({
    todoId: { type: String },
  }).validate({ todoId });

  //const userId = this.userId;

  return {
    find() {
      const query = {
        _id: todoId,
        //$or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the todos
      return Todos.find(query, { fields: Todos.publicFields });
    },
  };
});