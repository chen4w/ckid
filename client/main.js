import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';

//c4w 8.6
var injectTapEventPlugin = require("react-tap-event-plugin");

Meteor.startup(() => {
  //c4w 8.6
  injectTapEventPlugin();
  render(renderRoutes(), document.getElementById('app'));
});
