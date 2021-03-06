import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
// import MesssageCheckbox from "./MessageCheckbox";

import NameSubjectFields from "./NameSubjectFields";
import AttachmentDateFields from "./AttachmentDateFields";
import {getNameEmail} from '../../../utils';

import { HiOutlineDotsHorizontal } from "react-icons/hi";

export class MessageItem extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.getMessage = this.getMessage.bind(this);
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

  render() {
    const receivedHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "X-RECEIVED");
    const date = receivedHeader ? receivedHeader.value.split(";")[1].trim() : "";
    let formattedDate = this.getFormattedDate(date, {date: this.props.data.internalDate, parserFn: parseInt});
    const unread = this.props.data.labelIds.indexOf("UNREAD") > -1 ? " font-weight-bold" : "";
    let selected = this.props.data.selected ? " selected" : "";
    const subjectHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "SUBJECT");
    const subject = subjectHeader ? subjectHeader.value : "";
    const fromHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "FROM");
    let fromName = fromHeader ? this.getFromName(fromHeader.value) : "undefined";

    return (
      <>
      <div className={selected ? 'inbox-container selected' : 'inbox-container'} onClick={selected = !selected}>
        <div className="inbox-image">
            
        </div>
        <div className="inbox-content">
            <h4 className="inbox-h4">Emilia Cortez</h4>
            <h5 className="inbox-h5">This is the subject of my message...</h5>
            <p className={selected ? 'inbox-p selected' : 'inbox-p'}>Just now</p>
        </div>
        <div className={selected ? 'inbox-options selected' : 'inbox-options'}>
            <HiOutlineDotsHorizontal className="inbox-icon" />
        </div>
      </div>


      <div className={`d-flex table-row-wrapper${selected}`}>
        {/* <MesssageCheckbox
          selected={this.props.data.selected}
          onChange={this.onSelectionChange}
        /> */}
        <div className="inbox-image">
                
        </div>
        <div
          onClick={this.getMessage}
          className={`table-row px-2 py-3${unread}`}
        >
          <NameSubjectFields fromName={fromName} subject={subject} />
          <AttachmentDateFields
            formattedDate={formattedDate}
            hasAttachment={
              this.props.data.payload.mimeType === "multipart/mixed"
            }
          />
        </div>
      </div>
      </>
    );
  }
}

export default withRouter(MessageItem);
