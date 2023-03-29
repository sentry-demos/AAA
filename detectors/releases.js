
export function isSessionTracking(accountDataApi){
    return accountDataApi.PROJECT_API.projectSessions
}

export function isUsingReleases(accountDataApi){
    return accountDataApi.PROJECT_API.projectReleases
}

export function isUploadingArtifactsDsym(accountDataApi){
    return accountDataApi.PROJECT_API.projectStackTraces
}

export function isUploadingArtifactsProguard(accountDataApi){
    return accountDataApi.PROJECT_API.projectStackTraces
}

export function isUsingEnvironments(accountDataApi){
    return accountDataApi.PROJECT_API.projectEnvironments
}

export function isUploadingArtifactsSourcemaps(accountDataApi){
    return accountDataApi.PROJECT_API.projectStackTraces
}