import PropTypes from 'prop-types';
import React from 'react';
import AppointmentForm from './AppointmentForm';
import { AppointmentsList } from './AppointmentsList';
import update from 'immutability-helper';

import { FormErrors } from './FormErrors';

import moment from 'moment';
export default class Appointments extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments
    
    }
  }

 
  componentDidMount () {
      $.ajax({
        type: 'GET',
        url: '/appointments',
        dataType: "JSON"
      }).done((data) => {
        this.setState({appointments: data});
      })
  }  
  

  addNewAppointment = (appointment) =>  {
    const appointments = update(this.state.appointments,
                                { $push: [appointment]});
    this.setState({
      appointments: appointments.sort(function(a,b){
        return new Date(a.appt_time) - new Date(b.appt_time);
      })
    });
  }

  render () {
    return (
      <div>
        <AppointmentForm handleAppointment={this.addNewAppointment} />
        <AppointmentsList appointments={this.state.appointments} />
      </div>
    )
  }
}
