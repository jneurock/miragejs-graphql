export default function getOptionalResolver(info, optionalResolvers) {
  const { fieldName, parentType } = info;

  return (
    optionalResolvers[parentType.name] &&
    optionalResolvers[parentType.name][fieldName]
  );
}
