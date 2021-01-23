import { Component, createElement, ATTRIBUTE } from './jsx';

class Button extends Component {
  constructor() {
    super();
  }
  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }
  appendChild(child) {
    this.template = child;
  }
}
export default Button;
