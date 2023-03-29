import { Engine,EngineOptions } from "../engine.js";

let e = new Engine(EngineOptions);
console.log(e.ruleSet);
//assert that each root node has an extension
//assert that each node has a body
//assert that 

//so now we have a set of processed rules represented as nodes in a tree with their own extensions & metadata

//now they need to be applied to accountData
// let final = [];
// for (let pr of processed){
//     if(pr.evaluate() 
// }
