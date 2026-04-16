// Allow `import foo from "../path/foo.riv"` to resolve to a numeric module
// id (the same shape react-native uses for image require()).
declare module "*.riv" {
  const value: number;
  export default value;
}
