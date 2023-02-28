import { EVENT_TYPES, USER_TYPES, DEPENDENCY_TYPES, SDK_TYPES, ISSUE_TYPES, ORG_ISSUE_TYPES, SDK_ISSUE_TYPES } from './types.js';
import {RULES} from './rules.js';
/**
 * Rule engine that processes Account data
 * 
 * What we know today: Rules, Account data
 * - The engine evaluates all rules against account data in the order they are specified.
 * 
 */


export class Node {
    
    static bindExtension(extName,parent,extDirectory){
        //bind extension based on parent dependency
        //convenience logic for making rule dependency specification easier. 
        
        
        if(parent != null){
            
            // if(!extDirectory[extName]){
            //     console.log(`FAILURE: Attempting to bind extension: ${extName}`)
            // }else{
            //     console.log(`SUCCESS: Attempting to bind extension: ${extName}`) 
            // }
            switch(extName){
               
                case DEPENDENCY_TYPES.issue:
                    if(parent.name === DEPENDENCY_TYPES.org) return extDirectory[DEPENDENCY_TYPES.org_issue];
                    else if(parent.name === DEPENDENCY_TYPES.project) return extDirectory[DEPENDENCY_TYPES.project_issue];
                    else if(parent.name === DEPENDENCY_TYPES.sdk) return extDirectory[DEPENDENCY_TYPES.sdk_issue]
                    break;
                default:
                    return extDirectory[extName]
            }
            
        }
    }
    constructor(deps,body,priority,name,parent,extension){
        this.deps = deps;//deps can be null or children?
        this.body = body;
        this.priority = priority;
        this.name = name;// root or extname
        this.parent = parent;//can be null
        this.extension = extension;
        this.children = [];
    }
    ruleType(){
        //introspect rule type based on deps. Meant for identifying rules by top level dependencies (org vs project).
        const topLevelDeps = this._peekDeps();
        if(topLevelDeps.length === 1 && topLevelDeps[0] === DEPENDENCY_TYPES.org){
            return DEPENDENCY_TYPES.org
        }
        return DEPENDENCY_TYPES.project;
    }
    _peekDeps(){
        return Array.isArray(this.deps) ? this.deps : Object.keys(this.deps);
    }
    create(extDirectory){
        //returns reference to self (ROOT node)
        if(Array.isArray(this.deps)){
            //terminal leaf
            return
        }else{
            let extensions = Object.keys(this.deps);
           
            //take seed, create nodes & bind extensions
            for (const extName of extensions){

                const n = new Node(this.deps[extName],null,null,extName,this,Node.bindExtension(extName,this,extDirectory));
                this.children.push(n);
                
            }
            for (const node of this.children){
                node.create(extDirectory);
            }
            return this;

        }
       
    }
   
    evaluate(accountData){
      
        /* Each node evaluates itself against an associated extension + account data.
        
         Rule object keys are never deleted or added to after creation. Sibling order is deterministic during evaluation.
        */

        // console.log(`evaluating ${this.body}`)
        let resultSelf = this.extension.evaluate(accountData,this.deps,{node:this});
        if(resultSelf !== true){
            //exit early before child eval
             return resultSelf
        }
      
        for (let c of this.children){
            resultSelf = resultSelf & c.evaluate(accountData);
           
            if(!resultSelf) break;//exit early before next sibling eval
        }
        return resultSelf;
    }
}
export class Engine {
    /**
     * @param {Object} An Options object with the following properties
     * @param {array} ruleSet [] Rule 
     * @param {array} extensions [] Extension
     * @param {bool} debug Flag for debug output
     */
    
    constructor(engineOptions){
        this.extensions = this._createExtensionDirectory(engineOptions.extensions);
        //processing rules dependent on extension processing
        this.ruleSet = this._preprocessRules(engineOptions.ruleSet);
        this.debug = engineOptions.debug
    }

    _bindAPIS(project,org){
        return {PROJECT_API:project,ORG_API:org};
    }
    _createExtensionDirectory(rawExtensions){
       
        let dir = {};
        for (const ext of rawExtensions){
            dir[ext.dependency] = new ext();
        }
        
        return dir;
    }

    _preprocessRules(rawRuleSet){
        
        //do we need to preprocess for syntax errors or dupes?
        //TODO:check rules to see if level is specified?
        let processed = [];
        for (let rawRule of rawRuleSet){

            let root = new Node(rawRule.deps,rawRule.body,rawRule.priority,'root',null,new RootExtension());
            root.create(this.extensions);
                processed.push(root);

        }
     
        
        
        return processed
        
    }
   

  
    process(accountData){
        /**
         * @param {Array} projectData An array of Projects
         * @return {Object} An object {projectId:[Rule, ...]}
         */
      
        let output = {'org':{}};
        const projects = accountData.org.projects;
        const org = accountData.org;
       
        function outputHelper(ruleType,aggregator,rule,project){
            if( ruleType === DEPENDENCY_TYPES.project){
                
                if( !aggregator[project.name]) aggregator[project.name] = [];
                aggregator[project.name].push(rule);
               
            }else if(ruleType === DEPENDENCY_TYPES.org){
                //body will uniquely identify an org level rule. This will dedupe.
                if(!output.org[rule.body]){
                    output.org[rule.body] = rule;
                }
            }else{
                throw Error("Rule top level dep type not found.")
            }
            
        }

        for(const r of this.ruleSet){
              
            this.debug && console.debug('level:[project]',r.deps);
            //bind APIS in expected shape for extensions that may need access to both.
            
            const ruleType = r.ruleType();
           
            for (const p of projects){
                
                const result = r.evaluate(this._bindAPIS(p,org));

                if(result){
                
                    outputHelper(ruleType,output,{body:r.body,deps:r.deps,priority:r.priority},p);

                } 
                    
            }
            
        }
        return output
    }
  
}
export class OrgExtension {
    static dependency = DEPENDENCY_TYPES.org;
    constructor(){

    }
    evaluate(accountData,depsArray,context={}){
       
        return true
    }
}

export class SdkPlatformExtension {
    static dependency = DEPENDENCY_TYPES.sdk_platform;
    constructor(){

    }

   evaluate(accountData,ruleDepsArray,context={}){
       /**
        * //TODO:port over logic from parent SDK extensino
        //make sure rules reflect the new hierarchy
        //Add platform extension to exported extensions
        //test
        * @return {boolean} Returns true or false if dependency present
        */

    let result = false; 
    let expandedSet = new Set();//duplicates, user error?

    let accountSdks = accountData.PROJECT_API.getSdks();
    function helper(accountSdks,value){
        return accountSdks.includes(value);
    }
    if(ruleDepsArray.includes(SDK_TYPES.mobile)){
        
        SDK_GROUP.mobile.forEach(v => {
            if(helper(accountSdks,v)) expandedSet.add(v);
        });
    }
    if(ruleDepsArray.includes(SDK_TYPES.backend)){
       SDK_GROUP.backend.forEach(v => {
        if(helper(accountSdks,v)) expandedSet.add(v);
    });
    }
   
    ruleDepsArray.forEach(v => {
        //thought about sdk.group as a new dependency type to avoid this unnecessary step removing pollution 
        if (SDK_TYPES.mobile !== v && SDK_TYPES.backend !== v && SDK_TYPES.frontend !== v) expandedSet.add(v);
        
    });

    const a = Array.from(expandedSet);
    if(a.length !== 0 && isSubset(accountSdks,a)){
        result = true;
    }
   
    return result

    
   }
}
//SO we have a project level issue sdk.integrations.none
/**
 * Where do we evaluate this? 
 */
export class SdkIssueExtension {
    static dependency = DEPENDENCY_TYPES.sdk_issue;
    constructor(){

    }
    
    evaluate(accountData, issueDepsArray, context={}){
        let result = false;
        
        for (let issueType of issueDepsArray){
           
            switch(issueType){
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.http_errors.none"]:
                    if (!accountData.PROJECT_API.hasAndroidHttp()) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.db.none"]:
                    if (!accountData.PROJECT_API.hasAndroidDb()) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.fileio.none"]:
                    if (!accountData.PROJECT_API.hasFileIo()) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.fragments.none"]:
                    if (!accountData.PROJECT_API.hasFragments()) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.okhttp.none"]:
                    if (!accountData.PROJECT_API.hasOkhttp()) result = true;
                    break;
                default:
                    throw Error(`SDK_ISSUE_TYPE not found for ${issueType} in ${issueDepsArray}`)
            }
           
        }
        return result
       
    }
}

//Extension
/**
 * fn evaluate(accountData, ruleDepsArray) bool
 */
export class OrgIssueExtension {
    static dependency = DEPENDENCY_TYPES.org_issue; 
    constructor(){
       
    }
    evaluate(accountData, issueDepsArray,context = {}){
        /**
         * @param {Object} accountData An object representing API for org data
         */
        //do we assume we have just org rules at this point?
        let result = false;

        for (let issueType of issueDepsArray){
           if(issueType === ORG_ISSUE_TYPES['ecosystem.vcs.none']){
            if(!accountData.ORG_API.hasIntegrationVCS()) result = true;
           }
           else if(issueType === ORG_ISSUE_TYPES["ecosystem.alerting.none"]){
               if(!accountData.ORG_API.hasIntegrationsAlerting()) result = true;
           }
           else if(issueType === ORG_ISSUE_TYPES["ecosystem.sso.none"]){
               if(!accountData.ORG_API.hasIntegrationsSSO()) result = true;
           }else {
               throw Error("Issue type not found for ORG_ISSUE extension")
           }
           
        }
        return result
    }
}

export class ProjectExtension {
    static dependency = DEPENDENCY_TYPES.project;
    constructor(){

    }
    evaluate(accountData, depsArray, context={}){
        return true
    }
}

export class RootExtension {
    static dependency = DEPENDENCY_TYPES.root;
    evaluate(accountData, depsArray, context={}){
        return true
    }
}

export class ProjectIssueExtension {
  
    static dependency = DEPENDENCY_TYPES.project_issue;
    
    constructor(){
       
    }
    
   
    evaluate(accountData, depsArray, context={}){
        /**
         * @param {Object} accountData An object representing API for project data
         * @param {Array} depsArray An array of Rule dependencies
         * @param {Object} context A optional context with metadata from the rule tree
         * @return {boolean} Returns true or false if dependency present
         */

    
        let result = false;
        


        for (let issueType of depsArray){
            //TODO:look for commonalities to optimize this evaluation in future
            //if issue type is defined but not present in extension this should throw
            if (issueType === ISSUE_TYPES["dashboard.none"]){

            }
            else if (issueType === ISSUE_TYPES["releases.session_tracking.none"]){
                if(!accountData.PROJECT_API.hasSessions()) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.versioning.none"]){
                if(!accountData.PROJECT_API.hasReleases()) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.artifacts.dsyms.none"]){
                if(!accountData.PROJECT_API.hasDsyms()) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.artifacts.proguard.none"]){
                if(!accountData.PROJECT_API.hasProguard()) result = true; 
            }
            else if (issueType === ISSUE_TYPES["release_health.environment.none"]){
                
                if(!accountData.PROJECT_API.hasEnv()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.ownership.none"]){
               
                if (!accountData.PROJECT_API.hasOwnership()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.metric_alerts.none"]){
               
                if (!accountData.PROJECT_API.hasMetricAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.issue_alerts.none"]){
               
                if (!accountData.PROJECT_API.hasIssueAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.vcs.none"]){
               
                if (!accountData.PROJECT_API.hasIntegrationVCS()) result = true;
            }
            else if(issueType === ISSUE_TYPES["releases.artifacts.sourcemaps.none"]){
               
                if (!accountData.PROJECT_API.hasSourcemaps()) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.utilization.txn.base"]){
               
                if (accountData.PROJECT_API.hasBaseTransactions()) result = true;
            }
            else if(issueType === ISSUE_TYPES["dashboards.none"]){
               
                if (!accountData.PROJECT_API.hasDashboards()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.assignment.none"]){
               
                if (!accountData.PROJECT_API.hasAssignment()) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.dropped.errors.high"]){
               
                if (accountData.PROJECT_API.hasDropped()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.alerting.none"]){
               
                if (accountData.PROJECT_API.hasIntegrationsAlerting()) result = true;
            }
            else throw new Error(`Issue Extension did not find matching issue_type: ${issueType}`);
        }
        return result
    }
}


const SDK_GROUP = {
    mobile:['android','ios','react-native'],
    backend:['python','java','golang','.NET'],
    frontend:['javascript','javascript.react','javascript.vue']
}


export class SdkExtension {
    /**
     * @return {boolean} Returns true or false if dependency present
     */
    static dependency = DEPENDENCY_TYPES.sdk;
    constructor(){
       
    }


   evaluate(accountData,ruleDepsArray,context){
       /**
        * 
        * @return {boolean} Returns true or false if dependency present
        */
   
        return true
   }


}

function isSubset(dep1,dep2){
    //checks if dep2 is a subset of dep1
    return dep2.every(value => dep1.includes(value));
}

export const mockAccount = {
    org:{
        hasIntegrationVCS:() => false,
        hasIntegrationsSSO:() => false,
        hasIntegrationsAlerting:() => false,
        projects:[
            {   
                name:"test_name_A",
                hasOkhttp:() => false,
                hasReleases: () => true,
                hasAndroidDb:() => false,
                hasFileIo:() => false,
                hasAndroidHttp: () => false,
                hasFragments:() => false,
                getSdks:() => ['android','javascript','java'],
                hasOwnership:() => false,
                hasEnv:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                hasIntegrationVCS:() => false,
                hasIntegrationsAlerting:() => false,
                hasSourcemaps:() => false,
                hasDsyms:()=> false,
                hasProguard:() => false,
                hasVersioning:()=> false,
                hasSessions:() => false,
                hasBaseTransactions:() => true,
                hasDashboards:() => false,
                hasAssignment:() => false,
                hasDropped:() => true,
                hasIntegrationVCS:() => true,
            },
            {  
                 
                name:"test_name_B",
                hasReleases: () => true,
                hasOkhttp:() => true,
                hasAndroidDb:() => true,
                hasFileIo:() => true,
                hasAndroidHttp: () => true,
                hasFragments:() => true,
                getSdks:() => ['android','javascript','java'],
                hasOwnership:() => false,
                hasEnv:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                hasIntegrationVCS:() => false,
                hasIntegrationsAlerting:() => false,
                hasSourcemaps:() => false,
                hasDsyms:()=> false,
                hasProguard:() => false,
                hasVersioning:()=> false,
                hasSessions:() => false,
                hasBaseTransactions:() => true,
                hasDashboards:() => false,
                hasAssignment:() => false,
                hasDropped:() => true,
               
            }

        ]
    }
    
}


export const extensions = [RootExtension, SdkExtension,SdkPlatformExtension,SdkIssueExtension, OrgExtension, ProjectExtension, OrgIssueExtension, ProjectIssueExtension];
export const EngineOptions = {
    debug:false,
    ruleSet:RULES,
    extensions:extensions
} 

export const RULE_ENGINE = new Engine(EngineOptions);


