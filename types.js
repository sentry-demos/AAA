
export const EVENT_TYPES = {
    error:'error',
    transaction:'transaction'
}

export const SDK_TYPES = {
    mobile:'mobile',
    javascript:'javascript',
    "react-native":'react-native',
    ios:'ios',
    backend:'backend',
    frontend:'frontend',
    android:'android'
}

export const USER_TYPES = {
    'team.size.small':'team.size.small',
    'team.size.large':'team.size.large',
}

export const DEPENDENCY_TYPES = {
    
    root:'root',
    sdk:'sdk',
    sdk_platform:'sdk_platform',
    event:'event',
    issue:'issue',
    account:'account',
    team:'team',
    org:'org',
    project:'project',
    org_issue:'org_issue',
    project_issue:'project_issue'
}
export const LEVEL_TYPES = {
    org:'org',
    project:'project'
}
export const ORG_ISSUE_TYPES = {
    'ecosystem.vcs.none':'ecosystem.vcs.none', 
    'ecosystem.sso.none':'ecosystem.sso.none',
    'ecosystem.alerting.none':'ecosystem.alerting.none'
}
export const SDK_ISSUE_TYPES = {
    'sdk.android.instrumentation.fragments.none':'sdk.android.instrumentation.fragments.none',
    'sdk.android.instrumentation.http_errors.none':'sdk.android.instrumentation.http_errors.none',
    'sdk.android.instrumentation.fileio.none':'sdk.android.instrumentation.fileio.none',
    'sdk.android.instrumentation.db.none':'sdk.android.instrumentation.db.none',
    'sdk.android.instrumentation.okhttp.none':'sdk.android.instrumentation.okhttp.none'
}


export const ISSUE_TYPES = {
    'sdk.integrations.none':'sdk.integrations.none',
    'releases.session_tracking.none':'releases.session_tracking.none',
    'releases.versioning.none':'releases.versioning.none',
    'releases.environment.none':'releases.environment.none',
    'quota.txn.high':'quota.txn.high',
    'quota.txn.low':'quota.txn.low',
    'quota.utilization.txn.base':'quota.utilization.txn.base',
    'quota.dropped.errors.high':'quota.dropped.errors.high',
    'quota.errors.high':'quota.errors.high',
    'quota.errors.low':'quota.erros.low',
    'workflow.assignment.some':'workflow.assignment.some',
    'workflow.assignment.none':'workflow.assignment.none',
    'workflow.ownership.some':'workflow.ownership.some',
    'workflow.ownership.none':'workflow.ownership.none',
    'dashboards.none':'dashboards.none',
    'workflow.metric_alerts.none':'workflow.metric_alerts.none',
    'workflow.issue_alerts.none':'workflow.issue_alerts.none',
    'ecosystem.vcs.none':'ecosystem.vcs.none',
    'ecosystem.alerting.none':'ecosystem.alerting.none',
    'releases.artifacts.sourcemaps.none':'releases.artifacts.sourcemaps.none',
    'releases.artifacts.proguard.none':'releases.artifacts.proguard.none',
    'releases.artifacts.dsyms.none':'releases.artifacts.dsyms.none',
    'sdk.major.update':'sdk.major.update',
    'release_health.environment.none':'release_health.environment.none'
    
}