import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
// import MesssageCheckbox from "./MessageCheckbox";

import AttachmentDateFields from "./AttachmentDateFields";
import {getNameEmail} from '../../../utils';

import { BsPersonFill } from 'react-icons/bs'
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export class MessageItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.data.selected ? " selected" : ""
    }

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.messageSelected = this.messageSelected.bind(this);
  }

  onSelectionChange(evt) {
    this.props.onSelectionChange(evt.target.checked, this.props.data.id);
  }

  getMessage(evt) {
    this.props.history.push(`/${this.props.data.id}`);
  }

  getFromName(from) {
    const nameEmail = getNameEmail(from);
    return nameEmail.name;
  }

  getFormattedDate(date, fallbackDateObj) {
    let messageDate = moment(date);
    if (!messageDate.isValid()) {
      messageDate = moment(fallbackDateObj.parserFn(fallbackDateObj.date));
    }
    const nowDate = moment(new Date());
    const isMessageFromToday = messageDate.format("YYYYMMDD") === nowDate.format("YYYYMMDD");
    let formattedDate;
    if (isMessageFromToday) {
      formattedDate = messageDate.format("h:mm A");
    }
    else {
      if (messageDate.year() !== nowDate.year()) {
        formattedDate = messageDate.format("YYYY/MM/DD");
      }
      else {
        formattedDate = messageDate.format("MMM D");
      }
    }
    return formattedDate;
  }

  messageSelected() {
    // Temporary State Selection for Inbox Rows
    if (this.state.selected === "") {
      this.setState({ selected: " selected" })
    } else {
      this.setState({ selected: "" })
    }
    // this.getMessage()
  }

  render() {
    const receivedHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "X-RECEIVED");
    const date = receivedHeader ? receivedHeader.value.split(";")[1].trim() : "";
    let formattedDate = this.getFormattedDate(date, {date: this.props.data.internalDate, parserFn: parseInt});
    const unread = this.props.data.labelIds.indexOf("UNREAD") > -1 ? " font-weight-bold" : "";
    // let selected = this.props.data.selected ? " selected" : "";
    const subjectHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "SUBJECT");
    const subject = subjectHeader ? subjectHeader.value : "";
    const fromHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "FROM");
    let fromName = fromHeader ? this.getFromName(fromHeader.value) : "undefined";

    return (
      <div className={`inbox-container ${this.state.selected}`} onClick={this.messageSelected}>
        <div className="inbox-image">
          <BsPersonFill className="profile-icon" />
        </div>
        <div className="inbox-content">
            <h4 className="inbox-h4">{fromName}</h4>
            <h5 className="inbox-h5">{subject}</h5>

            <AttachmentDateFields
            formattedDate={formattedDate}
            hasAttachment={
              this.props.data.payload.mimeType === "multipart/mixed"
            }
            selected={this.state.selected}
            />
        </div>
        <div className={`inbox-options ${this.state.selected}`}>
            <HiOutlineDotsHorizontal className="inbox-icon" />
        </div>
      </div>
    );
  }
}

export default withRouter(MessageItem);
