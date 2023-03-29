
export function isInstrumentedHttpErrors(accountDataApi){
    return accountDataApi.PROJECT_API.httpIsInstrumented
}

export function isInstrumentedDatabase(accountDataApi){
    return accountDataApi.PROJECT_API.dbIsInstrumented
}

export function isInstrumentedFileIo(accountDataApi){
    //need to check naming for this Project API
    return accountDataApi.PROJECT_API.usesAllErrorTypes
}

export function isInstrumentedFragments(accountDataApi){
     //need to check naming for this Project API
    return accountDataApi.PROJECT_API.uiIsInstrumented
}

export function isInstrumentedOkhttp(accoundDataApi){
    return accoundDataApi.PROJECT_API.usesAllErrorTypes
}
