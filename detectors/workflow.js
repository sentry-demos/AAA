
export function isUsingOwnership(accountDataApi){
    return accountDataApi.PROJECT_API.projectOwnership
}

export function isUsingMetricAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.projectMetricAlerts
}

export function isUsingIssueAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.alertsSet
}

export function isUsingIssueAssignment(accountDataApi){
    return accountDataApi.PROJECT_API.projectAssignment
}

export function isUsingDashboards(accountDataApi){
    return accountDataApi.PROJECT_API.hasDashboards()
}