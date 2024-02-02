// generate a data object based on AAA output

// this is sample data, to fully automate we'd want data output from AAA to be converted into inputData
const inputData = {
    "Org Slug": "demo",
    "Project Name": "react",
    "Project Id": 1234567890,
    "Project Uses Environments?": false,
    "Project Platform": "javascript-react",
    "Project has minified Stacktraces?": true,
    "Sdk version to upgrade": "sentry.javascript.browser7.80.1=>7.92.0",
    "Issue Workflow is used? (Issues get Resolved)": false,
    "% Of issues that are assigned": 0,
    "Ownership Rules are set": false,
    "Sessions are being sent?": false,
    "Releases are being created?": false,
    "Performance is used in this project?": false,
    "Attachments are being sent?": "undefined",
    "Profiles are being used?": false,
    "Project has alerts set up?": false,
    "Project has metric alerts set up?": false,
    "Project has a CFSR Alert?": false,
    "Project has an alert which utilises a messaging integration": false,
    "Project is Mobile": false,
    "Project links issues": false,
    "Uses all Error Types": "null",
    "HTTP Spans Instrumented": false,
    "DB Spans Instrumented (perf issues)": false,
    "UI Spans Instrumented": false,
    "Router Instrumented?": false,
    "Using Session Replay?": false
}

export const findings = {
    "Automatic Issue Assignment": {
        "value": false,
        "explanation": "Assigning issues can save 30-45 minutes in triaging to the appropriate developer &/or team. Sentry can automatically assign issues based on preset ownership rules.",
        "recommendation": "Configure manual ownership rules or import an existing github codeowner file. | https://{Org Slug}.sentry.io/settings/projects/{Project Name}/ownership/",
        "tag": "developer-productivity"
    },
    "Environments": {
        "value": true,
        "explanation": "Configuring environments (e.g. dev, prod, staging) help you better filter issues, releases, and user feedback in the Issue Details page.",
        "recommendation": "Set environments in Sentry.init| https://docs.sentry.io/platforms/node/guides/connect/configuration/environments/",
        "tag": "developer-productivity"
    },    
    "Crash Free Session Rate Alerts": {
        "value": false,
        "explanation": "Crash free session rate alerts can notify you when the CFSR drops below specified thresholds.",
        "recommendation": "Configure CFSR alerts. | https://{Org Slug}.sentry.io/alerts/new/metric/?aggregate=percentage%28sessions_crashed%2C+sessions%29+AS+_crash_rate_alert_aggregate&dataset=metrics&eventTypes=session&project={Project Name}&referrer=alert_stream"
    },
    "Issue Alerts": {
        "value": true,
        "explanation": "Your project doesn't leverage real-time alerting for issues. Consider adding a baseline for alert visibility to track new high volume issues & regressions.",
        "recommendation": "Configure issue alerts. | https://{Org Slug}.sentry.io/alerts/new/issue/?project={Project Name}",
        "tag": "developer-productivity"
    },
    "Metric Alerts": {
        "value": false,
        "explanation": "Metric alerts can notify you when certain thresholds are exceeded such as failure rate, users experiencing an error, spikes in transaction duration, etc.",
        "recommendation": "Configure metric alerts. | https://{Org Slug}.sentry.io/alerts/new/metric/?aggregate=count%28%29&dataset=events&eventTypes=error&project={Project Name}",
        "tag": "developer-productivity"
    },
    "Release Monitoring": {
        "value": true,
        "explanation": "Monitoring releases will give you the ability to measure adoption rates, crash-free session rates, and more.",
        "recommendation": "Set up releases for your SDK. | https://docs.sentry.io/product/releases/setup/",
        "tag": "developer-productivity"
    },
    "Regression Tracking": {
        "value": false,
        "explanation": "Sentry can tell you when issues regress across releases so you know if a release caused a spike in errors or created a worse user experience. To track regressed issues you need to resolve issues in Sentry.",
        "recommendation": "Turn on auto resolve for issues that haven\’t shown up in 14 days. | https://{Org Slug}.sentry.io/settings/projects/{Project Name}/#resolveAge",
        "tag": "developer-productivity"
    },
    "Session Tracking": {
        "value": false,
        "explanation": "You can leverage Sentry's release support further to monitor and alert on crash free session rate.",
        "recommendation": "Enable autoSessionTracking. | https://docs.sentry.io/platforms/javascript/configuration/releases/#sessions",
        "tag": "developer-happiness"
    },
    "Source Context": {
        "value": false,
        "explanation": "Sentry can deobfuscate your code so you can see where an issue ocurred directly in the unminified stack trace. Additionally, deobfuscated code allows for better automated issue grouping.",
        "recommendation": "Use the sentry wizard to upload source maps. | https://docs.sentry.io/platforms/javascript/sourcemaps/#uploading-source-maps",
        "tag": "developer-happiness"
    },
}

const newObj = {
    "Org Slug": inputData["Org Slug"],
    "Project Name": inputData["Project Name"],
}; 

//condition checks to add findings into report
if(inputData["Issue Workflow is used? (Issues get Resolved)"] === false) {
    newObj["Regression Tracking"] = findings["Regression Tracking"];
}

if(inputData["Project Uses Environments?"] === false) {
    newObj["Environments"] = findings["Environments"];
}

if(inputData["Project has alerts set up?"] === false) {
    newObj["Issue Alerts"] = findings["Issue Alerts"];
}

if(inputData["Project has metric alerts set up?"] === false) {
    newObj["Metric Alerts"] = findings["Metric Alerts"];
}

//only adds CFSR alert if Metric Alerts isn't added
if (inputData["Project has a CFSR Alert?"] === false && newObj["Metric Alerts"] === undefined) {
    newObj["Crash Free Session Rate Alerts"] = findings["Crash Free Session Rate Alerts"];
}

if(inputData["Releases are being created?"] === false) {
    newObj["Release Monitoring"] = findings["Release Monitoring"];
}

if(inputData["Project has minified Stacktraces?"] === true) {
    newObj["Source Context"] = findings["Source Context"];
}

if(inputData["Ownership Rules are set"] === false) {
    newObj["Automatic Issue Assignment"] = findings["Automatic Issue Assignment"];
}

export { newObj };
