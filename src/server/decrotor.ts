/**
 * Created by waqar on 1/6/16.
 */
/*
 function mylog(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
 var originalMethod = descriptor.value; // save a reference to the original method

 // NOTE: Do not use arrow syntax here. Use a function expression in
 // order to use the correct value of `this` in this method (see notes below)
 descriptor.value = function(...args: any[]) {
 console.log("The method args are: " + JSON.stringify(args)); // pre
 var result = originalMethod.apply(this, args);               // run and store the result
 console.log("The return value is: " + result);               // post
 return result;                                               // return the result of the original method
 };
 return descriptor;
 }
 */

export function log(target: Function, key: string, value: any) {
  return {
    value: function (...args: any[]) {
      var a = args.map(a => JSON.stringify(a)).join();
      var result = value.value.apply(this, args);
      var r = JSON.stringify(result);
      console.log('logging....');
      // console.log(`Call: ${key}(${a}) => ${r}`);
      return result;
    }
  };
}


//import "reflect-metadata";

//const requiredMetadataKey = Symbol("required");

/*
 function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
 //  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
 //  existingRequiredParameters.push(parameterIndex);
 //  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
 }
 */
/*

 function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
 var method = descriptor.value;
 descriptor.value = function () {
 let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
 if (requiredParameters) {
 for (let parameterIndex of requiredParameters) {
 if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
 throw new Error("Missing required argument.");
 }
 }
 }

 return method.apply(this, arguments);
 }
 }*/
