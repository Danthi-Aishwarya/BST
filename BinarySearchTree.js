class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
class Tree {
  constructor(array) {
    this.root = this.buildTree(this.removeDuplicates(array));
  }
  removeDuplicates(array) {
    let setWithoutDuplicate = new Set(array);
    return Array.from(setWithoutDuplicate).sort((a, b) => a - b);
  }
  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;

    let midpoint = Math.floor((start + end) / 2);
    let root = new Node(array[midpoint]);

    root.left = this.buildTree(array, start, midpoint - 1);
    root.right = this.buildTree(array, midpoint + 1, end);

    return root;
  }
  insert(value, node = this.root) {
    if (node === null) return new Node(value);
    else if (value === node.data) return node;
    else if (node.data > value) {
      node.left = this.insert(value, node.left);
    } else if (node.data < value) {
      node.right = this.insert(value, node.right);
    }
    return node;
  }
  remove(value, node = this.root) {
    if (node === null) return null;
    else if (node.data > value) node.left = this.remove(value, node.left);
    else if (node.data < value) node.right = this.remove(value, node.right);
    else if (node.data === value) {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
      else {
        let successor = node.right;
        while (successor.left !== null) {
          successor = successor.left;
        }
        node.data = successor.data;
        node.right = this.remove(successor.data, node.right);
      }
    }
    return node;
  }
  preOrder(callback, node = this.root) {
    if (node === null) return;
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }
  inOrder(callback, node = this.root) {
    if (node === null) return;
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }
  postOrder(callback, node = this.root) {
    if (node === null) return;
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }
  find(value, node = this.root) {
    if (node === null) return null;
    else if (node.data === value) return node;
    else if (node.data > value) return this.find(value, node.left);
    else if (node.data < value) return this.find(value, node.right);
  }
  levelOrder(callback) {
    if (callback === undefined)
      throw new Error("Callback function is not provided");

    let queue = [];
    queue.push(this.root);

    for (let i = 0; i < queue.length; i++) {
      let node = queue[i];
      if (node === null) return;
      callback(node);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  levelOrderRecursive(callback, queue = [this.root], index = 0) {
    if (callback === undefined)
      throw Error("Callback function is not provided");
    if (index >= queue.length) return;

    callback(queue[index]);

    if (queue[index].left) queue.push(queue[index].left);
    if (queue[index].right) queue.push(queue[index].right);

    this.levelOrderRecursive(callback, queue, index + 1);
  }
  height(node) {
    if (node === null) return -1;

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }
  depth(targetNode) {
    let depth = 0;
    let node = this.root;

    while (true) {
      if (targetNode === node) break;
      else if (node === null) throw Error("Node doesn't exist in tree");
      else if (targetNode.data < node.data) node = node.left;
      else if (targetNode.data > node.data) node = node.right;

      depth += 1;
    }

    return depth;
  }
  isBalanced(node = this.root) {
    if (node === null) return true;

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }
  rebalance() {
    let sortedArray = [];
    this.inOrder((node) => sortedArray.push(node.data));
    this.root = this.buildTree(sortedArray);
  }
}
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
function randomNumbersBelow100() {
  let set = new Set();

  while (set.size <= 11) {
    let num = Math.floor(Math.random() * 100);
    set.add(num);
  }

  return Array.from(set).sort((a, b) => a - b);
}
let tree = new Tree(randomNumbersBelow100());
console.log("Initial Tree:");
prettyPrint(tree.root);
console.log("\nLevel Order Traversal:");
tree.levelOrderRecursive((node) => console.log(node.data));
