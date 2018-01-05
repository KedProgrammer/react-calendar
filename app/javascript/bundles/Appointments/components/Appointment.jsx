import React from 'react';
import {Link} from 'react-router-dom';
import { formatDate } from '../utils/format';
import { Back } from './Back';

export default class Appointment extends React.Component {
 constructor (props) {
  super(props)
  this.state= {
  	appointment: props.appointment,
  	back: false
  }
 }
 
 static defaultProps = {
 	appointment: {}
 }

 componentDidMount () {
 	if (this.props.match) {
	 	$.ajax({
	 		type: 'GET',
	 		url: `/appointments/${this.props.match.params.id}`,
	 		dataType: "JSON"
	 	}).done((data) => {
	 		this.setState({appointment: data, back: true});
	 	})
	}
 }

 render () {
  return (
   <div className='appointment'>
    <h2>Appointment</h2>
    <Link to={`/appointments/${this.state.appointment.id}`} >
     <h3>{this.state.appointment.title}</h3>
    </Link>
    <p>{formatDate(this.state.appointment.appt_time)}</p>
    {this.state.back ? 	<Link to={'/'} ><h3>Back</h3></Link>  :  ""}
    <Link to={`/appointments/${this.state.appointment.id}/edit`} ><h3>Edit</h3></Link> 
   </div>
  )
 }
}