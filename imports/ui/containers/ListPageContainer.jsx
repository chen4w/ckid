import { Meteor } from 'meteor/meteor';
import { Lists } from '../../api/lists/lists.js';
import { Todos } from '../../api/todos/todos.js';

import { createContainer } from 'meteor/react-meteor-data';
import ListPage from '../pages/ListPage.jsx';

export default ListPageContainer = createContainer(({ params: { id } }) => {
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);

  const listExists = !loading && !!list;
  const todos = listExists ? list.todos().fetch() : []
 return {
    loading,
    list,
    listExists,
    todos: todos,
  };
}, ListPage);
