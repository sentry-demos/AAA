import { Engine,EngineOptions } from "../engine.js";
import { mockAccount } from "../engine.js";
let e = new Engine(EngineOptions);
let o = e.generateOutboundForAccount(mockAccount);
console.log(o);

//assert subset matches project rules for mock account A
let m = {}

const case_a = [
    {
        body:"Sentry’s android sdk offers detection for http client errors. You are not currently tracking this."
    },
    {
        body:"You have some options for optimizing your mobile perf data from your andriod project. Our automatic integrations allow you to track latency down to the ui, http or db span. You can validate your instrumentation via <discover>.",

    },
    {
        body:"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release",
       
    },
   {
       body:"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
     

   }, 
    {
        body:"You aren’t leveraging Sentry’s release support to the fullest by collecting session data. Track & alert on crash free session rate.",
        
    },
    {
        body:"Your project doesn't leverage real time alerting for issues. Consider adding a baseline for alert visibility to track new high volume issues & regressions.",
        
    },
    {
        body:"Adding proguard files will dramatically improve the readibility of your stacktraces, sentry’s grouping algorithm, & issue ownership. Consider utilizing Sentry’s gradle integration to do so.",
        
    },
    {
        body:"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
        
    },
    {
        "body":"Specifying environments in SDK initialization can help you better understand & filter issues during your phased rollout.",
      
    },
    {
        "body":"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
        
    }
    ,
    {
        "body":"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release.",
        
    },
    {
        "body":"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
       
    },
    {
        "body":"Issues are best owned within Sentry. Assigning issues routes notifications and issues directly to those most apt to fix them. You can even have Sentry do assignment automatically for you.",
        
    },
    {
        "body":"Dropping events can impact your visibility of issues. Consider using Discover to triage your noisiest issues or identify other good candidates for filtering.",
    
    },
    {body: 'VCS allows organizations & their teams to triage more efficiently by adding commit metadata to Senry issues. We recommend configuring this when possible.'},
    {body: 'How do your teams get notified in real time to issues? Integrate your current alerting tools with Sentry, or take advantage of webhooks.'},
    {body: 'Sentry supports sso for a select group of providers. Streamline your onboarding process using this integration or our generic auth provider.'}
    ]

const expected_rules = case_a.reduce((m,mock_rule) => {m[mock_rule.body] = true; return m},m)
//find a better way to diff
let result = o["test_name_A"].map(rule => rule.body in expected_rules)
assert(result.every(Boolean) === true, "test correct rule bodies generated",result,true)
assert(case_a.length === o["test_name_A"].length, "test rule lengths equal",case_a.length,o["test_name_A"].length)
//need to account for different shap of output, org rules & project rules.

function assert(condition, message, input, expected) {
    if (!condition) {
        console.log("Failed against mock_project_a: " + message);
        console.log(input)
        console.log(expected)
        return
    }
    console.log("Passed Failed against mock_project_a: " + message)
}