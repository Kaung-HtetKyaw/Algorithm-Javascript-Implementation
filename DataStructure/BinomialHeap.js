// union,merge,link,push,pop,getMin,removeFromRoot
// @param {string} key: name of the key which will be used by
// @param {string} id : property name of BinomialNode's value which will be used as an unique identifier
// @param {function} customCompare :  An optional custom node comparison* function.
class BinomialHeap {
  constructor(key, id, customCompare) {
    this.head = undefined;
    this.compareBy = key;
    this.idName = id;
    this.nodeCount = 0;
    if (customCompare) this.compare = customCompare;
  }

  isEmpty() {
    return !this.head;
  }

  size() {
    return this.nodeCount;
  }

  // @param {object} value : value of the BinomialNode in the form of {id:121212,.....}
  push(value) {
    // create new node
    let newNode = new BinomialNode(
      value,
      this.compareBy,
      this.idName,
      this.compareBy
    );
    // create new heap
    let newHeap = new BinomialHeap();
    // set new node as new heap's head
    newHeap.head = newNode;
    newHeap.nodeCount++;
    // union(new heap)
    this.union(newHeap);
    // return new node
    return newNode;
  }

  pop() {
    // if heap is empty, return undefined
    if (!this.head) return undefined;
    // find min and it's prev
    let prev; // min's previous node
    let cur = this.head;
    let min = cur;
    let next = cur.sibling;
    while (next) {
      if (this.compare(next, min) < 0) {
        min = next;
        prev = cur;
      }
      cur = next;
      next = next.sibling;
    }
    // remove min node from the root
    this.removeFromRoot(min, prev);
    // decrease node count
    this.nodeCount--;
    // return min
    return min.value;
  }

  getMin() {
    // if heap is empty, return undefined
    if (!this.head) return undefined;
    // find min
    let next = this.head.sibling;
    let min = this.head;
    while (next) {
      if (this.compare(next, min) < 0) {
        min = next;
      }
      next = next.sibling;
    }
    // return min
    return min.value;
  }

  // @param {BinimialHeap} heap:
  union(heap) {
    // this.nodeCount+=heap.nodeCount
    this.nodeCount += heap.nodeCount;

    // merge two heap
    let newHead = this.merge(this, heap);
    // remove existing heads
    this.head = undefined;
    heap.head = undefined;

    if (!newHead) return undefined;

    let prev;
    let cur = newHead;
    let next = cur.sibling;

    // repeat untill there is no next node
    while (next) {
      // case 1 or case 2 > move pointer if degree of cur!=next or cur==next==next.sibling
      if (
        cur.degree !== next.degree ||
        (next.sibling && cur.degree === next.sibling.degree)
      ) {
        prev = cur;
        cur = next;
      } else if (this.compare(cur, next) <= 0) {
        // case 3 > add next to cur as child and link cur and next.sibling if key of cur < next
        cur.sibling = next.sibling;
        this.link(cur, next);
      } else {
        // case 4 > add cur to add as child if key of next < cur
        if (!prev) {
          // if there is no prev, cur has to be the head but cur is now child of next so next should be the head now
          newHead = next;
        } else {
          // if there is prev, link prev and next
          prev.sibling = next;
        }
        this.link(next, cur);
        // next will be cur because cur is now next's child
        cur = next;
      }
      // set cur.sibling as next
      next = cur.sibling;
    }
    this.head = newHead;
  }

  // @param {any} old_value: old value of a BinomialNode
  // @param {any} new_value: new value of that BinomialNode
  // @param {string|number} id: unique identifier of that node
  decreaseKey(old_key, new_key, id) {
    // find the node whose key will be decreased to new value
    let node = this.findNode(old_key, id);
    if (!node) return undefined;
    // set new key and value
    node.key = new_key;

    let parent = node.parent;
    // bubble up and swap along the way if necessary
    while (parent && node.key < parent.key) {
      // swapping parent and child by swapping their value,id,key
      let tempValue = node.value;
      let tempKey = node.key;
      let tempId = node.id;

      node.id = parent.id;
      node.key = parent.key;
      node.value = parent.value;

      parent.id = tempId;
      parent.key = tempKey;
      parent.value = tempValue;

      node = parent;
      parent = parent.parent;
    }
  }

  // find node by id(node's unique identifier) and key(node's comparable value)
  // @param {string|number} key : key of the node to find
  // @param {string|number} id; unique identifier of the node
  // @param {BinomialNode} headNode: optional head node of the heap
  findNode(key, id, headNode = this.head) {
    // get the heap.head if not provided
    let heapNode = headNode;

    let node;
    while (heapNode) {
      // if keys and ids are equal, found
      if (heapNode.key === key && heapNode.id === id) {
        node = heapNode;
        break;
      }
      // if key is less than , continue to next sibling and dont search the children because children will be alwasy bigger
      if (heapNode.key > key) {
        node = heapNode.sibling;
        continue;
      } else {
        // if key is greater, search the children

        // continue to next sibling, if there is no child
        if (!heapNode.child) {
          heapNode = heapNode.sibling;
          continue;
        } else {
          // if there is child, search recursively
          node = this.findNode(key, id, heapNode.child);
          if (node) break;
          heapNode = heapNode.sibling;
        }
      }
    }
    return node;
  }

  // @param {BinomialHeap} a,b : Heaps to be merged together
  merge(a, b) {
    // if one heap is empty, return other
    if (!a.head) return b.head;
    if (!b.head) return a.head;

    let nextA = a.head;
    let nextB = b.head;
    let newHead;
    // set the head of heap that has the smaller degree than the other as newHead
    if (a.head.degree <= b.head.degree) {
      newHead = a.head;
      nextA = nextA.sibling;
    } else {
      newHead = b.head;
      nextB = nextB.sibling;
    }

    let tail = newHead;
    // if there is next node in both heaps
    while (nextA && nextB) {
      // add to the next node of heap that has smaller degree than the other to the tail of new Heap
      if (nextA.degree <= nextB.degree) {
        tail.sibling = nextA;
        nextA = nextA.sibling;
      } else {
        tail.sibling = nextB;
        nextB = nextB.sibling;
      }
      // move the tail pointer to the next
      tail = tail.sibling;
    }
    // link the head of the remaing nodes' heap to the tail
    tail.sibling = nextA ? nextA : nextB;
    //return head
    return newHead;
  }

  // @param {BinomialNode} min: node with the smallest key
  // @param {BinomialNode} prev: previous node of the min node
  removeFromRoot(min, prev) {
    // if min is already head, set min.sibling as head
    if (min === this.head) {
      this.head = min.sibling;
    } else {
      // else, link prev and min.sibling
      prev.sibling = min.sibling;
    }

    let newHead;
    let child = min.child;
    while (child) {
      // set min's child as new head and change the order of min's child
      // from 1->2 to 2->1
      let next = child.sibling;
      child.parent = undefined;
      child.sibling = newHead;
      newHead = child;
      child = next;
    }

    // create new heap, set new head as new heap's head
    let newHeap = new BinomialHeap();
    newHeap.head = newHead;
    // union(new heap)
    this.union(newHeap);
  }

  // @param {BinomialNode} parent: a node that will be parent of the other
  // @param {BinomialNode} child: a node whuch will be added to the parent as child
  link(parent, child) {
    // set parent as child's parent
    child.parent = parent;
    // set parent's existing child as new child's sibling
    child.sibling = parent.child;
    // set child as parent's new child
    parent.child = child;
    // increase degree of parent
    parent.degree++;
  }

  // @param {BinomialNode} a,b : nodes to be compared to each other
  compare(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  }
}

// @constructor
// @param value : value of the node
// @param key : key to be compared
// @param id : unique identifier for the node
class BinomialNode {
  constructor(value, key, id) {
    this.id = id ? value[id] : value;
    this.key = key ? value[key] : value;
    this.value = value;
    this.parent = null;
    this.child = null;
    this.sibling = null;
    this.degree = 0;
  }
}
exports.BinomialHeap = BinomialHeap;
