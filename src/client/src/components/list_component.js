import React from "react";
import ReactDOM from "react-dom";

export default function ListElement(props) {
  return (
    <div className="ListElement">
      {props.name}, {props.competitors} competitors, Date: {props.date}
    </div>
  );
}
