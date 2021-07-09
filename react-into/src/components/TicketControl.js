import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as a from './../actions';
import Moment from 'moment';

class TicketControl extends React.Component {

  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      //formVisibleOnPage: false,
      selectedTicket: null,
      editing: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() => 
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  // componentDidUpdate() {
  //   console.log('component updated!');
  // }

  componentWillUnmount() {
    console.log("component unmounted!");
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.masterTicketList).forEach(ticket => {
      const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    });
  }

  handleClick = () => {
    if (this.state.selectedTicket) {
      this.setState({
        //formVisibleOnPage: false,
        selectedTicket: null,
        editing: false 
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm()
      dispatch(action);
    }
  }

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = a.deleteTicket(id);
    dispatch(action);
    this.setState({selectedTicket: null});
  }


  handleAddingNewTicketToList = (newTicket) => {
    const { dispatch } = this.props;
    const action = a.addTicket(newTicket);
    dispatch(action);
    const action2 = a.toggleForm();
    dispatch(action2);
  }

  handleChangingSelectedTicket = (id) => {
    const selectedTicket = this.props.masterTicketList[id];
    this.state({selectedTicket: selectedTicket})
  }

  handleEditClick = () => {
    console.log("handleEditClick reached!");
    this.setState({editing: true});
  }
  
  handleEditingTicketInList = (ticketToEdit) => {
    const {dispatch} = this.props;
    const action = a.addTicket(ticketToEdit)
    dispatch(action);
    this.setState({selectedTicket: null})
  }
  

  render(){
    let currentlyVisibleState = null;
    let buttonText = null; 
    if (this.state.editing ) {      
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />;
      buttonText = "Return to Ticket List";
    } else if (this.state.selectedTicket) {
      currentlyVisibleState = 
      <TicketDetail
        ticket = {this.state.selectedTicket} 
        onClickingDelete = {this.handleDeletingTicket}
        onClickingEdit = {this.handleEditClick}/>
      buttonText = "Return to Ticket List";
    } else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList} />;
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList ticketList={this.props.masterTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
      buttonText = "Add Ticket";
    }
    return (
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button> 
      </React.Fragment>
    );
  };
}

TicketControl.propTypes = {
  masterTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return{
    masterTicketList: state,
    formVisibleOnPage: state.formVisibileOnPage
    // key-Value pairs of state to be mapped from Redux to React component go here 
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default TicketControl;