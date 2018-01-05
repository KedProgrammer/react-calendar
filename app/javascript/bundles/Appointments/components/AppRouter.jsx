import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Appointments from './Appointments1';
import Appointment from './Appointment';
import AppointmentForm from './AppointmentForm';


export default (props) => {
	return(
		<Router>
		<div>
			<Route exact path="/" render={props2 => (
				<Appointments {...props2} appointments={props.appointments} />
			)} />
			<Route exact path="/appointments/:id" component={Appointment} />
			<Route  path="/appointments/:id/edit" component={AppointmentForm} />
		</div>	
		</Router>
	)
}

