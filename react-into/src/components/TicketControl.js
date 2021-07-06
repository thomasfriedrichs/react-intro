import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from "react-redux";
import PropTypes from "prop-types";


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

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        //formVisibleOnPage: false,
        selectedTicket: null,
        editing: false 
      });
    } else {
      const { dispatch } = this.props;
      const action = {
        type: 'TOGGLE_FORM'
      }
      dispatch(action);
    }
  }

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_TICKET',
      id: id
    }
    dispatch(action);
    this.setState({selectedTicket: null});
  }


  handleAddingNewTicketToList = (newTicket) => {
    const { dispatch } = this.props;
    const {id, names, location, issue } = newTicket;
    const action = {
      type: 'ADD_TICKET',
      id: id,
      names: names,
      location: location,
      issue: issue
    }
    dispatch(action);
    const action2 = {
      type: 'TOGGLE_FORM'
    }
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
  
  handleEditingTicketInList = (id) => {
    const {dispatch} = this.props;
    const action = {
      type: 'DELETE_TICKET',
      id: id
    }
    dispatch(action);
    this.setState({selectedTicket: null})
  }
  

  render(){
    let currentlyVisibleState = null;
    let buttonText = null; 
    if (this.state.editing ) {      
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />;
      buttonText = "Return to Ticket List";
    } else if (this.state.selectedTicket != null) {
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