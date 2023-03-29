
import { DEPENDENCY_TYPES, SDK_TYPES,  } from "./types.js"
import { AndroidIssueDetectors,WorkflowIssueDetectors,ReleaseIssueDetectors,EcosystemIssueDetectors,QuotaIssueDetectors,PlatformDetectors} from "./detectors/index.js"
import { isPlatformReactNative } from "./detectors/platforms.js"


/**
 *  Dependencies (deps):
 * 
 * Dependencies are any keys that are specified within deps:{}. They function to identify account data/metadata on which the rule's evaluation depends. Object properties map to different Evaluator classes which contain the logic for making the ultimate decision of which rules apply to accounts. 
 * 
 * Detectors:
 * 
 *  Custom logic for asking questions about an account. These are typically functions that consume a data api and perhaps also have some logic for interpreting the result There can be one or more detectors marshalling data that an Evaluator will use in making its final decision.
 */



/**
 * Rules are ultimately transformed into a tree structure that reflects nested dependencies. When a tree is built for a rule, each dependency Node binds to an Evaluator (not pictured). Later, when creating outbound for an account, each Node evaluates itself against account data using the logic specified in the Evaluator. The entire rule tree must resolve to True in order for a rule to apply --writing rules based on the presense of certain criteria in an account was decided to be all or nothing.
 * 
 * Rule A -> Tree A
 * 
 *              root
 *             /    \
 *          project  org
 *          /   \      \
 * .     *sdk   issue  issue
 *       /   \     \      \
 *      /     \ [detector] [detector]
 * platform  issue
 *
 * Sibling evaluation is dependent on how rules are authored. The result of the nth sibling will impact whether or not the nth + 1 is evaluated or we exit early.
 * 
 In the tree above, the children of the *sdk node are evaluated from left to right. If the sdk.platform evaluator returns false, no other siblings will be evaluated. 

/**
 * Notes on syntax:
 * Currently rules must follow the syntax below. They must have a body, priority and top level project & org deps keys. There is no syntax checking currently so undefined behavior is possible:
 * 
 * Top level fields:
 * 
 * 1.) body: <string> 
 * 
 * //example Rule A deps above.
 * 2.) deps:{
 *           project:{
 *             issue: [detector],
 *             sdk:{
 *               platform: [detector]
 *               issue: [detector]
 *             }, 
 *           org:{
 *             issue:[detector]
 *           }
 *     }
 * 
 *     Currently either project, org, or both top level keys must be supplied.
 * 
 * 3. priority: <int>
 * 
 */


/*If you are adding new rules with new dependencies that might be shared or overlap, it is probably a good candidate for a new Evaluator type.

For instance something like sdk.android.integrations.none
This could be represented as:
/**
 *       sdk
 *      /   \
 * platform  issue
 * 
 * Sdk acts as the parent category evaluating the sdk platform deps (android) and issue (no integrations) together.


*/
//TODO: Think of conveniences for grouping Rule dependency syntax together that makes it easier for authors. For instance some Cluster class for the dependency tree above that abstracts the ordering and nesting factors away to reduce error and overhead.

export const RULES = [
    {
        body:"Sentry’s android sdk offers detection for http client errors. You are not currently tracking this.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformAndroid],
                    [DEPENDENCY_TYPES.issue]:[AndroidIssueDetectors.isInstrumentedHttpErrors]
            }}
        },
        priority:2
    },
    {
        body:"You have some options for optimizing your mobile perf data from your andriod project. Our automatic integrations allow you to track latency down to the ui, http or db span. You can validate your instrumentation via <discover>.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformAndroid],
                    [DEPENDENCY_TYPES.issue]:[
                        AndroidIssueDetectors.isInstrumentedFragments,
                        AndroidIssueDetectors.isInstrumentedDatabase,
                        AndroidIssueDetectors.isInstrumentedOkhttp
                    ],
                    
                },
               
                // [DEPENDENCY_TYPES.issue]:[[ISSUE_TYPES["quota.utilization.txn.base"]],[ISSUE_TYPES["sdk.integrations.none"]]]
                
            },
           
        }, priority:4

    },
    // {//TODO: dashboards are more of an org level data point. Deps should reflect such.
    //     body:"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
    //     deps:{
    //         [DEPENDENCY_TYPES.project]:{
    //             [DEPENDENCY_TYPES.sdk]:{
    //                 [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile],
    //             },
    //             [DEPENDENCY_TYPES.issue]:[WorkflowIssueDetectors.isUsingDashboards]
                
    //         }
    //     },
    //     priority:4
    // },
    {
        body:"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                   [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile]
                },
               
                [DEPENDENCY_TYPES.issue]:[WorkflowIssueDetectors.isUsingIssueAlerts]
            }
        },
        priority:2
    },
   {
       body:"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
       deps:{
           [DEPENDENCY_TYPES.org]:{
               [DEPENDENCY_TYPES.issue]:[EcosystemIssueDetectors.isOrgIntegratedAlerting]
           },
           [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile]
                },
               [DEPENDENCY_TYPES.issue]:[WorkflowIssueDetectors.isUsingMetricAlerts]
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
                    PlatformDetectors.isPlatformMobile]
                },
                [DEPENDENCY_TYPES.issue]:[
                   ReleaseIssueDetectors.isSessionTracking,
                ],
                
            }
        },
        priority:0
    },
    {
        body:"Your project doesn't leverage real time alerting for issues. Consider adding a baseline for alert visibility to track new high volume issues & regressions.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.issue]:[
                    WorkflowIssueDetectors.isUsingIssueAlerts,WorkflowIssueDetectors.isUsingMetricAlerts
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
                    EcosystemIssueDetectors.isOrgIntegratedAlerting
                ]
            ]
        },
        priority:0
    },
   {
       body:"Sentry supports sso for a select group of providers. Streamline your onboarding process using this integration or our generic auth provider.",
       deps:{[DEPENDENCY_TYPES.org]:{
           [DEPENDENCY_TYPES.issue]:[
              EcosystemIssueDetectors.isOrgIntegratedSso
           ]
       }}
       ,priority:0
   }, 
   {
       body:"Upload your souremaps to get unminified JS stack traces in Sentry. Our react-native sdk provides <functionality> to do this ootb utilizing gradle & xcode.",
       deps:{
          [DEPENDENCY_TYPES.project]:{
            [DEPENDENCY_TYPES.sdk]:{
                  [DEPENDENCY_TYPES.sdk_platform]:[isPlatformReactNative]
              },
            [DEPENDENCY_TYPES.issue]:[ReleaseIssueDetectors.isUploadingArtifactsSourcemaps]}
       },
       prority:0
   } ,
    {
        body:"Adding debug files will dramatically improve the readibility of your stacktraces, sentry’s grouping algorithm, & issue ownership. Consider using our fastlane plugin or Appstore connect integration.",
        deps:{
            project:{
                
                sdk:{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformIos]
                },
                issue:[ReleaseIssueDetectors.isUploadingArtifactsDsym],
            },
            
        },priority:0
    },
    {
        body:"Adding proguard files will dramatically improve the readibility of your stacktraces, sentry’s grouping algorithm, & issue ownership. Consider utilizing Sentry’s gradle integration to do so.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.sdk]:{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformAndroid],
                },
                [DEPENDENCY_TYPES.issue]:[ReleaseIssueDetectors.isUploadingArtifactsProguard],
                
            },
        },
        priority:0
    },
    {
        body:"Help sentry understand your versioning scheme. Adopting the pattern specified <here> enables support for Semantic Versioning in your queries and release filtering.",
        deps:{
            [DEPENDENCY_TYPES.project]:{
                [DEPENDENCY_TYPES.issue]:[ReleaseIssueDetectors.isUsingReleases]
            }
            },
        priority:0
        
    },
    {
        body:"VCS allows organizations & their teams to triage more efficiently by adding commit metadata to Senry issues. We recommend configuring this when possible.",
        deps:{org:{"issue":[EcosystemIssueDetectors.isOrgIntegratedVcs]}},
        "priority":0
    },
    {
        body:"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
        deps:{org:{issue:[EcosystemIssueDetectors.isOrgIntegratedVcs]},project:{issue:[WorkflowIssueDetectors.isUsingOwnership]}},
        priority:0
    },
    {
        "body":"Specifying environments in SDK initialization can help you better understand & filter issues during your phased rollout.",
        "deps":{
            project:{
                "sdk":{
                [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile],
            },
            "issue":[ReleaseIssueDetectors.isUsingEnvironments]}},
        "priority":0
    },
    {
        "body":"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
        "deps":{
            org:{
                "issue":[EcosystemIssueDetectors.isIntegratedAlerting]
            },
            project:{
                "sdk":{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile],
                },
                "issue":[WorkflowIssueDetectors.isUsingMetricAlerts]}},
        "priority":10
    }
    ,
    {
        "body":"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release.",
        "deps":{
            project:{
                "sdk":{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile]
                },
                "issue":[WorkflowIssueDetectors.isUsingIssueAlerts]}},
        "priority":10
    },
    {
        "body":"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
        "deps":{
            project:{
                "sdk":{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile]
                },
                "issue":[WorkflowIssueDetectors.isUsingOwnership]}},
        "priority":5
    },
    {
        "body":"There are benefits to uploading sourcemaps directly to Sentry via our API. You can improve the consistency & reliability of human readable stacktraces in your project. Exposing sensitive URLs is generally not ideal.",
        "deps":{
            project:{
                "sdk":{
                    [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformJavascript]
            },
                "issue":[ReleaseIssueDetectors.isUploadingArtifactsSourcemaps]}},
        "priority":1
    },
    // {TODO: How can we make global statements about the FE/BE ishness of an org?
    //     "body":"Our tracing product allows you to identify bottlenecks & correlate errors directly in the Senty UI. You have some projects that might be good candidates for this.",
    //     "deps":{
    //         project:{
    //             "sdk":{
    //                 [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformFrontend,PlatformDetectors.isPlatformBackend]
    //         },
    //             "issue":[QuotaIssueDetectors.isUsingBaseTxn]}},
    //     "priority":8
    // },
    // {
    //     "body":"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
    //     "deps":{project:{
    //         [DEPENDENCY_TYPES.sdk]:{
    //             [DEPENDENCY_TYPES.sdk_platform]:[PlatformDetectors.isPlatformMobile]
    //         },
    //         "issue":[WorkflowIssueDetectors.isUsingDashboards]}},
    //     "priority":10
    // },
    {
        "body":"Issues are best owned within Sentry. Assigning issues routes notifications and issues directly to those most apt to fix them. You can even have Sentry do assignment automatically for you.",
        "deps":{project:{"issue":[WorkflowIssueDetectors.isUsingIssueAssignment]}},
        "priority":10
    },
    {
        "body":"Dropping events can impact your visibility of issues. Consider using Discover to triage your noisiest issues or identify other good candidates for filtering.",
        "deps":{project:{"issue":[QuotaIssueDetectors.isDroppingErrors]}},
        "priority":2
    },
        
    ]

