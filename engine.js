import {
  DEPENDENCY_TYPES,
  SDK_TYPES,
} from "./types.js";
import { RULES } from "./rules.js";

export class RuleDependencyNode {
  static bindNodeDependencyEvaluator(
    evaluatorType,
    nodeParent,
    evaluatorDirectory
  ) {
   
    if (nodeParent != null) {
      switch (evaluatorType) {
        
        case DEPENDENCY_TYPES.issue:
          if (nodeParent.name === DEPENDENCY_TYPES.org)
            return evaluatorDirectory[DEPENDENCY_TYPES.org_issue];
          else if (nodeParent.name === DEPENDENCY_TYPES.project)
            return evaluatorDirectory[DEPENDENCY_TYPES.project_issue];
          else if (nodeParent.name === DEPENDENCY_TYPES.sdk)
            return evaluatorDirectory[DEPENDENCY_TYPES.sdk_issue];
          break;
        default:
          return evaluatorDirectory[evaluatorType];
      }
    }
  }
  constructor(nodeDetails) {
    this.deps = nodeDetails.deps || null; 
    this.body = nodeDetails.body || null;
    this.priority = nodeDetails.priority || null;
    this.name = nodeDetails.name || "root"; 
    this.parent = nodeDetails.parent || null;
    this.depEvaluator = nodeDetails.depEvaluator;
    this.children = [];
  }
  
  _peekDeps() {
    return Array.isArray(this.deps) ? this.deps : Object.keys(this.deps);
  }
 
  createChildDependencyNode(nodeEvaluatorDirectory) {

    let currentNode = this;

    if (Array.isArray(currentNode.deps)) {
      //identifies terminal leaf
      return;
    } else {
      let rawChildDependencyTypes = Object.keys(currentNode.deps);

      for (const childType of rawChildDependencyTypes) {
        let childNodeDetails = {
          "deps":currentNode.deps[childType], 
          "name":childType,
          "parent":currentNode,
          "depEvaluator":RuleDependencyNode.bindNodeDependencyEvaluator(
            childType,
            currentNode,
            nodeEvaluatorDirectory
          )
        }
       
        const childNode = new RuleDependencyNode(
         childNodeDetails,nodeEvaluatorDirectory
        );
        currentNode.children.push(childNode);
      }
      for (let childNode of currentNode.children) {
        childNode.createChildDependencyNode(nodeEvaluatorDirectory);
      }
      return currentNode;
    }
  }

  /**
   * 
   * @param {accoundData} accountData APIs used to access account data 
   * @return {Boolean} Boolean
   */
  evaluate(accountData) {
    /* 
    Each (dependency) node in a (rule) tree delegates its evaluation (true or false) to a bound dependency evaluator. Evaluators determine the outcome of a node using a collection of detectors. Detectors are used by evaluators to ask questions about an account.

    */

    let resultSelf = this.depEvaluator.evaluate(accountData, this.deps, {
      node: this,
    });
    if (resultSelf !== true) {
      //exit early before child eval
      return resultSelf;
    }

    for (let c of this.children) {
        //siblings are evaluated in the order they are authored.
      resultSelf = resultSelf & c.evaluate(accountData);

      if (!resultSelf) break;
    }
    return resultSelf;
  }
}
export class Engine {
  /**
   * @param {Object} An Options object with the following properties
   * @param {array} ruleSet [] Rule
   * @param {array} evaluatorCollection [] Extension
   * @param {bool} debug Flag for debug output
   */

  constructor(engineOptions) {
    this.evaluatorDirectory = this._createEvaluatorDirectory(engineOptions.evaluatorCollection);
    this.ruleSet = this._preprocessRules(engineOptions.ruleSet);
    this.debug = engineOptions.debug;
    this.outbound = {}
  }

  _wrapWithEvaluatorInterface(project, org) {

    return { PROJECT_API: this._dataApiErrorWrapper(project), ORG_API: this._dataApiErrorWrapper(org)};
  }

  _dataApiErrorWrapper(target){
    const handler = {
      get(target,prop,receiver){
        
        if(target[prop] === undefined){

          //Log error if dataApi undefined for future additions
          /*
            Temporary: For now the two cases are sdk platform evaluators and all others. In most, if not all other cases, true is an indication of a positive signal (doesn't have issue).
          */
          console.error(`Unable to access property [${prop}] for data API. Check that detector is defined correctly.`)
          switch(prop){
            case "getSdks":
              return () => []
            case "hasDropped":
              return () => false
            case "hasBaseTransactions":
              return () => false
            default:
              return () => true
          }
          
        }
        else{
          return Reflect.get(...arguments);
        }
      }
    }
    return new Proxy(target,handler)

    }
    


  _createEvaluatorDirectory(configuredEvaluators) {
    let dir = {};

    for (const evaluator of configuredEvaluators) {
     
      dir[evaluator.dependency] = new evaluator();
    }

    return dir;
  }

  _preprocessRules(rawRuleCollection) {
    //do we need to preprocess for syntax errors or dupes?
    
    let processedRules = [];
    for (let rawRule of rawRuleCollection) {
      
      let nodeArgGroup = {
        "deps":rawRule.deps,
        "body":rawRule.body,
        "priority":rawRule.priority,
        "name":"root",
        "depEvaluator":new RootEvaluator()
      }
      let ruleTreeRoot = new RuleDependencyNode(nodeArgGroup);
      ruleTreeRoot.createChildDependencyNode(this.evaluatorDirectory);
      processedRules.push(ruleTreeRoot);
    }

    return processedRules;
  }
  _applyOutboundFormat(projectApi,matchedRuleNode){

    return {
      getProjectName:() => projectApi.name,
      body:matchedRuleNode.body,
      deps:matchedRuleNode.deps,
      priority:matchedRuleNode.priority
    }

  }
  _dispatchRuleToOutboundQueue(projectApi,matchedRuleNode){
    let formattedRule = this._applyOutboundFormat(projectApi,matchedRuleNode);
    const existingEntry = this.outbound[formattedRule.getProjectName()]
    if(existingEntry){
      existingEntry.push(formattedRule)
    }else{
      this.outbound[formattedRule.getProjectName()] = [];
      this.outbound[formattedRule.getProjectName()].push(formattedRule);
    }


  }
  _evaluateRuleAgainstProjects(ruleRootNode,accountData){
    const projectApis = accountData.org.projects;
    const orgApi = accountData.org;
    for (const projectApi of projectApis) {
      const evalDataProvider = this._wrapWithEvaluatorInterface(projectApi, orgApi);
      const isMatchforProject = ruleRootNode.evaluate(evalDataProvider);
      if(isMatchforProject) this._dispatchRuleToOutboundQueue(projectApi,ruleRootNode);


  }}
  generateOutboundForAccount(accountData){

    for (const rootNode of this.ruleSet) {
      this._evaluateRuleAgainstProjects(rootNode,accountData)
    }
    
    return this.outbound;
}}

export class OrgEvaluator {
  static dependency = DEPENDENCY_TYPES.org;
  constructor() {}
  evaluate(accountData, depsArray, context = {}) {
    return true;
  }
}

// export class SdkPlatformEvaluator {
//   static dependency = DEPENDENCY_TYPES.sdk_platform;
//   constructor() {}

//   evaluate(accountData, ruleDepsArray, context = {}) {
//     /**
//         * //TODO:port over logic from parent SDK extensino
//         //make sure rules reflect the new hierarchy
//         //Add platform extension to exported extensions
//         //test
//         * @return {boolean} Returns true or false if dependency present
//         */

//     let result = false;
//     //random change
//     let expandedSet = new Set(); //duplicates, user error?

//     let accountSdks = accountData.PROJECT_API.projectPlatforms;
//     function helper(accountSdks, value) {
//       return accountSdks.includes(value);
//     }
//     if (ruleDepsArray.includes(SDK_TYPES.mobile)) {
//       SDK_GROUP.mobile.forEach((v) => {
//         if (helper(accountSdks, v)) expandedSet.add(v);
//       });
//     }
//     if (ruleDepsArray.includes(SDK_TYPES.backend)) {
//       SDK_GROUP.backend.forEach((v) => {
//         if (helper(accountSdks, v)) expandedSet.add(v);
//       });
//     }

//     ruleDepsArray.forEach((v) => {
//       //thought about sdk.group as a new dependency type to avoid this unnecessary step removing pollution
//       if (
//         SDK_TYPES.mobile !== v &&
//         SDK_TYPES.backend !== v &&
//         SDK_TYPES.frontend !== v
//       )
//         expandedSet.add(v);
//     });

//     const a = Array.from(expandedSet);
//     if (a.length !== 0 && isSubset(accountSdks, a)) {
//       result = true;
//     }

//     return result;
//   }
// }
class BasePlatformEvaluator {
  static dependency = DEPENDENCY_TYPES.sdk_platform
  evaluate(accountData, platformDetectors, context = {}) {
    const doNotFlagAccount = false
    const flag = true
    
    let platformDetected = platformDetectors
      .map((d) => d(accountData))
      .every(Boolean);

    return platformDetected ? flag : doNotFlagAccount;
  }  
}
class BaseIssueEvaluator{
  evaluate(accountData, issueDetectors, context = {}) {
    const doNotFlagAccount = false
    const flag = true
    
    let noIssuesDetected = issueDetectors
      .map((d) => d(accountData))
      .every(Boolean);

    return noIssuesDetected ? doNotFlagAccount : flag;
  } 
}
export class ProjectIssueEvaluator extends BaseIssueEvaluator {
  static dependency = DEPENDENCY_TYPES.project_issue;

}

export class SdkIssueEvaluator extends BaseIssueEvaluator {
  static dependency = DEPENDENCY_TYPES.sdk_issue;
 
}

export class OrgIssueEvaluator extends BaseIssueEvaluator {
  static dependency = DEPENDENCY_TYPES.org_issue;
}

export class ProjectEvaluator {
  static dependency = DEPENDENCY_TYPES.project;
  constructor() {}
  evaluate(accountData, depsArray, context = {}) {
    return true;
  }
}

export class RootEvaluator {
  static dependency = DEPENDENCY_TYPES.root;
  evaluate(accountData, depsArray, context = {}) {
    return true;
  }
}



const SDK_GROUP = {
  mobile: ["android", "ios", "react-native"],
  backend: ["python", "java", "golang", ".NET"],
  frontend: ["javascript", "javascript.react", "javascript.vue"],
};

export class SdkEvaluator {
  /**
   * @return {boolean} Returns true or false if dependency present
   */
  static dependency = DEPENDENCY_TYPES.sdk;
  constructor() {}

  evaluate(accountData, ruleDepsArray, context) {
    /**
     *
     * @return {boolean} Returns true or false if dependency present
     */

    return true;
  }
}

function isSubset(dep1, dep2) {
  //checks if dep2 is a subset of dep1
  return dep2.every((value) => dep1.includes(value));
}

export const mockAccount = {
  org: {
    hasIntegrationVCS: () => false,
    hasIntegrationsSSO: () => false,
    hasIntegrationsAlerting: () => false,
    projects: [
      {
        name: "test_name_A",
        usesAllErrorTypes: () => false,
        hasReleases: () => true,
        usesAllErrorTypes: () => false,
        hasFileIo: () => false,
        usesAllErrorTypes: () => false,
        usesAllErrorTypes: () => false,
        getSdks: () => "android",
        isMobile: () => true,
        hasOwnership: () => false,
        hasEnv: () => false,
        projectMetricAlerts: () => false,
        projectAlerts: () => false,
        hasIntegrationVCS: () => false,
        hasIntegrationsAlerting: () => false,
        hasSourcemaps: () => false,
        hasDsyms: () => false,
        hasProguard: () => false,
        hasVersioning: () => false,
        hasSessions: () => false,
        hasBaseTransactions: () => true,
        hasDashboards: () => false,
        hasAssignment: () => false,
        hasDropped: () => true,
        hasIntegrationVCS: () => true,
      },
      {
        name: "test_name_B",
        hasReleases: () => true,
        isMobile: () => true,
        usesAllErrorTypes: () => true,
        usesAllErrorTypes: () => true,
        hasFileIo: () => true,
        usesAllErrorTypes: () => true,
        usesAllErrorTypes: () => true,
        getSdks: () => "javascript",
        hasOwnership: () => false,
        hasEnv: () => false,
        projectMetricAlerts: () => false,
        projectAlerts: () => false,
        hasIntegrationVCS: () => false,
        hasIntegrationsAlerting: () => false,
        hasSourcemaps: () => false,
        hasDsyms: () => false,
        hasProguard: () => false,
        hasVersioning: () => false,
        hasSessions: () => false,
        hasBaseTransactions: () => true,
        hasDashboards: () => false,
        hasAssignment: () => false,
        hasDropped: () => true,
      },
    ],
  },
};

export const evaluatorCollection = [
  RootEvaluator,
  SdkEvaluator,
  BasePlatformEvaluator,
  SdkIssueEvaluator,
  OrgEvaluator,
  ProjectEvaluator,
  OrgIssueEvaluator,
  ProjectIssueEvaluator,
];
export const EngineOptions = {
  debug: false,
  ruleSet: RULES,
  evaluatorCollection,
};

export const RULE_ENGINE = new Engine(EngineOptions);
