import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { Lists } from '../../api/lists/lists.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const publicHandle = Meteor.subscribe('lists.public');
  const privateHandle = Meteor.subscribe('lists.private');
  const lists = Lists.find({ $or: [
      { userId: { $exists: false } },
      { userId: Meteor.userId() },
    ] }).fetch();
  //console.log(lists.length);
  if(lists.length>0){
    var cout=0;
    var lall;
    lists.map((l, index) => {
      cout+=l.incompleteCount;
      if(l.name=='全部'){
        lall=l;
      }
    })
    lall.incompleteCount=cout;
  }
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready() && privateHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    lists: lists,
  };
}, App);
