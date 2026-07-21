class Octagon {
  text = "";
  children = [];
  constructor(givenText, givenIsParent, childrenGiven) {
    text = givenText;
    isParent = givenIsParent;
    children = childrenGiven;
  }

  addChildren(childrenToAdd) {
    for (let i = 0; i < childrenToAdd.length; i++) {
      this.children.push(childrenToAdd[i]);
    }
  }
  isParent() {
    return this.children !== undefined && this.children.length != 0;
  }
}

const data = require("./data.json");
// console.log(data);


//todo Draw force-directed tree with d3.js, delegate to function
const root = d3.hierarchy(data);


