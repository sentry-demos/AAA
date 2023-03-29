
export function isIntegratedVcs(accountDataApi){
    return accountDataApi.PROJECT_API.usesScm

}

export function isIntegratedAlerting(accountDataApi){
    return accountDataApi.PROJECT_API.messageIntegration
}

export function isOrgIntegratedVcs(accountDataApi){
    return accountDataApi.ORG_API.usesScm
}

export function isOrgIntegratedAlerting(accountDataApi){
    return accountDataApi.ORG_API.messageIntegration
}

export function isOrgIntegratedSso(accountDataApi){
    return accountDataApi.ORG_API.usesSso
}