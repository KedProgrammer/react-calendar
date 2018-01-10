import React from 'react';
import Datetime from 'react-datetime';
import moment from'moment';
import { validations } from '../utils/validations';
import update from 'immutability-helper';
import { FormErrors } from './FormErrors';

export default class AppointmentForm extends React.Component {
   constructor (props, railsContext) {
    super(props)
    this.state = {
      
      title: {value: '', valid: false},
      appt_time: {value: '', valid: false},
      formErrors: {},
      formValid: false,
      edit: false
    }
  }

  static formValidations = {
    title: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    appt_time: [
      (t) => { return(validations.timeShouldBeInTheFuture(t))}
    ]
  }


   handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = update(this.state[fieldName],
                                  {value: {$set: fieldValue}});
    this.setState({[fieldName]: newFieldState},
                  () => { this.validateField(fieldName, fieldValue, validations) });
  }
validateField (fieldName, fieldValue, validations) {
    let fieldValid;

    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if(e !== '') {
        errors.push(e);
      }
      return(errors);
    }, []);

    fieldValid = fieldErrors.length === 0;

    const newFieldState = update(this.state[fieldName],
                                  {valid: {$set: fieldValid}});

    const newFormErrors = update(this.state.formErrors,
                                  {$merge: {[fieldName]: fieldErrors}});

    this.setState({[fieldName]: newFieldState,
                    formErrors: newFormErrors}, this.validateForm);
  }

  validateForm () {
    this.setState({formValid: this.state.title.valid &&
                              this.state.appt_time.valid
                  });
  }

  handleFormSubmit = (e) => {
        e.preventDefault();
         if (this.props.match) {
    this.props.match.path === '/appointments/:id/edit' ? 
      this.updateAppointment() :
      this.addAppointment()

    }else{
       this.addAppointment()
    }

  }
    
  updateAppointment(){
     
    const appointment = {title: this.state.title.value,
                         appt_time: this.state.appt_time.value};
    $.ajax({
          type: "PATCH",
          url: `/appointments/${this.props.match.params.id}`,
          data: {appointment: appointment}
          }).done((data) => {
            console.log("updated!")
            this.resetFormErrors();
          })
          .fail((response) => {
            this.setState({formErrors: response.responseJSON})
          });

  }

  addAppointment() {

    const appointment = {title: this.state.title.value,
                         appt_time: this.state.appt_time.value};
    $.post('/appointments',
            {appointment: appointment})
          .done((data) => {
            this.props.handleAppointment(data);
            this.resetFormErrors();
          })
          .fail((response) => {
            this.setState({formErrors: response.responseJSON})
          });
  
  }

  resetFormErrors () {
    this.setState({formErrors: {}})
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    this.handleUserInput(fieldName, fieldValue,
                            AppointmentForm.formValidations[fieldName]);
  }


  setApptTime = (e) => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.handleUserInput(fieldName, fieldValue,
                            AppointmentForm.formValidations[fieldName]);
  }

    componentDidMount () {
      if (this.props.match){
        $.ajax({
          type: 'GET',
          url: `/appointments/${this.props.match.params.id}/edit`,
          dataType: "JSON"
        }).done((data) => {
        
            this.setState({title: {value: data.title},
                          appt_time: {value: data.appt_time}
          });
        })
      }
      if (this.props.match) {
         this.props.match.path === '/appointments/:id/edit' ? 
          this.setState({edit: true}) :
          this.setState({edit: false})
      }

  }  

  deleteAppointment = () => {
     $.ajax({
          type: "DELETE",
          url: `/appointments/${this.props.match.params.id}`
          }).done((data) => {
             this.props.history.push("/");
            this.resetFormErrors();
          })
          .fail((response) => {
            this.setState({formErrors: response.responseJSON})
          });
  }

  render () {
    const inputProps = {
      name: 'appt_time'
    };

    return (
      <div>
        <h2>Make a new appointment</h2>
        <FormErrors formErrors = {this.state.formErrors} />
        <form onSubmit={this.handleFormSubmit}>
          <input name='title' placeholder='Appointment Title'
            value={this.state.title.value}
            onChange={this.handleChange} />

          <Datetime input={false} open={true} inputProps={inputProps}
            value={moment(this.state.appt_time.value)}
            onChange={this.setApptTime} />

          <input type='submit' value={this.state.edit ? 'Edit appointment' : 'Make Appointment' }
            className='submit-button'
            disabled={!this.state.formValid} />
        </form>

        {this.state.edit && (
          <p>
            <button onClick={this.deleteAppointment}>
              Delete Appointment
            </button>
          </p>
          )
        }        
      </div>
    )
  }
}
