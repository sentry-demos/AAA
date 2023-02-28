
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

