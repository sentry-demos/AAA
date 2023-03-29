
export function isUsingBaseTxn(accountDataApi){
    return accountDataApi.PROJECT_API.hasBaseTransactions()
}

export function isDroppingErrors(accountDataApi){
    return !accountDataApi.PROJECT_API.hasDropped()
}
