import React, { Component } from "react";
import threeEntryPoint from "./Threejs/threeEntryPoint";

export default class Tester extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  render() {
    return <div ref={element => (this.threeRootElement = element)} />;
  }
}
