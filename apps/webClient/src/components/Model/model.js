import React, { Component } from "react";
import threeEntryPoint from "./Model/Threejs/threeEntryPoint";
import "model.css";

export default class Model extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  render() {
    return (
      <div>
        <div
          className="model"
          ref={element => (this.threeRootElement = element)}
        ></div>
      </div>
    );
  }
}
