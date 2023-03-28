
import { SdkExtension } from "./engine.js"
import { DEPENDENCY_TYPES,ISSUE_TYPES, SDK_TYPES, ORG_ISSUE_TYPES, SDK_ISSUE_TYPES } from "./types.js"
// Rule {
//     /**
//      * {string} body The outbound text
//      * {Object} deps The DEPENDENCY_TYPES of the outbound)
//      * {int} priority The integer priority 0 ... 10
//      */
// }


/**
 * Naming for product areas  
 * Workflow . (  alerts | assignment | ownership) . ( none | etc )
 * Releases . (environment | sessions | versioning | artifacts | ...) . (none | )
 * Quota . (filtered | dropped | utilization) . ( error | transaction ) . (high | base | low )
 * Dashboards . ( none )
 * Ecosystem . (vcs | issue_mgmt | alerting | ...) . (none)
 * SDK . (platform) . ( update | integration_type) . (major | minor | none (integration_type))
 */

// Dependencies
/**
 * These are any keys that are specified within deps:{}. They function to identify dependencies of the rule. The currently map to types of Extensions which specify the logic for evaluating dependencies against account data. 
 */

// Issues:

// 1. Naming
//  <product area> . <feature subset> . < optional: data type descriptor> . <issue (some | none | high | low | etc )>
// 2. Adding to types.js, login for evaluation in project or org issue extensions (engine.js), 

/** Can I write a rule that depends on both some org and some project deps?
 * YES
 * // deps:{ project:{sdk:[],issue:[]}, org:{issue:[]}}
 * 
 * Rules are ultimately transformed into a tree that reflects nested dependencies. When a tree is built for a rule, each node binds to an extension. Later, when processing account data, each node evaluates itself against account data & the logic + [types] specified in the extension. The entire rule tree must resolve to <true> in order for a rule to apply --writing rules based on details of an account naturally conjunctive.
 * 
 *              root
 *             /    \
 *          project  org
 *          /   \      \
 * .      sdk   issue  issue
 *       /   \     \     \
 *      /     \  [types]  [types]
 * platform  issue
 *
 * Sibling order is dependent on how rules are authored. The result of the nth sibling will impact whether or not the nth + 1 is evaluated or we exit early.
 * In the tree above, the children of the sdk node are evaluated from left to right. If the sdk_platform extension returns false, no other siblings will be evaluated.

/**
 * Notes on syntax:
 * Currently rules must follow the syntax below. They must have a body, priority and top level project & org deps keys. There is no syntax checking currently so undefined behavior is possible:
 * 
 * Top level fields:
 * // body:<string> 
 * 
 * // deps:{ project:{sdk:[],issue:[]}, org:{issue:[]}}
 *      Currently either project, org, or both top level keys must be supplied. 
 * 
 * // priority:<int>
 * 
 */


/*If you are new rules with new dependencies that might be shared or overlap, it is probably a good candidate for a new extension.

For instance something like sdk.android.integrations.none
This could be nested under sdk as a new sdk_issue extension:
/**
 *       sdk
 *      /   \
 * sdk_type  issue

with each node corresponding to a new extension or existing extension.
*/

export const RULES = [
    {
        body:"Sentry’s android sdk offers detection for http client errors. You are not currently tracking this.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.android],
                    [DEPENDENCY_TYPES.issue]:[SDK_ISSUE_TYPES["sdk.android.instrumentation.http_errors.none"]]
            }}
        },
        priority:2
    },
    {
        body:"You have some options for optimizing your mobile perf data from your andriod project. Our automatic integrations allow you to track latency down to the ui, http or db span. You can validate your instrumentation via <discover>.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.android],
                    [DEPENDENCY_TYPES.issue]:[
                        SDK_ISSUE_TYPES["sdk.android.instrumentation.fragments.none"],
                        SDK_ISSUE_TYPES["sdk.android.instrumentation.db.none"],
                        SDK_ISSUE_TYPES["sdk.android.instrumentation.okhttp.none"]
                    ],
                    
                },
               
                // [DEPENDENCY_TYPES.issue]:[[ISSUE_TYPES["quota.utilization.txn.base"]],[ISSUE_TYPES["sdk.integrations.none"]]]
                
            },
           
        }, priority:4

    },
    {
        body:"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.mobile],
                },
                [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["dashboards.none"]]
                
            }
        },
        priority:4
    },
    {
        body:"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                   [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.mobile]
                },
               
                [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["workflow.issue_alerts.none"]]
            }
        },
        priority:2
    },
   {
       body:"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
       deps:{
           [DEPENDENCY_TYPES.org]:{
               [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["ecosystem.alerting.none"]]
           },
           [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.mobile]
                },
               [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["workflow.metric_alerts.none"]]
           }
       },
       priority:2

   }, 
    {
        body:"You aren’t leveraging Sentry’s release support to the fullest by collecting session data. Track & alert on crash free session rate.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[
                    SDK_TYPES.mobile]
                },
                [DEPENDENCY_TYPES.issue]:[
                    ISSUE_TYPES["releases.session_tracking.none"],
                ],
                
            }
        },
        priority:0
    },
    {
        body:"None of projects leverage real time alerting for issues. Consider adding a baseline for alert visibility to track new high volume issues & regressions.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.issue]:[
                    ISSUE_TYPES["workflow.issue_alerts.none"],ISSUE_TYPES["workflow.metric_alerts.none"]
                ]
            }
        },
        priority:0,
    },
    {
        body:"How do your teams get notified in real time to issues? Integrate your current alerting tools with Sentry, or take advantage of webhooks.",
        deps:{
            [DEPENDENCY_TYPES.org]:[
                DEPENDENCY_TYPES.issue[
                    ORG_ISSUE_TYPES["ecosystem.alerting.none"]
                ]
            ]
        },
        priority:0
    },
   {
       body:"Sentry supports sso for a select group of providers. Streamline your onboarding process using this integration or our generic auth provider.",
       deps:{[DEPENDENCY_TYPES.org]:{
           [DEPENDENCY_TYPES.issue]:[
               ORG_ISSUE_TYPES["ecosystem.sso.none"]
           ]
       }}
       ,priority:0
   }, 
   {
       body:"Upload your souremaps to get unminified JS stack traces in Sentry. Our react-native sdk provides <functionality> to do this ootb utilizing gradle & xcode.",
       deps:{
          [DEPENDENCY_TYPES.project]:{
            [DEPENDENCY_TYPES.sdk]:{
                  [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES["react-native"]]
              },
            [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["releases.artifacts.sourcemaps.none"]]}
       },
       prority:0
   } ,
        {
            body:"Adding debug files will dramatically improve the readibility of your stacktraces, sentry’s grouping algorithm, & issue ownership. Consider using our fastlane plugin or Appstore connect integration.",
            deps:{
                project:{
                    issue:[ISSUE_TYPES["releases.artifacts.dsyms.none"]],
                    sdk:{
                        [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.ios]
                    }
                },
                
            },priority:0
        },
        {
            body:"Adding proguard files will dramatically improve the readibility of your stacktraces, sentry’s grouping algorithm, & issue ownership. Consider utilizing Sentry’s gradle integration to do so.",
            deps:{
                [DEPENDENCY_TYPES.project]:{
                    [DEPENDENCY_TYPES.sdk]:{
                        [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.android],
                    },
                    [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["releases.artifacts.proguard.none"]],
                   
                },
            },
            priority:0
        },
        {
           body:"Help sentry understand your versioning scheme. Adopting the pattern specified <here> enables support for Semantic Versioning in your queries and release filtering.",
           deps:{
               [DEPENDENCY_TYPES.project]:{
                   [DEPENDENCY_TYPES.issue]:[ISSUE_TYPES["releases.versioning.none"]]
                }
                },
           priority:0
          
        },
        {
            body:"VCS allows organizations & their teams to triage more efficiently by adding commit metadata to Senry issues. We recommend configuring this when possible.",
            deps:{org:{"issue":[ORG_ISSUE_TYPES["ecosystem.vcs.none"]]}},
            "priority":0
        },
        {
            body:"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
            deps:{org:{issue:[ORG_ISSUE_TYPES["ecosystem.vcs.none"]]},project:{issue:[ISSUE_TYPES["workflow.ownership.none"]]}},
            priority:0
        },
        {
            "body":"Specifying environments in SDK initialization can help you better understand & filter issues during your phased rollout.",
            "deps":{
                project:{
                    "sdk":{
                    [DEPENDENCY_TYPES.sdk_platform]:["mobile"],
                },
                "issue":[ISSUE_TYPES["release_health.environment.none"]]}},
            "priority":0
        },
        {
            "body":"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
            "deps":{
                project:{
                    "sdk":{
                        [DEPENDENCY_TYPES.sdk_platform]:["mobile"],
                    },
                    "issue":[ISSUE_TYPES["workflow.metric_alerts.none"],ISSUE_TYPES["ecosystem.alerting.none"]]}},
            "priority":10
        }
        ,
        {
            "body":"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release.",
            "deps":{
                project:{
                    "sdk":{
                        [DEPENDENCY_TYPES.sdk_platform]:["mobile"]
                    },
                    "issue":[ISSUE_TYPES["workflow.issue_alerts.none"]]}},
            "priority":10
        },
        {
            "body":"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
            "deps":{
                project:{
                    "sdk":{
                       [DEPENDENCY_TYPES.sdk_platform]:["mobile"]
                    },
                    "issue":[ISSUE_TYPES["workflow.ownership.none"],ISSUE_TYPES["ecosystem.vcs.none"]]}},
            "priority":10
        },
        {
            "body":"There are benefits to uploading sourcemaps directly to Sentry via our API. You can improve the consistency & reliability of human readable stacktraces in your project. Exposing sensitive URLs is generally not ideal.",
            "deps":{
                project:{
                    "sdk":{
                        [DEPENDENCY_TYPES.sdk_platform]:['javascript']
                },
                    "issue":[ISSUE_TYPES["releases.artifacts.sourcemaps.none"]]}},
            "priority":10
        },
        {
            "body":"Our tracing product allows you to identify bottlenecks & correlate errors directly in the Senty UI. You have some projects that might be good candidates for this.",
            "deps":{
                project:{
                    "sdk":{
                        [DEPENDENCY_TYPES.sdk_platform]:['frontend','backend']
                },
                    "issue":[ISSUE_TYPES["quota.utilization.txn.base"]]}},
            "priority":10
        },
        {
            "body":"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
            "deps":{project:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[SDK_TYPES.mobile]
                },
                "issue":[ISSUE_TYPES["dashboards.none"]]}},
            "priority":10
        },
        {
            "body":"Issues are best owned within Sentry. Assigning issues routes notifications and issues directly to those most apt to fix them. You can even have Sentry do this automatically for you.",
            "deps":{project:{"issue":[ISSUE_TYPES["workflow.assignment.none"]]}},
            "priority":10
        },
        {
            "body":"Dropping events can impact your visibility of issues. Consider using Discover to triage your noisiest issues or identify other good candidates for filtering.",
            "deps":{project:{"issue":[ISSUE_TYPES["quota.dropped.errors.high"]]}},
            "priority":0
        },
        
    ]



// import { EVENT_TYPES, USER_TYPES, SDK_TYPES, ISSUE_TYPES, ORG_ISSUE_TYPES, SDK_ISSUE_TYPES } from './types.js';
// import {RULES} from './rules.js';
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

    let accountSdks = accountData.PROJECT_API.projectPlatforms;
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
                    if (!accountData.PROJECT_API.environments) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.db.none"]:
                    if (!accountData.PROJECT_API.environments) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.fileio.none"]:
                    if (!accountData.PROJECT_API.environments) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.fragments.none"]:
                    if (!accountData.PROJECT_API.environments) result = true;
                    break;
                case SDK_ISSUE_TYPES["sdk.android.instrumentation.okhttp.none"]:
                    if (!accountData.PROJECT_API.environments) result = true;
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
            if(!accountData.ORG_API.usesScm) result = true;
            }
            else if(issueType === ORG_ISSUE_TYPES["ecosystem.alerting.none"]){
                if(!accountData.ORG_API.messageIntegration) result = true;
            }
            else if(issueType === ORG_ISSUE_TYPES["ecosystem.sso.none"]){
                if(!accountData.ORG_API.usesSso) result = true;
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
                if(!accountData.PROJECT_API.projectSessions) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.versioning.none"]){
                if(!accountData.PROJECT_API.projectReleases) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.artifacts.dsyms.none"]){
                if(!accountData.PROJECT_API.projectStackTraces) result = true; 
            }
            else if (issueType === ISSUE_TYPES["releases.artifacts.proguard.none"]){
                if(!accountData.PROJECT_API.projectStackTraces) result = true; 
            }
            else if (issueType === ISSUE_TYPES["release_health.environment.none"]){
                
                if(!accountData.PROJECT_API.projectEnvironments) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.ownership.none"]){
                
                if (!accountData.PROJECT_API.projectOwnership) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.metric_alerts.none"]){
                
                if (!accountData.PROJECT_API.projectMetricAlerts) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.issue_alerts.none"]){
                
                if (!accountData.PROJECT_API.hasIssueAlert) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.vcs.none"]){
                
                if (!accountData.PROJECT_API.usesScm) result = true;
            }
            else if(issueType === ISSUE_TYPES["releases.artifacts.sourcemaps.none"]){
                
                if (!accountData.PROJECT_API.projectStackTraces) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.utilization.txn.base"]){
                
                if (accountData.PROJECT_API.performance) result = true;
            }
            else if(issueType === ISSUE_TYPES["dashboards.none"]){
                
                if (!accountData.PROJECT_API.environments) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.assignment.none"]){
                
                if (!accountData.PROJECT_API.projectAssignment) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.dropped.errors.high"]){
                
                if (accountData.PROJECT_API.environments) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.alerting.none"]){
                
                if (accountData.PROJECT_API.messageIntegration) result = true;
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


// export class SdkExtension {
//     /**
//      * @return {boolean} Returns true or false if dependency present
//      */
//     static dependency = DEPENDENCY_TYPES.sdk;
//     constructor(){
        
//     }


//     evaluate(accountData,ruleDepsArray,context){
//         /**
//         * 
//         * @return {boolean} Returns true or false if dependency present
//         */
    
//         return true
//     }


// }

function isSubset(dep1,dep2){
    //checks if dep2 is a subset of dep1
    return dep2.every(value => dep1.includes(value));
}

export const mockAccount = {
    org:{
        usesScm:() => false,
        usesSso:() => false,
        messageIntegration:() => false,
        projects:[
            {   
                name:"test_name_A",
                hasOkhttp:() => false,
                projectReleases: () => true,
                hasAndroidDb:() => false,
                hasFileIo:() => false,
                hasAndroidHttp: () => false,
                hasFragments:() => false,
                getSdks:() => ['android','javascript','java'],
                projectOwnership:() => false,
                projectEnvironments:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                usesScm:() => false,
                messageIntegration:() => false,
                hasSourcemaps:() => false,
                hasDsyms:()=> false,
                hasProguard:() => false,
                hasVersioning:()=> false,
                hasSessions:() => false,
                hasBaseTransactions:() => true,
                hasDashboards:() => false,
                hasAssignment:() => false,
                hasDropped:() => true,
                usesScm:() => true,
            },
            {  
                  
                name:"test_name_B",
                projectReleases: () => true,
                hasOkhttp:() => true,
                hasAndroidDb:() => true,
                hasFileIo:() => true,
                hasAndroidHttp: () => true,
                hasFragments:() => true,
                getSdks:() => ['android','javascript','java'],
                projectOwnership:() => false,
                projectEnvironments:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                usesScm:() => false,
                messageIntegration:() => false,
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

const extensions = [RootExtension, SdkExtension,SdkPlatformExtension,SdkIssueExtension, OrgExtension, ProjectExtension, OrgIssueExtension, ProjectIssueExtension];
const EngineOptions = {
    debug:false,
    ruleSet:RULES,
    extensions:extensions
} 

const RULE_ENGINE = new Engine(EngineOptions);



const api = "https://sentry.io/api/0/organizations/"
let url;
// const {RULE_ENGINE} = import('./engine.js');
// import { Engine,EngineOptions } from "./engine.js";


function currentOrg(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    url = activeTab.url; 
    const org = url.split('.sentry.io')[0] 
    start(org.substring(8));
  });

}


  // .NET / Flutter additions
const mobileSdks = ['sentry.java.android','sentry.cocoa','sentry.javascript.react-native','android','ios']
const ingestionCategoryDict = ['sessions','profile','transaction_indexed','attachment','replay','error','transaction']

let orgSubscriptionApi = `https://sentry.io/api/0/subscriptions/{org}/`
let orgSubscriptionHistoryApi = 'https://{org}.sentry.io/api/0/customers/{org}/history/'
let orgStatsApi = 'https://sentry.io/api/0/organizations/{org}/stats_v2/?field=sum%28quantity%29&groupBy=category&groupBy=outcome&interval=1h&project=-1&statsPeriod=14d'
let projectStatsApi = 'https://sentry.io/api/0/organizations/{org}/stats_v2/?field=sum%28quantity%29&groupBy=outcome&groupBy=project&groupBy=category&interval=1h&project=-1&statsPeriod=14d'
let projectsApi = 'https://sentry.io/api/0/organizations/{org}/projects/'
let projectSdkApi = 'https://sentry.io/api/0/organizations/{org}/events/?field=project&field=sdk.name&field=sdk.version&field=count%28%29&per_page=100&project=-1&sort=-count&statsPeriod=14d'
let teamDict = {};
let projects = [];
let projectObjects = [];
let orgObject;
let aggregateProjects = {};
let orgStats = [];
let projectSdkStats = [];
let projectStats = [];
let mobileUseCase = false;
let topProjects = [];
let mobileProjects = [];
let orgWideStats = [];
let frontendUseCase = false;
let backendUseCase = false;
let nativeUseCase = false;
let allProjectAudits = [];

// Indexes - 0:Blank 1:Org Stats, 2:Blank, 3:Org Stats Headers, 4:Org Stats populated, 5:Blank, 6:Blank 7:Project Stats Headers

// Org Stats to be populated (outputRows[1][index]) Index:
// 0:Org Name, 1:SCIM, 2:SSO, Integrations 3:Messaging 4:SCM 5:Issue Tracking, 6:Projects created recently, 7:Members added, 8:Teams used recently,
// 9:Project Settings edited
class Organization {
  constructor(name,scimUsage=false,ssoUsage=false,messagingIntegration=false,scmIntegration=false,issueIntegration=false,
    projectCreated=false,memberInvited=false,teamUsed=false,projSettings=false)
    {
      this._name = name;
      this.scimUsage = scimUsage;
      this.ssoUsage = ssoUsage;
      this.messagingIntegration = messagingIntegration;
      this.scmIntegration = scmIntegration;
      this.issueIntegration = issueIntegration;
      this.projectCreated = projectCreated;
      this.memberInvited = memberInvited;
      this.teamUsed = teamUsed;
      this.projSettings = projSettings;
    }

  get usesScim(){
    return this._scimUsage;
  }
  set usesScim(scim){
    this._scimUsage = scim;
  }

  get usesSso(){
    return this._ssoUsage;
  }

  set usesSso(sso){
    this._ssoUsage = sso;
  }

  get messageIntegration(){
    return this._messageIntegration;
  }

  set messageIntegration(integration){
    this._messageIntegration = integration;
  }

  get usesScm(){
    return this._scmIntegration;
  }

  set usesScm(scm){
    this._scmIntegration = scm;
  }

  get usesIssueInt(){
    return this._issueIntegration;
  }

  set usesIssueInt(issue){
    this._issueIntegration = issue;
  }

  get createdProjects(){
    return this._projectCreated;
  }

  set createdProjects(projects){
    this._projectCreated = projects;
  }

  get invitedMembers(){
    return this._memberInvited;
  }

  set invitedMembers(invited){
    this._memberInvited = invited;
  }

  get useTeams(){
    return this._teamUsed;
  }

  set useTeams(team){
    this._teamUsed = team;
  }

  get editProjects(){
    return this._projSettings;
  }

  set editProjects(project){
    this._projSettings = project;
  }

  
}

class Project {
  constructor(name,id,usesEnvironments,hasMinifiedStackTrace,sdkUpdates,useResolveWorkflow,assignmentPercentage,ownershipRules,usingSessions,
    usingReleases,usingAttachments,usingProfiling,usingPerformance,alertsSet,metricAlerts,crashFreeAlerts,isMobile,linksIssues,platforms){
      this.name = name;
      this.id = id;
      this.usesEnvironments = usesEnvironments;
      this.hasMinifiedStackTrace = hasMinifiedStackTrace;
      this.sdkUpdates = sdkUpdates;
      this.useResolveWorkflow = useResolveWorkflow;
      this.assignmentPercentage = assignmentPercentage;
      this.ownershipRules = ownershipRules
      this.usingSessions = usingSessions;
      this.usingReleases = usingReleases;
      this.usingPerformance = usingPerformance;
      this.usingAttachments = usingAttachments;
      this.usingProfiling = usingProfiling;
      this.alertsSet = alertsSet;
      this.metricAlerts = metricAlerts;
      this.crashFreeAlerts = crashFreeAlerts;
      this.isMobile = isMobile;
      this.linksIssues = linksIssues;
      this.platforms = platforms;
    }

    get projectName(){
      return this._name;
    }

    get projectId(){
      return this._id;
    }

    get projectEnvironments(){
      return this._usesEnvironments;
    }

    set projectEnvironments(x){
      this._usesEnvironments = x;
    }

    get projectStackTraces(){
      return this._hasMinifiedStackTrace
    }

    set projectStackTraces(x){
      this._hasMinifiedStackTrace = x;
    }

    get projectUpdates(){
      return this._sdkUpdates;
    }

    set projectUpdates(x){
      this._sdkUpdates = x;
    }

    get projectWorkflow(){
      return this._useResolveWorkflow;
    }

    set projectWorkflow(x){
      this._useResolveWorkflow = x;
    }

    get projectAssignment(){
      return this._assignmentPercentage;
    }

    set projectAssignment(x){
      this._assignmentPercentage = x;
    }

    get projectOwnership(){
      return this._ownershipRules;
    }

    set projectOwnership(x){
      this._ownershipRules = x;
    }

    get projectSessions(){
      return this._usingSessions;
    }

    set projectSessions(x){
      this._usingSessions = x;
    }

    get projectReleases(){
      return this._usingReleases;
    }

    set projectReleases(x){
      this._usingReleases = x;
    }

    get projectPerformance(){
      return this._usingPerformance
    }

    set projectPerformance(x){
      this._usingPerformance = x;
    }

    get projectAttachments(){
      return this._usingAttachments;
    }

    set projectAttachments(x){
      this._usingReleases = x;

    }

    get projectProfiling(){
      return this._usingProfiling;

    }

    set projectProfiling(x){
      this._usingProfiling = x;

    }


    get projectAlerts(){
      return this._alertsSet;

    }

    set projectAlerts(x){
      this._alertsSet = x;

    }

    get projectMetricAlerts(){
      return this._metricAlerts;

    }

    set projectMetricAlerts(x){
      this._metricAlerts = x;

    }

    get projectCrashFreeAlerts(){
      return this._crashFreeAlerts;

    }

    set projectCrashFreeAlerts(x){
      this._crashFreeAlerts = x;

    }

    get projectPlatforms(){
      return this._platforms;
    }

    set projectPlatforms(x){
      this._platforms = x;
    }


}

//         let projectData = {
  // 'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':hasDesymbolicationFiles,
  // 'upgradeSdk':sdktoUpgrade,'useAllErrorTypes':iosMechanismsUsed || androidMechanismsUsed,'useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'ownershipRules':ownershipRulesSet,
  // 'sessions':usingSessions,'releases':usingReleases,'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,
  // 'alerts':projectAlerts.length>0,'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts
// };

let outputRows = [
  [
  'Organization Name', 'Using SCIM', 'Using SSO', 'Using Messaging Integration', 'Using SCM Integration', 'Using Issue Tracking Integration',
  'Projects Created Recently', 'Members Invited Recently', 'Teams have been used recently (Either created or joined)', 'Project Settings edited recently', 'Renewal in next 6 months',
  'Average Error Quota Usage over the past 6 months', 'Average Txn Quota Usage over the past 6 months', 'Average Attachment Quota Usage over the past 6 months'
  ],[],[],[
    'Project Name','Project Id','Project Uses Environments?','Project has minified Stacktraces?', 'Sdk version to upgrade', 'Uses all Error Types', 'Issue Workflow is used? (Issues get Resolved)',
    '% Of issues that are assigned', 'Ownership Rules are set', 'Sessions are being sent?', 'Releases are being created?', 'Attachments are being sent?', 'Profiles are being used?',
    'Performance is used in this project?', 'Project has alerts set up?', 'Project has metric alerts set up?', 'Project has a CFSR Alert?','Project Platform'
  ]
]

let dropRateDataRows = [
  ['Project Name/Org', 'Event Type', 'Percentage Dropped', 'Dropped Events', 'Filtered Events', 'Accepted Events']
]
// var selectedNumberOfIssues = document.getElementById("teamNumbers");
// selectedNumberOfIssues.addEventListener("change",()=>{ document.getElementById('teamsIssueTable').remove(); addTeamSpan(sortedTeams.slice(-selectedNumberOfIssues.value));
// })
var checkOpen = 0
var sortedTeams = []
let checkNonMobile = true;
let startingDiv = document.createElement('div')
startingDiv.id = 'startingDiv';
var checkbox = document.createElement('input');
             
// Assigning the attributes
// to created checkbox
checkbox.type = "checkbox";
checkbox.name = "MobileProjectCheck";
checkbox.value = false;
checkbox.id = "MobileProjectCheck";
// creating label for checkbox
var label = document.createElement('label');
 
// assigning attributes for
// the created label tag
label.htmlFor = "MobileProjectCheck";
 
// appending the created text to
// the created label tag
label.appendChild(document.createTextNode('Tick for mobile only audit.'));


// appending the checkbox
// // and label to div
// document.body.appendChild(checkbox);
// document.body.appendChild(label);

let startButton = document.createElement("BUTTON");
let startLabel = document.createTextNode("Click me to run audit.");
startButton.appendChild(startLabel);
startButton.onclick = currentOrg;

startingDiv.appendChild(checkbox);
startingDiv.appendChild(label);
startingDiv.appendChild(startButton);
document.body.appendChild(startingDiv);


async function start(org){
  // wb.SheetNames.push(`${org} Stats`)
  outputRows[1][0] = org;
  orgObject = new Organization(org);
  if(document.getElementById("MobileProjectCheck").checked) {
    checkNonMobile = false;
  }
  document.getElementById('startingDiv').remove()
  checkIntegrations(org);
  checkAuth(org);
  checkAudit(org);
  await checkOrgStats(org);
  console.log(orgObject);

  await checkProjectStats(org);
  await checkMobileUseCase(org);

  dropRateDataRows.forEach( element => {
    if(Array.isArray(element[0])) {
      element.forEach( el => {
        outputRows.push(el)
      })
    } else {
      outputRows.push(element)
    }
  })
  //  org:{ project [{},{}]
  let csvContent = "data:text/csv;charset=utf-8," + outputRows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${org}_audit.csv`);
  link.innerText = "Download as CSV";
  document.body.appendChild(link);
  console.log(allProjectAudits)
  let projectsArray = []
  allProjectAudits.forEach( project => {
    let projObject = new Project(project['projectName']);
    projObject.alertsSet = project['alerts'];
    projObject.assignmentPercentage = project['assignments'];
    projObject.crashFreeAlerts = project['Crash Free Alerts'];
    projObject.hasMinifiedStackTrace = project['hasDesymFiles'];
    projObject.metricAlerts = project['metricAlerts'];
    projObject.ownershipRules = project['ownershipRules'];
    projObject.sdkUpdates = project['upgradeSdk'];
    projObject.useResolveWorkflow = project['useResolveWorkflow'];
    projObject.usesEnvironments = project['environments'];
    projObject.usingPerformance = project['performance'];
    projObject.usingProfiling = project['profiles'];
    projObject.usingReleases = project['releases'];
    projObject.usingSessions = project['sessions'];
    projObject._platforms = project['Platform'];
    projectsArray.push(projObject);
  })
  orgObject.projects = projectsArray;
  console.log(orgObject);
  let objForEval = {org: orgObject}
  console.log(objForEval);
  let o = RULE_ENGINE.process(objForEval);
  console.log(o)

  // console.log('projects without Crash Free Alerts')
  // console.log(allProjectAudits.filter(function (element) { return element['Crash Free Alerts'] == false }))
  // console.log('projects not using assignments')
  // console.log(allProjectAudits.filter(function (element) { return element['assignments'] == 0 }))
  // console.log('projects with minified stack traces')
  // console.log(allProjectAudits.filter(function (element) { return element['hasDesymFiles'] == false }))
  // console.log('projects using performance')
  // console.log(allProjectAudits.filter(function (element) { return element['performance'] == true }))
  // console.log('projects using profiling')
  // console.log(allProjectAudits.filter(function (element) { return element['profiles'] == true }))
  // var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
  // var buf = new ArrayBuffer(wbout.length); //convert s to arrayBuffer
  // var view = new Uint8Array(buf);  //create uint8array as viewer
  // for (var i=0; i<wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF; //convert to octet
  // var encodedUri = encodeURI(wbout);
  // var link = document.createElement("a");
  
  
}




async function checkAuth(org){
  let authApi = `https://sentry.io/api/0/organizations/${org}/auth-provider/`;
  let authUsage = await fetch(authApi).then((r)=> {if (r.status != '204') {return r.json()} else { return r.status}}).then((result => {return result}));
  // console.log(authUsage)
  if (authUsage == '204') {
    // console.log("no SSO enabled altogether (no SCIM no SSO)");
    outputRows[1][1] = 'No.'
    outputRows[1][2] = 'No.'
  }
  else {
    outputRows[1][1] = authUsage['require_link'];
    orgObject.usesSso = authUsage['require_link'];
    outputRows[1][2] = authUsage['scim_enabled'];
    orgObject.usesScim = authUsage['require_link'];
    // console.log("SSO enabled: "+authUsage['require_link']);
    // console.log("SCIM enabled: "+authUsage['scim_enabled']);
  }

}




async function checkAudit(org){
  let auditApi = `https://sentry.io/api/0/organizations/${org}/audit-logs/`
  let auditLog = await fetch(auditApi).then((r)=> r.json()).then((result => {return result}));
  let oneMonthAgo = new Date( (new Date().getTime() - (1000 * 60 * 60 * 24 * 30)) )
  let recentAudit = auditLog['rows'].filter( function(element) { return new Date(element['dateCreated']).getTime() > oneMonthAgo } )
  let projectsCreatedRecently = recentAudit.filter( function(element) { return element['event'] == 'project.create' })
  let memberInvitedrecently = recentAudit.filter( function(element) { return element['event'] == 'member.invite' })
  let memberTeamActivity = recentAudit.filter( function(element) { return element['event'] == 'member.join-team' || element['event'] == 'team.create' || element['event'] == 'member.accept-invite' })
  let projectActivity = recentAudit.filter( function(element) { return element['event'] == 'project.edit' || element['event'] == 'projectkey.create' })
  let auditUsage = {'projectsCreatedRecently':projectsCreatedRecently.length,'membersInvitedRecently':memberInvitedrecently.length,'memberTeamActivity':memberTeamActivity.length,'projectActivity':projectActivity.length}
  
  outputRows[1][6] = auditUsage['projectsCreatedRecently'];
  outputRows[1][7] = auditUsage['membersInvitedRecently'];
  outputRows[1][8] = auditUsage['memberTeamActivity'];
  outputRows[1][9] = auditUsage['projectActivity'];

  orgObject.createdProjects =  auditUsage['projectsCreatedRecently'];
  orgObject.invitedMembers = auditUsage['membersInvitedRecently'];
  orgObject.useTeams = auditUsage['memberTeamActivity'];
  orgObject.editProjects = auditUsage['projectActivity'];
  
}

function aggregateStats(apiResult) {
  // Not including 'rejected' outcome here since it's not immediately actionable by customer, usually it's a negligble amount caused due to network error or intermittent problems.
  let ingestionRejectionDict = ['client_discard','rate_limited'] 
  let ingestionFilteredDict = ['filtered']
  let ingestionAcceptedDict = ['accepted']
  let acceptedStats = {}
  let acceptedEvents = []
  let rejectedEvents = []
  let filteredEvents = []
  let rejectedStats = {}
  let filteredStats = {}
  let alarmingDropRate = []

  // Org stats is passed in with 'groups'
  if ('groups' in apiResult) {
    rejectedEvents = apiResult.groups.filter( function (element) {
      return ingestionRejectionDict.includes(element['by']['outcome'])
    });
    filteredEvents = apiResult.groups.filter( function (element) {
      return ingestionFilteredDict.includes(element['by']['outcome'])
    });
    acceptedEvents = apiResult.groups.filter( function (element) {
      return ingestionAcceptedDict.includes(element['by']['outcome'])
    });
  } else {
    rejectedEvents = apiResult.filter( function (element) {
      return ingestionRejectionDict.includes(element['by']['outcome'])
    });
    filteredEvents = apiResult.filter( function (element) {
      return ingestionFilteredDict.includes(element['by']['outcome'])
    })
    acceptedEvents = apiResult.filter( function (element) {
      return ingestionAcceptedDict.includes(element['by']['outcome'])
    });
  }

  // Aggregate total rejection and acceptance stats by type of event
  ingestionCategoryDict.forEach(element => {
    let rejectsForCategory = rejectedEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    rejectsForCategory.forEach(el => {
      rejectedStats[element] = el['totals']['sum(quantity)']
    })
    let acceptsForCategory = acceptedEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    acceptsForCategory.forEach(el => {
      acceptedStats[element] = el['totals']['sum(quantity)']
    })
    let filtersForCategory = filteredEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    filtersForCategory.forEach(el => {
      filteredStats[element] = el['totals']['sum(quantity)']
    })
    if ((element in rejectedStats && element in acceptedStats) || (element in filteredStats)){
      if ((acceptedStats[element] / 3 < rejectedStats[element]) || (acceptedStats[element] / 3 < filteredStats[element])) {
        alarmingDropRate.push(element);
      }
    } 
    // else if (element in rejectedStats && !(element in acceptedStats)) {
    //   alarmingDropRate.push(element);
    // }
  })
  return [alarmingDropRate,acceptedStats,rejectedStats,filteredStats]
}



async function checkOrgStats(org){
  orgSubscriptionApi = orgSubscriptionApi.replace('{org}',org);
  orgSubscriptionHistoryApi = orgSubscriptionHistoryApi.replace('{org}',org);
  orgStatsApi = orgStatsApi.replace('{org}',org);

  let orgSubscription = await fetch(orgSubscriptionApi).then((r)=> r.json()).then((result => {return result}));
  let orgHistory = await fetch(orgSubscriptionHistoryApi).then((r)=>r.json()).then((result=>{return result}));
  
  let renewalDate = new Date(orgSubscription['renewalDate']).getTime()
  let renewalSoon = ( ( renewalDate - new Date().getTime() ) / (1000*60*60*24) ) < 180 // Check if renewal is within 6 months

  outputRows[1][10] = renewalSoon;
  let errorQuotaUsage = 0;
  let txnsQuotaUsage = 0;
  let attachmentQuotaUsage = 0;
  for(var i=0; i < 6; i++) { 
    if (orgHistory[i]){
      errorQuotaUsage += orgHistory[i]['categories']['errors']['usage'] / orgHistory[i]['categories']['errors']['reserved']
      if (orgHistory[i]['categories']['transactions']){
        txnsQuotaUsage += orgHistory[i]['categories']['transactions']['usage'] / orgHistory[i]['categories']['transactions']['reserved']
      }
      if (orgHistory[i]['categories']['attachments']){
        attachmentQuotaUsage += orgHistory[i]['categories']['attachments']['usage'] / orgHistory[i]['categories']['attachments']['reserved']
      }
    }
  }

  if (orgHistory.length<6){
    errorQuotaUsage = errorQuotaUsage / orgHistory.length;
    txnsQuotaUsage = txnsQuotaUsage / orgHistory.length;
    attachmentQuotaUsage = attachmentQuotaUsage / orgHistory.length;

  } else {
    errorQuotaUsage = errorQuotaUsage / 6;
    txnsQuotaUsage = txnsQuotaUsage / 6;
    attachmentQuotaUsage = attachmentQuotaUsage / 6;

  }
  outputRows[1][11] = errorQuotaUsage * 100;
  outputRows[1][12] = txnsQuotaUsage * 100;
  outputRows[1][13] = attachmentQuotaUsage * 100;

  orgStats = await fetch(orgStatsApi).then((r)=> r.json()).then((result => {return result}));
  
  orgWideStats = aggregateStats(orgStats);
  let dropRateRow = []
  orgWideStats[0].forEach ( element => {

    dropRateRow.push(
      ['Org wide', element, ((((orgWideStats[2][element]*100)/(orgWideStats[2][element]+orgWideStats[1][element])) + 
      ((orgWideStats[3][element]*100)/(orgWideStats[3][element]+orgWideStats[1][element]))) || '100'), orgWideStats[2][element],
      (((orgWideStats[3][element]*100)/(orgWideStats[3][element]+orgWideStats[1][element])) || '100'),(orgWideStats[1][element] || 'none')]
     )
     console.log(dropRateRow)
  })
  dropRateDataRows.push(dropRateRow)



}


async function checkProjectStats(org){
 
  projectSdkApi = projectSdkApi.replace('{org}',org);
  projectStatsApi = projectStatsApi.replace('{org}',org);
  projectsApi = projectsApi.replace('{org}',org);

  
  projectSdkStats = await fetch(projectSdkApi).then((r)=> r.json()).then((result => {return result}));
  projectStats = await fetch(projectStatsApi).then((r)=> r.json()).then((result => {return result}));
  // projects = await fetch(projectsApi).then((r)=> r.json()).then((result => {return result}));

  

  mobileProjects = projectSdkStats['data'].filter( function (element)  {
    return ( mobileSdks.includes(element['sdk.name']) && element['count()'] > 100) 
  });
  mobileProjects.sort(function(a,b){return b['count()']-a['count()']});

  projects =  projectSdkStats['data'].filter( function (element)  {
    return ( !(mobileSdks.includes(element['sdk.name'])) && element['count()'] > 100) 
  });

  projects.sort(function(a,b){return b['count()']-a['count()']});
  var selectedNumberOfIssues = document.getElementById("teamNumbers").value;
  if(selectedNumberOfIssues < mobileProjects.length) {
    mobileProjects = mobileProjects.slice(0,selectedNumberOfIssues);
    projects = projects.slice(0,selectedNumberOfIssues);
  }
  document.getElementById("startingNumber").remove();
  let x = 0;
  let progress = 0;
  let projectsQueried = [];
  if (checkNonMobile) {
    for (let project of projects){
      x+=1;
      progress = ((x*100) / projects.length);
      document.getElementById("nonMobileProgressBar").style = `height:24px;width:${progress}%`
      // console.log(project)
      if (!(projectsQueried.includes(project['project']))){
        projectsQueried.push(project['project']);
        let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=${project['project']}`;
        let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
        apiResult = apiResult.filter( function (element) {
          return element['slug'] == project['project'];
        })[0]
        let projectId = apiResult['id'];
        let singleProjectArray = projectStats.groups.filter( function (element) {
          return Number(projectId) == Number(element['by']['project'])
        });
        console.log('single project')
        console.log(projectStats)
        console.log(projectId)
        console.log(singleProjectArray)
        if(singleProjectArray.length>0){
          aggregateProjects[projectId] = aggregateStats(singleProjectArray);
          aggregateProjects[projectId].push(project['project'])
          await checkGenericProject(org,projectId);
        }
      }
    }
    outputRows.push([]);


  }
  document.getElementById("nonMobileProgressBar").style = `height:24px;width:100%`
  
  for (let project of mobileProjects ) {
    if (!(projectsQueried.includes(project['project']))){
      projectsQueried.push(project['project']);
      let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=${project['project']}`;
      let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
      apiResult = apiResult.filter( function (element) {
        return element['slug'] == project['project'];
      })[0]
      let projectId = apiResult['id'];
      let singleProjectArray = projectStats.groups.filter( function (element) {
        return Number(projectId) == Number(element['by']['project'])
      });
      if(singleProjectArray.length>0){
        aggregateProjects[projectId] = aggregateStats(singleProjectArray);
        aggregateProjects[projectId].push(project['project'])
        
      }
    }

  }

  /** replaced projects with mobile projects for now.. weird behaviour where mobile projects are missing from projects api result */


}

async function checkGenericProject(org,project){
  let alertApi = `https://sentry.io/api/0/organizations/${org}/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered`
  let alerts = await fetch(alertApi).then((r)=> r.json()).then((result => {return result}));
  let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=id:${project}`;
  let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
  apiResult = apiResult.filter( function (element) {
    return Number(element['id']) == Number(project);
  })[0]
  let sdkUpdates = await fetch(`https://sentry.io/api/0/organizations/${org}/sdk-updates/`).then((r)=>{return r.json()})
  let projectId = apiResult['id'];
  let projectName = apiResult['slug'];
  let platform = apiResult['platform'];
  let projEnvironmentCount = apiResult['environments'].length;
  let projOutcomes = projectStats.groups.filter( function (element) { return String(element['by']['project'])==String(projectId) });
  let acceptedCategories = [];
  let acceptedOutcomes = projOutcomes.filter( function (element) { return element['by']['outcome']=='accepted'});
  acceptedOutcomes.forEach(element => {acceptedCategories.push(element['by']['category'])});
  let usingPerformance = acceptedCategories.includes('transaction') || acceptedCategories.includes('transaction_index');
  let usingProfiling = acceptedCategories.includes('profile');
  let usingAttachments = acceptedCategories.includes('attachment');
  let usingReleases = false;
  let usingSessions = false;
  let hasMinifiedStacks = apiResult['hasMinifiedStackTrace'] 
  let latestReleases = [];
  let releasesApi = `https://sentry.io/api/0/organizations/${org}/releases/?adoptionStages=1&flatten=0&per_page=20&project=${projectId}&status=open`
  apiResult = await fetch(releasesApi).then((r)=> r.json()).then((result => {return result}));
  if (apiResult.length>2) {
    usingReleases = true;
    latestReleases = apiResult;
  }
  let sessionApi = `https://sentry.io/api/0/organizations/${org}/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=${projectId}`;
  apiResult = await fetch(sessionApi).then((r)=> r.json()).then((result => {return result}));
  let enoughSessions = apiResult['groups'].filter( function (element) { return ( (element['totals']['sum(sessions)'] > 1000) || (element['totals']['sum(session)'] > 1000) ) })
  if (enoughSessions.length > 0) { 
    usingSessions = true;
  }
  let projectAlerts = alerts.filter( function (element) { return element['projects'].includes(projectName) })
  let metricAlerts = projectAlerts.filter( function(element) { return element['dataset'] == 'metrics'})
  let crashFreeAlerts = metricAlerts.filter( function(element) { return element['aggregate'].includes('percentage(sessions_crashed, sessions)')}).length>0
  let assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved%20is%3Aassigned&shortIdLookup=1&statsPeriod=14d`
  let assigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')})
  assigned = Number(assigned) 
  assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=14d`
  let unAssigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')}) 
  unAssigned = Number(unAssigned)
  let unResolved = unAssigned
  unAssigned = unAssigned - assigned
  let assignmentPercentage = ( (assigned* 100) / (unAssigned+assigned) ) 
  let useResolveWorkflow = false;
  let resolvedApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aresolved&shortIdLookup=1&statsPeriod=14d`
  let resolved = await fetch(resolvedApi).then((r)=> {return r.headers.get('x-hits')})
  let sdktoUpgrade = null;
  let sdkVersionToUpdate = sdkUpdates.filter( function (element) {
    return element['projectId'] == projectId;
  })

  if (sdkVersionToUpdate.length>0) {
    if(sdkVersionToUpdate[0]['suggestions'][0]['newSdkVersion']){
      sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + sdkVersionToUpdate[0]['suggestions'][0]['newSdkVersion'];
    }
    else if (sdkVersionToUpdate[0]['suggestions'][0]['newSdkName']) {
      sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + ' Change from Raven SDK to ' + sdkVersionToUpdate[0]['suggestions'][0]["newSdkName"];
    }
    else {
      sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + ' Lookup.'
    }
  }
  let ownershipRulesApi = `https://sentry.io/api/0/projects/${org}/${projectName}/ownership/`

  let ownershipRulesSet = await fetch(ownershipRulesApi).then((r)=> r.json()).then((result => {return result}));

  ownershipRulesSet = ownershipRulesSet['raw'] != null

  resolved = Number(resolved)
  let resolvedPercentage = ( (resolved*100) / (resolved+unResolved) )
  if (resolvedPercentage > 5 || resolved > 1000) {useResolveWorkflow=true;} // Adding resolved

  if (!(platform.includes('javascript'))){
    hasMinifiedStacks = true;
  }

  let projectData = {
    'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':!hasMinifiedStacks,
    'upgradeSdk':sdktoUpgrade,'useAllErrorTypes':'null','useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'ownershipRules':ownershipRulesSet,
    'sessions':usingSessions,'releases':usingReleases,'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,
    'alerts':projectAlerts.length>0,'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts,"Platform":platform
  };
  
  let row = []
  for (let key in projectData) {
    row.push(projectData[key])
  }
  outputRows.push(row);

  
  console.log(projectName)
  console.log(projectData)
  let dropRateRow = []
  console.log(aggregateProjects)
  aggregateProjects[projectId][0].forEach( element => {

    dropRateRow.push([
      projectName, element, (((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100'),
      aggregateProjects[projectId][2][element],(aggregateProjects[projectId][1][element] || 'none')
    ])
  })
  console.log(dropRateRow)
  dropRateDataRows.push(dropRateRow)

  allProjectAudits.push(projectData)

  
}


function buildRequests(){
  let orgLevelApi = `https://sentry.io/api/0/organizations/${org}`
}

function checkItemsInDict(response,dict) {
  
}
/**
 * 
 * @param {*} org 
 * 
 * - For top X mobile projects
- SDK Version (Major version/s behind?)
- √ProGaurd / dSyms / Source maps available?
- Workflows -
    - CodeOwners linked? Code mapping in place?
    √- Assigning/resolving/linking issues?
- **Releases**
  https://sentry.io/api/0/organizations/testorg-az/releases/?adoptionStages=1&flatten=0&per_page=20&project=5808623&status=open
  https://sentry.io/api/0/organizations/testorg-az/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=5808623&query=release:{release} OR release:{release}}&statsPeriod=14d
    √- Creating releases?
    √- Sending sessions?

    https://sentry.io/api/0/organizations/testorg-az/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered
    √- Look for aggregate: "percentage(sessions_crashed, sessions) AS _crash_rate_alert_aggregate"   and dataset:"metrics" to check if CFSR is calculated
    √- Metric Alerts: Does a crash-free rate metric alert exist?
- **EM**
    - Enabling all error types  
    √https://sentry.io/api/0/organizations/testorg-az/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d ios
    https://sentry.io/api/0/organizations/testorg-az/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&sort=-mechanism&statsPeriod=90d android
    (see Deep Audit > [](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) [SDK Utilization via Error Type / Mechanism](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) )
    √- Issue Alerts - exist? + metric alerts - a spike in errors
- **PM**
    √- Enabled/sending transactions?
    - Leveraging all auto instrumentation?  
    (see Deep Audit > [Auto Instrumentation Enabled](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38))
    √- Sending profiles?
 */




async function checkMobileUseCase(org) {
  let projectsChecked = [];
  
  if (mobileProjects.length < 1) {
    console.log('no active mobile projects');
  }
  else {
    let x = 0;
    let progress = 0;
    let sdkUpdates = await fetch(`https://sentry.io/api/0/organizations/${org}/sdk-updates/`).then((r)=>{return r.json()})
    let iosMechanisms = await fetch(`https://sentry.io/api/0/organizations/${org}/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d`).then((r)=>{return r.json()})
    let alertApi = `https://sentry.io/api/0/organizations/${org}/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered`
    let alerts = await fetch(alertApi).then((r)=> r.json()).then((result => {return result}));
    for ( let project of mobileProjects )  {
      if( !(projectsChecked.includes(project['project'])) ) {
        x+=1;
        progress = ((x*100) / projects.length);
        document.getElementById("mobileProgressBar").style = `height:24px;width:${progress}%`
        projectsChecked.push(project['project']);
        let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=${project['project']}`;
        let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
        apiResult = apiResult.filter( function (element) {
          return element['slug'] == project['project'];
        })[0]
        let sdktoUpgrade = null;
        let projectId = apiResult['id'];
        let projectName = apiResult['slug'];
        let platform = apiResult['platform'];
        let projEnvironmentCount = apiResult['environments'].length;
        let hasMinifiedStacks = apiResult['hasMinifiedStackTrace'] 
        let projOutcomes = projectStats.groups.filter( function (element) { return String(element['by']['project'])==String(projectId) });
        let acceptedCategories = [];
        let acceptedOutcomes = projOutcomes.filter( function (element) { return element['by']['outcome']=='accepted'});
        acceptedOutcomes.forEach(element => {acceptedCategories.push(element['by']['category'])});
        let usingPerformance = acceptedCategories.includes('transaction') || acceptedCategories.includes('transaction_index');
        let usingProfiling = acceptedCategories.includes('profile');
        let usingAttachments = acceptedCategories.includes('attachment');
        let usingReleases = false;
        let usingSessions = false;
        let latestReleases = [];
        let releasesApi = `https://sentry.io/api/0/organizations/${org}/releases/?adoptionStages=1&flatten=0&per_page=20&project=${projectId}&status=open`
        apiResult = await fetch(releasesApi).then((r)=> r.json()).then((result => {return result}));
        if (apiResult.length>2) {
          usingReleases = true;
          latestReleases = apiResult;
        }
        let sdkVersionToUpdate = sdkUpdates.filter( function (element) {
          return element['projectId'] == projectId;
        })

        // {
        //   "type": "changeSdk",
        //   "newSdkName": "@sentry/browser",
        //   "sdkUrl": "https://github.com/getsentry/sentry-javascript/blob/master/MIGRATION.md#migrating-from-raven-js-to-sentrybrowser",
        //   "enables": []
        //   }

        if (sdkVersionToUpdate.length>0) {
          if(sdkVersionToUpdate[0]['suggestions'][0]['newSdkVersion']){
            sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + sdkVersionToUpdate[0]['suggestions'][0]['newSdkVersion'];
          }
          else if (sdkVersionToUpdate[0]['suggestions'][0]['newSdkName']) {
            sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + ' Change from Raven SDK to ' + sdkVersionToUpdate[0]['suggestions'][0]["newSdkName"];
          }
          else {
            sdktoUpgrade = sdkVersionToUpdate[0]['sdkName'] + sdkVersionToUpdate[0]['sdkVersion'] + '=>' + ' Lookup.'
          }
        }
        let sessionApi = `https://sentry.io/api/0/organizations/${org}/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=${projectId}`;
        apiResult = await fetch(sessionApi).then((r)=> r.json()).then((result => {return result}));
        let enoughSessions = apiResult['groups'].filter( function (element) { return ( (element['totals']['sum(sessions)'] > 1000) || (element['totals']['sum(session)'] > 1000) ) })
        if (enoughSessions.length > 0) { 
          usingSessions = true;
        }
        let projectAlerts = alerts.filter( function (element) { return element['projects'].includes(projectName) })
        let metricAlerts = projectAlerts.filter( function(element) { return element['dataset'] == 'metrics'})
        let crashFreeAlerts = metricAlerts.filter( function(element) { return element['aggregate'].includes('percentage(sessions_crashed, sessions)')}).length>0
        let assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved%20is%3Aassigned&shortIdLookup=1&statsPeriod=14d`
        let assigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')})
        assigned = Number(assigned) 
        assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=14d`
        let unAssigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')}) 
        unAssigned = Number(unAssigned)
        let unResolved = unAssigned
        unAssigned = unAssigned - assigned
        let ownershipRulesApi = `https://sentry.io/api/0/projects/${org}/${projectName}/ownership/`
        let ownershipRulesSet = await fetch(ownershipRulesApi).then((r)=> r.json()).then((result => {return result}));

        ownershipRulesSet = ownershipRulesSet['raw'] != null
        let assignmentPercentage = ( (assigned* 100) / (unAssigned+assigned) ) 
        let useResolveWorkflow = false;
        let resolvedApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aresolved&shortIdLookup=1&statsPeriod=14d`
        let resolved = await fetch(resolvedApi).then((r)=> {return r.headers.get('x-hits')}) 
        resolved = Number(resolved) 
        let resolvedPercentage = ( (resolved*100) / (resolved+unResolved) )
        if (resolvedPercentage > 5 || resolved > 1000) {useResolveWorkflow=true;} // Adding resolved
        let usesAllErrorTypes = false; // Convert this from true/false to displaying which error types exist/don't exist
        let iosMechanismsUsed = iosMechanisms[9]['topValues'].filter(function (element) { return element['name']==projectName}).length > 0
        let androidMechanisms = await fetch(`https://sentry.io/api/0/organizations/${org}/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&sort=-mechanism&statsPeriod=90d`).then((r)=>{return r.json()})
        let androidMechanismsUsed = androidMechanisms['data'].length>0;
        let hasDesymbolicationFiles = false;
        let proguardApi = `https://sentry.io/api/0/projects/${org}/${projectName}/files/dsyms/?file_formats=proguard`
        let dsymApi = `https://sentry.io/api/0/projects/${org}/${projectName}/files/dsyms/?file_formats=breakpad&file_formats=macho&file_formats=elf&file_formats=pe&file_formats=pdb&file_formats=sourcebundle&file_formats=wasm&file_formats=bcsymbolmap&file_formats=uuidmap&file_formats=il2cpp&file_formats=portablepdb`
        let sourcemapApi = `https://sentry.io/api/0/projects/${org}/${projectName}/releases/{replace_release}/files/`
        apiResult = [];
        switch(project['sdk.name']) {
          case 'sentry.cocoa':
            apiResult = await fetch(dsymApi).then((r)=> r.json()).then((result => {return result}));
            break;
          case 'sentry.java.android':
            apiResult = await fetch(proguardApi).then((r)=> r.json()).then((result => {return result}));
            break;
          case 'sentry.javascript.react-native':
            apiResult = await fetch(sourcemapApi.replace('{replace_release}',latestReleases[0]['version'])).then((r)=> r.json()).then((result => {return result}));
            if (apiResult.length < 1) {
              for(var i = 1; i < latestReleases.length; i++) {
                apiResult = await fetch(sourcemapApi.replace('{replace_release}',latestReleases[i]['version'])).then((r)=> r.json()).then((result => {return result}));
                if (apiResult.length > 1) {
                  i=latestReleases.length+1;
                }
              }
            }
            break;
        }
        // TODO check against 'hasminifiedstacktraces' and see if there's discrepancies
        if (apiResult.length > 0) {hasDesymbolicationFiles=true;}
        if (!(hasDesymbolicationFiles && (!hasMinifiedStacks))) {hasDesymbolicationFiles=false;}
        let projectData = {
          'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':hasDesymbolicationFiles,
          'upgradeSdk':sdktoUpgrade,'useAllErrorTypes':iosMechanismsUsed || androidMechanismsUsed,'useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'ownershipRules':ownershipRulesSet,
          'sessions':usingSessions,'releases':usingReleases,'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,
          'alerts':projectAlerts.length>0,'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts,"Platform":platform
        };
        

      let row = []
      for (let key in projectData) {
        row.push(projectData[key])
      }

      if ( row.length > 0 ){
        outputRows.push(row);
      }
      console.log(row)
      // console.log(outputRows)
      // let csvContent = "data:text/csv;charset=utf-8," 
      //     + rows.map(e => e.join(",")).join("\n");
      //   console.log(projectName)
      //   console.log(projectData)
      allProjectAudits.push(projectData)
      
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", `${org}_audit.csv`);
      // link.innerText = "Download as CSV";
      // // document.body.appendChild(link); // Required for FF
      //   console.log(projectName)
      //   console.log(projectData)
      let dropRateRow = []

        aggregateProjects[projectId][0].forEach( element => {
          // console.log(element + " is dropping at alarming rate - " +(((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100') + "%")
          // console.log(aggregateProjects[projectId][2][element] + " dropped vs. " + (aggregateProjects[projectId][1][element] || 'none') + ' accepted.')
          dropRateRow.push([
            projectName, element, (((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100'),
            aggregateProjects[projectId][2][element],(aggregateProjects[projectId][1][element] || 'none')
          ])
        })
        console.log(dropRateRow)
        dropRateDataRows.push(dropRateRow)
        allProjectAudits.push(projectData)
      }
    }
    document.getElementById("mobileProgressBar").style = `height:24px;width:100%`
    outputRows.push([]);
  }

}

/**
 * 
 * Org level stats that I need to pull
 * 
 * Integrations:
 * https://sentry.io/api/0/organizations/testorg-az/sentry-app-installations/ - check for internal integrations
 * https://sentry.io/api/0/organizations/testorg-az/plugins/configs/ - check for which integrations have configs
 * √Check for Source Control Management
 * √Check for Notification software (Slack, MS Teams, Pagerduty)
 * √Check for Issue tracking (JIRA, Azure DevOPs)
 **/


async function checkIntegrations(org) {
  let sourceControlDict = ['github','bitbucket','gitlab'];
  let messagingDict = ['slack','ms-teams','teams'];
  let issueTrackingDict = ['JIRA','jira','azure'];
  // let internalIntegrationApi = `https://sentry.io/api/0/organizations/${org}/sentry-app-installations/`
  let integrationApi = `https://sentry.io/api/0/organizations/${org}/plugins/configs/`;
  // let internalIntegrations = await fetch(internalIntegrationApi).then((r)=> r.json()).then((result => {return result}))
  let externalIntegrations = await fetch(integrationApi).then((r)=> r.json()).then((result => {return result}));
  // console.log(externalIntegrations)
  var scmIntegrations = externalIntegrations.filter( function (element) {
    return sourceControlDict.includes(element.id);
  });
  var messagingIntegrations = externalIntegrations.filter( function (element) {
    return messagingDict.includes(element.id);
  });
  var issueIntegrations = externalIntegrations.filter( function (element) {
    return issueTrackingDict.includes(element.id); 
  });

  outputRows[1][3] = messagingIntegrations.length>0;
  outputRows[1][4] = scmIntegrations.length>0;
  outputRows[1][5] = issueIntegrations.length>0;

  orgObject.messageIntegration = messagingIntegrations.length > 0;
  orgObject.usesScm = scmIntegrations.length > 0;
  orgObject.usesIssueInt = issueIntegrations.length > 0;
}  


 /** 
 * Auth:
 * 
 * 
 * https://sentry.io/api/0/organizations/testorg-az/auth-provider/
 * 
 * Check if SSO is enabled - require_link
 * Check if SCIM is enabled - scim_enabled
 * 
 * If no SSO altogether then http response will be code 204
 * 
 * 
 * Audit log:
 * 
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/?cursor=1671754313751%3A0%3A0
 * 
 * Check if projects were created recently
 * Check if Teams were created recently
 * Check projectKey.edit
 * 
 * 
 * Stats:
 * https://sentry.io/api/0/organizations/testorg-az/projects/ - project list
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?field=sum%28quantity%29&groupBy=category&groupBy=outcome&interval=1h&project=-1&statsPeriod=14d - orgwide outcomes for transactions/errors/others
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?category=error&field=sum%28quantity%29&groupBy=outcome&groupBy=project&interval=1h&project=-1&statsPeriod=14d - dropped/accepted per project
 * Check if any projects have significant dropped/filtered stats
 * 
 * Check if projects with large percentage of events have 
 */


/**
 * 
 * Use Case: Mobile
 * 
 * Mobile SDK names:
 * sentry.java.android
 * sentry.cocoa
 * sentry.javascript.react-native
    - Does use-case exist? (i.e relevant sdks sending ~meaningful traffic)
    https://sentry.io/api/0/organizations/testorg-az/events/?field=project&field=sdk.name&field=sdk.version&field=count%28%29&per_page=50&query=&referrer=api.discover.query-table&sort=-count&statsPeriod=14d
    - For top X mobile projects
        - SDK Version (Major version/s behind?)
        - ProGaurd / dSyms / Source maps available?
        - Workflows -
            - CodeOwners linked? Code mapping in place?
            - Assigning/resolving/linking issues?
        - **Releases**
          https://sentry.io/api/0/organizations/testorg-az/releases/?adoptionStages=1&flatten=0&per_page=20&project=5808623&status=open
          https://sentry.io/api/0/organizations/testorg-az/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=5808623&query=release:{release} OR release:{release}}&statsPeriod=14d
            - Creating releases?
            - Sending sessions?

            https://sentry.io/api/0/organizations/testorg-az/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered&team=myteams&team=unassigned
            - Look for aggregate: "percentage(sessions_crashed, sessions) AS _crash_rate_alert_aggregate"   and dataset:"metrics" to check if CFSR is calculated
            - Metric Alerts: Does a crash-free rate metric alert exist?
        - **EM**
            - Enabling all error types  
            https://sentry.io/api/0/organizations/testorg-az/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d ios
            https://sentry.io/api/0/organizations/testorg-az/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&referrer=api.discover.query-table&sort=-mechanism&statsPeriod=90d android
            (see Deep Audit > [](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) [SDK Utilization via Error Type / Mechanism](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) )
            - Issue Alerts - exist? + metric alerts - a spike in errors
        - **PM**
            - Enabled/sending transactions?
            - Leveraging all auto instrumentation?  
            (see Deep Audit > [Auto Instrumentation Enabled](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38))
            - Sending profiles?
 * 
 */