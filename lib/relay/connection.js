import { btoa } from "b2a";

/**
 * TODO:
 *   - Document this. Also, how do we document classes with JSDoc?
 *   - Should this be a class or a set of functions that operate on basic data
 *     structures?
 *
 * @param {Object} options
 */
export default class RelayConnection {
  constructor({ args, edges = [], records, type } = {}) {
    if (!type || !type.name) {
      throw new Error("Invalid `type` option passed to constructor");
    }

    this.args = args;
    this.edges = edges;
    this.nodeType = type.name.replace(/Connection$/, "");
    this.pageInfo = this.setPageInfo();
    this.records = records;
  }

  createCursor(id) {
    return btoa(`${this.nodeType}:${id}`);
  }

  setEdges() {
    this.edges = this.records.map((record) => ({
      cursor: this.createCursor(record.id),
      node: record,
    }));

    return this;
  }

  setPageInfo() {
    const pageInfo = {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null,
    };

    if (this.edges && this.edges.length) {
      const [firstEdge] = this.edges;
      const lastEdge = this.edges[this.edges.length - 1];

      pageInfo.startCursor = firstEdge.cursor;
      pageInfo.endCursor = lastEdge.cursor;
      pageInfo.hasPreviousPage = firstEdge.node.id !== this.records[0].id;
      pageInfo.hasNextPage =
        lastEdge.id !== this.records[this.records.length - 1].id;
    }

    this.pageInfo = pageInfo;

    return this;
  }

  setRecords(records) {
    this.records = records;

    return this;
  }
}
