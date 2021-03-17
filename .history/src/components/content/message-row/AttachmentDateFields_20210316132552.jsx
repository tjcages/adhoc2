import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

export default (props) => {
  return (
    <div className="num pr-4">{props.formattedDate}</div>
  );
};
