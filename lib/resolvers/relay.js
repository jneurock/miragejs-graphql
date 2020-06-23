import { RelayConnection, getRelayArgs, filterEdges } from "../relay";
import { getRecords } from "../orm";
import { unwrapType } from "../utils";

export function resolveRelayConnection(obj, args, info) {
  const options = { args, type: info.returnType };
  const records = obj && obj[info.fieldName] && obj[info.fieldName].models;

  if (records) {
    options.records = records;
  }

  return new RelayConnection(options);
}

export function resolveRelayEdges(connection, mirageSchema, type) {
  const { relayArgs, nonRelayArgs } = getRelayArgs(connection.args);
  const { type: nodeType } = unwrapType(type.getFields().node.type);
  const records =
    connection.records || getRecords(nodeType, nonRelayArgs, mirageSchema);
  const filteredRecords = filterEdges(records, relayArgs);

  connection.setRecords(filteredRecords).setEdges().setPageInfo();

  return connection.edges;
}
