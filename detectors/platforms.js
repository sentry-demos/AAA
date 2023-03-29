
import {PLATFORM} from "../types.js"


export function isPlatformAndroid(accountDataApi){     
    return accountDataApi.PROJECT_API.projectPlatforms=== PLATFORM.android
}

export function isPlatformJavascript(accountDataApi){
    
    return accountDataApi.PROJECT_API.projectPlatforms === PLATFORM.javascript

}

export function isPlatformReactNative(accountDataApi){
    return accountDataApi.PROJECT_API.projectPlatforms === PLATFORM["react-native"]
   
}
export function isPlatformIos(accountDataApi){

    const variants = [PLATFORM.swift,PLATFORM["cocoa-objc"],PLATFORM["cocoa-swift"]]
    
    return  variants.some((v) => v === accountDataApi.PROJECT_API.projectPlatforms)

}
export function isPlatformMobile(accountDataApi){
    //hack for now
    //isMobile
    return accountDataApi.isMobile
}

export function isPlatformFrontend(accountDataApi){
    //TODO:make this work correctly
    return false

}

export function isPlatformBackend(accoundDataApi){
    //TODO:make this work correctly
    return false
}