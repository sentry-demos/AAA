const api = "https://sentry.io/api/0/organizations/"
let url;
const {RULE_ENGINE} = import('./engine.js');

// import { XLSX } from "./node_modules/xlsx/xlsx.js"; 
// import * as XLSX from './node_modules/xlsx/xlsx.mjs';

// const XLSX = window.XLSX
function currentOrg(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    url = activeTab.url; 
    const org = url.split('.sentry.io')[0] 
    start(org.substring(8));
  });

}


  // .NET / Flutter additions
const mobileSdks = ['sentry.java.android','sentry.cocoa','sentry.javascript.react-native']
const ingestionCategoryDict = ['sessions','profile','transaction_indexed','attachment','replay','error','transaction']

let orgSubscriptionApi = `https://sentry.io/api/0/subscriptions/{org}/`
let orgSubscriptionHistoryApi = 'https://{org}.sentry.io/api/0/customers/{org}/history/'
let orgStatsApi = 'https://sentry.io/api/0/organizations/{org}/stats_v2/?field=sum%28quantity%29&groupBy=category&groupBy=outcome&interval=1h&project=-1&statsPeriod=14d'
let projectStatsApi = 'https://sentry.io/api/0/organizations/{org}/stats_v2/?field=sum%28quantity%29&groupBy=outcome&groupBy=project&groupBy=category&interval=1h&project=-1&statsPeriod=14d'
let projectsApi = 'https://sentry.io/api/0/organizations/{org}/projects/'
let projectSdkApi = 'https://sentry.io/api/0/organizations/{org}/events/?field=project&field=sdk.name&field=sdk.version&field=count%28%29&per_page=100&project=-1&sort=-count&statsPeriod=14d'
let teamDict = {};
let projects = [];
let projectObjects = [];
let orgObject;
let aggregateProjects = {};
let orgStats = [];
let projectSdkStats = [];
let projectStats = [];
let mobileUseCase = false;
let topProjects = [];
let mobileProjects = [];
let orgWideStats = [];
let frontendUseCase = false;
let backendUseCase = false;
let nativeUseCase = false;
let allProjectAudits = [];

// Indexes - 0:Blank 1:Org Stats, 2:Blank, 3:Org Stats Headers, 4:Org Stats populated, 5:Blank, 6:Blank 7:Project Stats Headers

// Org Stats to be populated (outputRows[4][index]) Index:
// 0:Org Name, 1:SCIM, 2:SSO, Integrations 3:Messaging 4:SCM 5:Issue Tracking, 6:Projects created recently, 7:Members added, 8:Teams used recently,
// 9:Project Settings edited
class Organization {
  constructor(name,scimUsage=false,ssoUsage=false,messagingIntegration=false,scmIntegration=false,issueIntegration=false,
    projectCreated=false,memberInvited=false,teamUsed=false,projSettings=false)
    {
      this._name = name;
      this.scimUsage = scimUsage;
      this.ssoUsage = ssoUsage;
      this.messagingIntegration = messagingIntegration;
      this.scmIntegration = scmIntegration;
      this.issueIntegration = issueIntegration;
      this.projectCreated = projectCreated;
      this.memberInvited = memberInvited;
      this.teamUsed = teamUsed;
      this.projSettings = projSettings;
    }

  get usesScim(){
    return this._scimUsage;
  }
  set usesScim(scim){
    this._scimUsage = scim;
  }

  get usesSso(){
    return this._ssoUsage;
  }

  set usesSso(sso){
    this._ssoUsage = sso;
  }

  get messageIntegration(){
    return this._messageIntegration;
  }

  set messageIntegration(integration){
    this._messageIntegration = integration;
  }

  get usesScm(){
    return this._scmIntegration;
  }

  set usesScm(scm){
    this._scmIntegration = scm;
  }

  get usesIssueInt(){
    return this._issueIntegration;
  }

  set usesIssueInt(issue){
    this._issueIntegration = issue;
  }

  get createdProjects(){
    return this._projectCreated;
  }

  set createdProjects(projects){
    this._projectCreated = projects;
  }

  get invitedMembers(){
    return this._memberInvited;
  }

  set invitedMembers(invited){
    this._memberInvited = invited;
  }

  get useTeams(){
    return this._teamUsed;
  }

  set useTeams(team){
    this._teamUsed = team;
  }

  get editProjects(){
    return this._projSettings;
  }

  set editProjects(project){
    this._projSettings = project;
  }

  
}

class Project {
  constructor(name,id,usesEnvironments,hasMinifiedStackTrace,sdkUpdates,useResolveWorkflow,assignmentPercentage,ownershipRules,usingSessions,
    usingReleases,usingAttachments,usingProfiling,usingPerformance,alertsSet,metricAlerts,crashFreeAlerts,isMobile,linksIssues){
      this._name = name;
      this.id = id;
      this.usesEnvironments = usesEnvironments;
      this.hasMinifiedStackTrace = hasMinifiedStackTrace;
      this.sdkUpdates = sdkUpdates;
      this.useResolveWorkflow = useResolveWorkflow;
      this.assignmentPercentage = assignmentPercentage;
      this.ownershipRules = ownershipRules
      this.usingSessions = usingSessions;
      this.usingReleases = usingReleases;
      this.usingPerformance = usingPerformance;
      this.usingAttachments = usingAttachments;
      this.usingProfiling = usingProfiling;
      this.alertsSet = alertsSet;
      this.metricAlerts = metricAlerts;
      this.crashFreeAlerts = crashFreeAlerts;
      this.isMobile = isMobile;
      this.linksIssues = linksIssues;

    }

    get projectName(){
      return this._name;
    }

    get projectId(){
      return this._id;
    }

    get projectEnvironments(){
      return this._usesEnvironments;
    }

    set projectEnvironments(x){
      this._usesEnvironments = x;
    }

    get projectStackTraces(){
      return this._hasMinifiedStackTrace
    }

    set projectStackTraces(x){
      this._hasMinifiedStackTrace = x;
    }

    get projectUpdates(){
      return this._sdkUpdates;
    }

    set projectUpdates(x){
      this._sdkUpdates = x;
    }

    get projectWorkflow(){
      return this._useResolveWorkflow;
    }

    set projectWorkflow(x){
      this._useResolveWorkflow = x;
    }

    get projectAssignment(){
      return this._assignmentPercentage;
    }

    set projectAssignment(x){
      this._assignmentPercentage = x;
    }

    get projectOwnership(){
      return this._ownershipRules;
    }

    set projectOwnership(x){
      this._ownershipRules = x;
    }

    get projectSessions(){
      return this._usingSessions;
    }

    set projectSessions(x){
      this._usingSessions = x;
    }

    get projectReleases(){
      return this._usingReleases;
    }

    set projectReleases(x){
      this._usingReleases = x;
    }

    get projectAttachments(){
      return this._usingAttachments;
    }

    set projectAttachments(x){
      this._usingReleases = x;

    }

    get projectProfiling(){
      return this._usingProfiling;

    }

    set projectProfiling(x){
      this._usingProfiling = x;

    }


    get projectAlerts(){
      return this._alertsSet;

    }

    set projectAlerts(x){
      this._alertsSet = x;

    }

    get projectMetricAlerts(){
      return this._metricAlerts;

    }

    set projectMetricAlerts(x){
      this._metricAlerts = x;

    }

    get projectCrashFreeAlerts(){
      return this._crashFreeAlerts;

    }

    set projectCrashFreeAlerts(x){
      this._crashFreeAlerts = x;

    }

}

//         let projectData = {
  // 'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':hasDesymbolicationFiles,
  // 'upgradeSdk':sdktoUpgrade,'useAllErrorTypes':iosMechanismsUsed || androidMechanismsUsed,'useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'ownershipRules':ownershipRulesSet,
  // 'sessions':usingSessions,'releases':usingReleases,'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,
  // 'alerts':projectAlerts.length>0,'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts
// };

let outputRows = [
  [],['Organization Stats'],[],[
  'Organization Name', 'Using SCIM', 'Using SSO', 'Using Messaging Integration', 'Using SCM Integration', 'Using Issue Tracking Integration',
  'Projects Created Recently', 'Members Invited Recently', 'Teams have been used recently (Either created or joined)', 'Project Settings edited recently', 'Renewal in next 6 months',
  'Average Error Quota Usage over the past 6 months', 'Average Txn Quota Usage over the past 6 months', 'Average Attachment Quota Usage over the past 6 months'
  ],[],[],[
    'Project Name','Project Id','Project Uses Environments?','Project has minified Stacktraces?', 'Sdk version to upgrade', 'Uses all Error Types', 'Issue Workflow is used? (Issues get Resolved)',
    '% Of issues that are assigned', 'Ownership Rules are set', 'Sessions are being sent?', 'Releases are being created?', 'Attachments are being sent?', 'Profiles are being used?',
    'Performance is used in this project?', 'Project has alerts set up?', 'Project has metric alerts set up?', 'Project has a CFSR Alert?'
  ]
]

let dropRateDataRows = [
  ['Project Name/Org', 'Event Type', 'Percentage Dropped', 'Dropped Events', 'Filtered Events', 'Accepted Events']
]
// var selectedNumberOfIssues = document.getElementById("teamNumbers");
// selectedNumberOfIssues.addEventListener("change",()=>{ document.getElementById('teamsIssueTable').remove(); addTeamSpan(sortedTeams.slice(-selectedNumberOfIssues.value));
// })
var checkOpen = 0
var sortedTeams = []
currentOrg();
// var wb = XLSX.utils.book_new()
// wb.props = {
//   Title: "Automated Audit Findings",
//   CreatedDate: new Date()
// };
// wb.SheetNames.push("Organization stat")
// var orgStatData = [[
//   'Organization Name', 'Using SCIM', 'Using SSO', 'Using Messaging Integration', 'Using SCM Integration', 'Using Issue Tracking Integration',
//   'Projects Created Recently?', 'Members Invited Recently?', 'Teams have been used recently? (Either created or joined)', 'Project Settings edited recently?'],
//   [], [], [], ['Event types dropping alarmingly']]
//
async function start(org){
  // wb.SheetNames.push(`${org} Stats`)
  outputRows[4][0] = org;
  orgObject = new Organization(org);
  checkIntegrations(org);
  checkAuth(org);
  checkAudit(org);
  await checkOrgStats(org);
  let myOrg = new Organization(org,)
  await checkProjectStats(org);
  await checkMobileUseCase(org);

  dropRateDataRows.forEach( element => {
    outputRows.push(element)
  })
  let csvContent = "data:text/csv;charset=utf-8," + outputRows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${org}_audit.csv`);
  link.innerText = "Download as CSV";
  document.body.appendChild(link);

  // console.log('projects without Crash Free Alerts')
  // console.log(allProjectAudits.filter(function (element) { return element['Crash Free Alerts'] == false }))
  // console.log('projects not using assignments')
  // console.log(allProjectAudits.filter(function (element) { return element['assignments'] == 0 }))
  // console.log('projects with minified stack traces')
  // console.log(allProjectAudits.filter(function (element) { return element['hasDesymFiles'] == false }))
  // console.log('projects using performance')
  // console.log(allProjectAudits.filter(function (element) { return element['performance'] == true }))
  // console.log('projects using profiling')
  // console.log(allProjectAudits.filter(function (element) { return element['profiles'] == true }))
  // var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
  // var buf = new ArrayBuffer(wbout.length); //convert s to arrayBuffer
  // var view = new Uint8Array(buf);  //create uint8array as viewer
  // for (var i=0; i<wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF; //convert to octet
  // var encodedUri = encodeURI(wbout);
  // var link = document.createElement("a");
  
  

    // document.body.appendChild(link); // Required for FF
  // link.setAttribute("href", encodedUri);
  // link.setAttribute("download", `${org}_audit.xlsx`);
  // link.innerText = "Download as XLSX";
  // link.click();
}

 /** 
 * Auth:
 * 
 * TBC whether possible to retrieve via the API or other easily automated method
 * 
 * https://sentry.io/api/0/organizations/testorg-az/auth-provider/
 * 
 * √Check if SSO is enabled - require_link 
 * √Check if SCIM is enabled - scim_enabled
 * 
 * √If no SSO altogether then http response will be code 204
 * 
 * example response
 * { "id": "13322","provider_name": "google","pending_links_count": 40,"login_url": "https://sentry.io/organizations/testorg-az/issues/","default_role": "member","require_link": false,
 * "scim_enabled": true }
 * 
 **/ 




async function checkAuth(org){
  let authApi = `https://sentry.io/api/0/organizations/${org}/auth-provider/`;
  let authUsage = await fetch(authApi).then((r)=> {if (r.status != '204') {return r.json()} else { return r.status}}).then((result => {return result}));
  // console.log(authUsage)
  if (authUsage == '204') {
    // console.log("no SSO enabled altogether (no SCIM no SSO)");
    outputRows[4][1] = 'No.'
    outputRows[4][2] = 'No.'
  }
  else {
    outputRows[4][1] = authUsage['require_link'];
    orgObject.usesSso = authUsage['require_link'];
    outputRows[4][2] = authUsage['scim_enabled'];
    orgObject.usesScim = authUsage['require_link'];
    // console.log("SSO enabled: "+authUsage['require_link']);
    // console.log("SCIM enabled: "+authUsage['scim_enabled']);
  }

}


/*
 * Audit log:
 * 
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/?cursor=1671754313751%3A0%3A0
 * 
 * √Check if projects were created recently
 * √Check if Teams were created recently
 * √Check projectKey.edit
 * 
 * 
 * Stats:
 * https://sentry.io/api/0/organizations/testorg-az/projects/ - project list
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?field=sum%28quantity%29&groupBy=category&groupBy=outcome&interval=1h&project=-1&statsPeriod=14d - orgwide outcomes for transactions/errors/others
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?category=error&field=sum%28quantity%29&groupBy=outcome&groupBy=project&interval=1h&project=-1&statsPeriod=14d - dropped/accepted per project
 * √Check if any projects have significant dropped/filtered stats
 * 
 * √Check if projects with large percentage of events have 
 */



async function checkAudit(org){
  let auditApi = `https://sentry.io/api/0/organizations/${org}/audit-logs/`
  let auditLog = await fetch(auditApi).then((r)=> r.json()).then((result => {return result}));
  let oneMonthAgo = new Date( (new Date().getTime() - (1000 * 60 * 60 * 24 * 30)) )
  let recentAudit = auditLog['rows'].filter( function(element) { return new Date(element['dateCreated']).getTime() > oneMonthAgo } )
  let projectsCreatedRecently = recentAudit.filter( function(element) { return element['event'] == 'project.create' })
  let memberInvitedrecently = recentAudit.filter( function(element) { return element['event'] == 'member.invite' })
  let memberTeamActivity = recentAudit.filter( function(element) { return element['event'] == 'member.join-team' || element['event'] == 'team.create' || element['event'] == 'member.accept-invite' })
  let projectActivity = recentAudit.filter( function(element) { return element['event'] == 'project.edit' || element['event'] == 'projectkey.create' })
  let auditUsage = {'projectsCreatedRecently':projectsCreatedRecently.length,'membersInvitedRecently':memberInvitedrecently.length,'memberTeamActivity':memberTeamActivity.length,'projectActivity':projectActivity.length}
  
  outputRows[4][6] = auditUsage['projectsCreatedRecently'];
  outputRows[4][7] = auditUsage['membersInvitedRecently'];
  outputRows[4][8] = auditUsage['memberTeamActivity'];
  outputRows[4][9] = auditUsage['projectActivity'];

  orgObject.createdProjects =  auditUsage['projectsCreatedRecently'];
  orgObject.invitedMembers = auditUsage['membersInvitedRecently'];
  orgObject.useTeams = auditUsage['memberTeamActivity'];
  orgObject.editProjects = auditUsage['projectActivity'];
  
}

function aggregateStats(apiResult) {
  // Not including 'rejected' outcome here since it's not immediately actionable by customer, usually it's a negligble amount caused due to network error or intermittent problems.
  let ingestionRejectionDict = ['client_discard','rate_limited'] 
  let ingestionFilteredDict = ['filtered']
  let ingestionAcceptedDict = ['accepted']
  let acceptedStats = {}
  let acceptedEvents = []
  let rejectedEvents = []
  let filteredEvents = []
  let rejectedStats = {}
  let filteredStats = {}
  let alarmingDropRate = []

  // Org stats is passed in with 'groups'
  if ('groups' in apiResult) {
    rejectedEvents = apiResult.groups.filter( function (element) {
      return ingestionRejectionDict.includes(element['by']['outcome'])
    });
    filteredEvents = apiResult.groups.filter( function (element) {
      return ingestionFilteredDict.includes(element['by']['outcome'])
    });
    acceptedEvents = apiResult.groups.filter( function (element) {
      return ingestionAcceptedDict.includes(element['by']['outcome'])
    });
  } else {
    rejectedEvents = apiResult.filter( function (element) {
      return ingestionRejectionDict.includes(element['by']['outcome'])
    });
    filteredEvents = apiResult.filter( function (element) {
      return ingestionFilteredDict.includes(element['by']['outcome'])
    })
    acceptedEvents = apiResult.filter( function (element) {
      return ingestionAcceptedDict.includes(element['by']['outcome'])
    });
  }

  // Aggregate total rejection and acceptance stats by type of event
  ingestionCategoryDict.forEach(element => {
    let rejectsForCategory = rejectedEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    rejectsForCategory.forEach(el => {
      rejectedStats[element] = el['totals']['sum(quantity)']
    })
    let acceptsForCategory = acceptedEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    acceptsForCategory.forEach(el => {
      acceptedStats[element] = el['totals']['sum(quantity)']
    })
    let filtersForCategory = filteredEvents.filter( function (el) {
      return element == el['by']['category'];
    })
    filtersForCategory.forEach(el => {
      filteredStats[element] = el['totals']['sum(quantity)']
    })
    if ((element in rejectedStats && element in acceptedStats) || (element in filteredStats)){
      if ((acceptedStats[element] / 3 < rejectedStats[element]) || (acceptedStats[element] / 3 < filteredStats[element])) {
        alarmingDropRate.push(element);
      }
    } 
    // else if (element in rejectedStats && !(element in acceptedStats)) {
    //   alarmingDropRate.push(element);
    // }
  })
  return [alarmingDropRate,acceptedStats,rejectedStats,filteredStats]
}


function checkPlatforms(projects) {
  let mobilePlatforms = []
  let backendPlatforms = []
  let frontendPlatforms = []
  let nativePlatfroms = []

}

async function checkOrgStats(org){
  orgSubscriptionApi = orgSubscriptionApi.replace('{org}',org);
  orgSubscriptionHistoryApi = orgSubscriptionHistoryApi.replace('{org}',org);
  orgStatsApi = orgStatsApi.replace('{org}',org);

  let orgSubscription = await fetch(orgSubscriptionApi).then((r)=> r.json()).then((result => {return result}));
  let orgHistory = await fetch(orgSubscriptionHistoryApi).then((r)=>r.json()).then((result=>{return result}));
  
  let renewalDate = new Date(orgSubscription['renewalDate']).getTime()
  let renewalSoon = ( ( renewalDate - new Date().getTime() ) / (1000*60*60*24) ) < 180 // Check if renewal is within 6 months

  outputRows[4][10] = renewalSoon;
  let errorQuotaUsage = 0;
  let txnsQuotaUsage = 0;
  let attachmentQuotaUsage = 0;
  for(var i=0; i < 6; i++) { 
    if (orgHistory[i]){
      errorQuotaUsage += orgHistory[i]['categories']['errors']['usage'] / orgHistory[i]['categories']['errors']['reserved']
      txnsQuotaUsage += orgHistory[i]['categories']['transactions']['usage'] / orgHistory[i]['categories']['transactions']['reserved']
      attachmentQuotaUsage += orgHistory[i]['categories']['attachments']['usage'] / orgHistory[i]['categories']['attachments']['reserved']
    }
  }

  if (orgHistory.length<6){
    errorQuotaUsage = errorQuotaUsage / orgHistory.length;
    txnsQuotaUsage = txnsQuotaUsage / orgHistory.length;
    attachmentQuotaUsage = attachmentQuotaUsage / orgHistory.length;

  } else {
    errorQuotaUsage = errorQuotaUsage / 6;
    txnsQuotaUsage = txnsQuotaUsage / 6;
    attachmentQuotaUsage = attachmentQuotaUsage / 6;

  }
  outputRows[4][11] = errorQuotaUsage * 100;
  outputRows[4][12] = txnsQuotaUsage * 100;
  outputRows[4][13] = attachmentQuotaUsage * 100;


  orgStats = await fetch(orgStatsApi).then((r)=> r.json()).then((result => {return result}));
  
  orgWideStats = aggregateStats(orgStats);
  let dropRateRow = []
  orgWideStats[0].forEach ( element => {
    // console.log("org wide")
    // console.log(element + " is dropping at alarming rate - " +(((orgWideStats[2][element]*100)/(orgWideStats[2][element]+orgWideStats[1][element])) || '100') + "%")
    // console.log(orgWideStats[2][element] + " dropped vs. " + (orgWideStats[1][element] || 'none') + ' accepted.')
    dropRateRow.push(
      ['Org wide', element, ((((orgWideStats[2][element]*100)/(orgWideStats[2][element]+orgWideStats[1][element])) + 
      ((orgWideStats[3][element]*100)/(orgWideStats[3][element]+orgWideStats[1][element]))) || '100'), orgWideStats[2][element],
      (((orgWideStats[3][element]*100)/(orgWideStats[3][element]+orgWideStats[1][element])) || '100'),(orgWideStats[1][element] || 'none')]
     )
     console.log(dropRateRow)
  })
  dropRateDataRows.push(dropRateRow)
  // 'Project Name/Org', 'Event Type', 'Percentage Dropped', 'Dropped Events', 'Accepted Events'
  console.log(dropRateDataRows)
  // var ws = XLSX.utils.aoa_to_sheet(orgStatData);
  // wb.Sheets[`${org} Stats`] = ws;
  outputRows.push([],[])
  console.log(outputRows[0])
  console.log(outputRows)

}


async function checkProjectStats(org){
 
  projectSdkApi = projectSdkApi.replace('{org}',org);
  projectStatsApi = projectStatsApi.replace('{org}',org);
  projectsApi = projectsApi.replace('{org}',org);

  
  projectSdkStats = await fetch(projectSdkApi).then((r)=> r.json()).then((result => {return result}));
  projectStats = await fetch(projectStatsApi).then((r)=> r.json()).then((result => {return result}));
  projects = await fetch(projectsApi).then((r)=> r.json()).then((result => {return result}));

  

  mobileProjects = projectSdkStats['data'].filter( function (element)  {
    return ( mobileSdks.includes(element['sdk.name']) && element['count()'] > 100) 
  });
  mobileProjects.sort(function(a,b){return b['count()']-a['count()']});
  
  if (mobileProjects.length < 1) {
    projects.forEach( project => {
      let singleProjectArray = projectStats.groups.filter( function (element) {
        return project['id'] == String(element['by']['project'])
      });
      if(singleProjectArray.length>0){
        aggregateProjects[project['id']] = aggregateStats(singleProjectArray);
        aggregateProjects[project['id']].push(project['name'])
        
      }
    })
    for (  project in aggregateProjects) {
      aggregateProjects[project][0].forEach( element => {
        // console.log(element + " is dropping at alarming rate - " +(((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100') + "%")
        // console.log(aggregateProjects[projectId][2][element] + " dropped vs. " + (aggregateProjects[projectId][1][element] || 'none') + ' accepted.')
        dropRateRow.push([
          projectName, element, (((aggregateProjects[project][2][element]*100)/(aggregateProjects[project][2][element]+aggregateProjects[project][1][element])) || '100'),
          aggregateProjects[project][2][element],(aggregateProjects[project][1][element] || 'none')
        ])
      })
      dropRateDataRows.push(dropRateRow)
      console.log(dropRateRow)
    }
  }
  let projectsQueried = [];
  for (let project of mobileProjects ) {
    if (!(projectsQueried.includes(project['project']))){
      projectsQueried.push(project['project']);
      let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=${project['project']}`;
      let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
      apiResult = apiResult.filter( function (element) {
        return element['slug'] == project['project'];
      })[0]
      let projectId = apiResult['id'];
      let singleProjectArray = projectStats.groups.filter( function (element) {
        return Number(projectId) == Number(element['by']['project'])
      });
      if(singleProjectArray.length>0){
        aggregateProjects[projectId] = aggregateStats(singleProjectArray);
        aggregateProjects[projectId].push(project['project'])
        
      }
    }

  }

  /** replaced projects with mobile projects for now.. weird behaviour where mobile projects are missing from projects api result */


}

async function checkGenericProject(org,project){
  let alertApi = `https://sentry.io/api/0/organizations/${org}/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered`
  let alerts = await fetch(alertApi).then((r)=> r.json()).then((result => {return result}));
  let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=id:${project}`;
  let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
  apiResult = apiResult.filter( function (element) {
    return Number(element['id']) == Number(project);
  })[0]
  let projectId = apiResult['id'];
  let projectName = apiResult['slug'];
  let projEnvironmentCount = apiResult['environments'].length;
  let projOutcomes = projectStats.groups.filter( function (element) { return String(element['by']['project'])==String(projectId) });
  let acceptedCategories = [];
  let acceptedOutcomes = projOutcomes.filter( function (element) { return element['by']['outcome']=='accepted'});
  acceptedOutcomes.forEach(element => {acceptedCategories.push(element['by']['category'])});
  let usingPerformance = acceptedCategories.includes('transaction') || acceptedCategories.includes('transaction_index');
  let usingProfiling = acceptedCategories.includes('profile');
  let usingAttachments = acceptedCategories.includes('attachment');
  let usingReleases = false;
  let usingSessions = false;
  let hasMinifiedStacks = apiResult['hasMinifiedStackTrace'] 
  let latestReleases = [];
  let releasesApi = `https://sentry.io/api/0/organizations/${org}/releases/?adoptionStages=1&flatten=0&per_page=20&project=${projectId}&status=open`
  apiResult = await fetch(releasesApi).then((r)=> r.json()).then((result => {return result}));
  if (apiResult.length>2) {
    usingReleases = true;
    latestReleases = apiResult;
  }
  let sessionApi = `https://sentry.io/api/0/organizations/${org}/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=${projectId}`;
  apiResult = await fetch(sessionApi).then((r)=> r.json()).then((result => {return result}));
  let enoughSessions = apiResult['groups'].filter( function (element) { return ( (element['totals']['sum(sessions)'] > 1000) || (element['totals']['sum(session)'] > 1000) ) })
  if (enoughSessions.length > 0) { 
    usingSessions = true;
  }
  let projectAlerts = alerts.filter( function (element) { return element['projects'].includes(projectName) })
  let metricAlerts = projectAlerts.filter( function(element) { return element['dataset'] == 'metrics'})
  let crashFreeAlerts = metricAlerts.filter( function(element) { return element['aggregate'].includes('percentage(sessions_crashed, sessions)')}).length>0
  let assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved%20is%3Aassigned&shortIdLookup=1&statsPeriod=14d`
  let assigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')})
  assigned = Number(assigned) 
  assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=14d`
  let unAssigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')}) 
  unAssigned = Number(unAssigned)
  let unResolved = unAssigned
  unAssigned = unAssigned - assigned
  let assignmentPercentage = ( (assigned* 100) / (unAssigned+assigned) ) 
  let useResolveWorkflow = false;
  let resolvedApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aresolved&shortIdLookup=1&statsPeriod=14d`
  let resolved = await fetch(resolvedApi).then((r)=> {return r.headers.get('x-hits')}) 
  resolved = Number(resolved)
  let resolvedPercentage = ( (resolved*100) / (resolved+unResolved) )
  if (resolvedPercentage > 5 || resolved > 1000) {useResolveWorkflow=true;} // Adding resolved
  let projectData = {
    'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':!hasMinifiedStacks,
    'useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'sessions':usingSessions,'releases':usingReleases,
    'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,'alerts':projectAlerts.length>0,
    'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts
  }
  let rows = [[],[]]
  i = 0;
  for (let key in projectData) {
    rows[0][i] = key;
    rows[1][i] = projectData[key];
    i++;
  }

let csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => e.join(",")).join("\n");
  console.log(projectName)
  console.log(projectData)
  allProjectAudits.push(projectData)

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", `${org}_audit.csv`);
link.innerText = "Download as CSV";
document.body.appendChild(link); // Required for FF

link.click();
}


function buildRequests(){
  let orgLevelApi = `https://sentry.io/api/0/organizations/${org}`
}

function checkItemsInDict(response,dict) {
  
}
/**
 * 
 * @param {*} org 
 * 
 * - For top X mobile projects
- SDK Version (Major version/s behind?)
- √ProGaurd / dSyms / Source maps available?
- Workflows -
    - CodeOwners linked? Code mapping in place?
    √- Assigning/resolving/linking issues?
- **Releases**
  https://sentry.io/api/0/organizations/testorg-az/releases/?adoptionStages=1&flatten=0&per_page=20&project=5808623&status=open
  https://sentry.io/api/0/organizations/testorg-az/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=5808623&query=release:{release} OR release:{release}}&statsPeriod=14d
    √- Creating releases?
    √- Sending sessions?

    https://sentry.io/api/0/organizations/testorg-az/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered
    √- Look for aggregate: "percentage(sessions_crashed, sessions) AS _crash_rate_alert_aggregate"   and dataset:"metrics" to check if CFSR is calculated
    √- Metric Alerts: Does a crash-free rate metric alert exist?
- **EM**
    - Enabling all error types  
    √https://sentry.io/api/0/organizations/testorg-az/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d ios
    https://sentry.io/api/0/organizations/testorg-az/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&sort=-mechanism&statsPeriod=90d android
    (see Deep Audit > [](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) [SDK Utilization via Error Type / Mechanism](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) )
    √- Issue Alerts - exist? + metric alerts - a spike in errors
- **PM**
    √- Enabled/sending transactions?
    - Leveraging all auto instrumentation?  
    (see Deep Audit > [Auto Instrumentation Enabled](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38))
    √- Sending profiles?
 */




async function checkMobileUseCase(org) {
  let projectsChecked = [];
  
  if (mobileProjects.length < 1) {
    console.log('no active mobile projects');
  }
  else {
    let sdkUpdates = await fetch(`https://sentry.io/api/0/organizations/${org}/sdk-updates/`).then((r)=>{return r.json()})
    let iosMechanisms = await fetch(`https://sentry.io/api/0/organizations/${org}/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d`).then((r)=>{return r.json()})
    let alertApi = `https://sentry.io/api/0/organizations/${org}/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered`
    let alerts = await fetch(alertApi).then((r)=> r.json()).then((result => {return result}));
    for ( let project of mobileProjects )  {
      if( !(projectsChecked.includes(project['project'])) ) {
        projectsChecked.push(project['project']);
        let projectApi = `https://sentry.io/api/0/organizations/${org}/projects/?query=${project['project']}`;
        let apiResult = await fetch(projectApi).then((r)=> r.json()).then((result => {return result}));
        apiResult = apiResult.filter( function (element) {
          return element['slug'] == project['project'];
        })[0]
        let sdktoUpgrade = null;
        let projectId = apiResult['id'];
        let projectName = apiResult['slug'];
        let projEnvironmentCount = apiResult['environments'].length;
        let hasMinifiedStacks = apiResult['hasMinifiedStackTrace'] 
        let projOutcomes = projectStats.groups.filter( function (element) { return String(element['by']['project'])==String(projectId) });
        let acceptedCategories = [];
        let acceptedOutcomes = projOutcomes.filter( function (element) { return element['by']['outcome']=='accepted'});
        acceptedOutcomes.forEach(element => {acceptedCategories.push(element['by']['category'])});
        let usingPerformance = acceptedCategories.includes('transaction') || acceptedCategories.includes('transaction_index');
        let usingProfiling = acceptedCategories.includes('profile');
        let usingAttachments = acceptedCategories.includes('attachment');
        let usingReleases = false;
        let usingSessions = false;
        let latestReleases = [];
        let releasesApi = `https://sentry.io/api/0/organizations/${org}/releases/?adoptionStages=1&flatten=0&per_page=20&project=${projectId}&status=open`
        apiResult = await fetch(releasesApi).then((r)=> r.json()).then((result => {return result}));
        if (apiResult.length>2) {
          usingReleases = true;
          latestReleases = apiResult;
        }
        let sdkVersionToUpdate = sdkUpdates.filter( function (element) {
          return element['projectId'] == projectId;
        })

        if (sdkVersionToUpdate.length>0) {
          sdktoUpgrade = sdkVersionToUpdate[0]['sdkVersion'] + '=>' + sdkVersionToUpdate[0]['suggestions'][0]['newSdkVersion'];
        }
        let sessionApi = `https://sentry.io/api/0/organizations/${org}/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=${projectId}`;
        apiResult = await fetch(sessionApi).then((r)=> r.json()).then((result => {return result}));
        let enoughSessions = apiResult['groups'].filter( function (element) { return ( (element['totals']['sum(sessions)'] > 1000) || (element['totals']['sum(session)'] > 1000) ) })
        if (enoughSessions.length > 0) { 
          usingSessions = true;
        }
        let projectAlerts = alerts.filter( function (element) { return element['projects'].includes(projectName) })
        let metricAlerts = projectAlerts.filter( function(element) { return element['dataset'] == 'metrics'})
        let crashFreeAlerts = metricAlerts.filter( function(element) { return element['aggregate'].includes('percentage(sessions_crashed, sessions)')}).length>0
        let assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved%20is%3Aassigned&shortIdLookup=1&statsPeriod=14d`
        let assigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')})
        assigned = Number(assigned) 
        assignmentApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=14d`
        let unAssigned = await fetch(assignmentApi).then((r)=> {return r.headers.get('x-hits')}) 
        unAssigned = Number(unAssigned)
        let unResolved = unAssigned
        unAssigned = unAssigned - assigned
        let ownershipRulesApi = `https://sentry.io/api/0/projects/${org}/${projectName}/ownership/`
        let ownershipRulesSet = await fetch(ownershipRulesApi).then((r)=> r.json()).then((result => {return result}));

        ownershipRulesSet = ownershipRulesSet['raw'] != null
        let assignmentPercentage = ( (assigned* 100) / (unAssigned+assigned) ) 
        let useResolveWorkflow = false;
        let resolvedApi = `https://sentry.io/api/0/organizations/${org}/issues/?collapse=stats&expand=owners&expand=inbox&limit=25&project=${projectId}&query=is%3Aresolved&shortIdLookup=1&statsPeriod=14d`
        let resolved = await fetch(resolvedApi).then((r)=> {return r.headers.get('x-hits')}) 
        resolved = Number(resolved) 
        let resolvedPercentage = ( (resolved*100) / (resolved+unResolved) )
        if (resolvedPercentage > 5 || resolved > 1000) {useResolveWorkflow=true;} // Adding resolved
        let usesAllErrorTypes = false; // Convert this from true/false to displaying which error types exist/don't exist
        let iosMechanismsUsed = iosMechanisms[9]['topValues'].filter(function (element) { return element['name']==projectName}).length > 0
        let androidMechanisms = await fetch(`https://sentry.io/api/0/organizations/${org}/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&sort=-mechanism&statsPeriod=90d`).then((r)=>{return r.json()})
        let androidMechanismsUsed = androidMechanisms['data'].length>0;
        let hasDesymbolicationFiles = false;
        let proguardApi = `https://sentry.io/api/0/projects/${org}/${projectName}/files/dsyms/?file_formats=proguard`
        let dsymApi = `https://sentry.io/api/0/projects/${org}/${projectName}/files/dsyms/?file_formats=breakpad&file_formats=macho&file_formats=elf&file_formats=pe&file_formats=pdb&file_formats=sourcebundle&file_formats=wasm&file_formats=bcsymbolmap&file_formats=uuidmap&file_formats=il2cpp&file_formats=portablepdb`
        let sourcemapApi = `https://sentry.io/api/0/projects/${org}/${projectName}/releases/{replace_release}/files/`
        apiResult = [];
        switch(project['sdk.name']) {
          case 'sentry.cocoa':
            apiResult = await fetch(dsymApi).then((r)=> r.json()).then((result => {return result}));
            break;
          case 'sentry.java.android':
            apiResult = await fetch(proguardApi).then((r)=> r.json()).then((result => {return result}));
            break;
          case 'sentry.javascript.react-native':
            apiResult = await fetch(sourcemapApi.replace('{replace_release}',latestReleases[0]['version'])).then((r)=> r.json()).then((result => {return result}));
            if (apiResult.length < 1) {
              for(var i = 1; i < latestReleases.length; i++) {
                apiResult = await fetch(sourcemapApi.replace('{replace_release}',latestReleases[i]['version'])).then((r)=> r.json()).then((result => {return result}));
                if (apiResult.length > 1) {
                  i=latestReleases.length+1;
                }
              }
            }
            break;
        }
        // TODO check against 'hasminifiedstacktraces' and see if there's discrepancies
        if (apiResult.length > 0) {hasDesymbolicationFiles=true;}
        if (!(hasDesymbolicationFiles && (!hasMinifiedStacks))) {hasDesymbolicationFiles=false;}
        let projectData = {
          'projectName':projectName,'projectId':projectId,'environments':projEnvironmentCount>1,'hasDesymFiles':hasDesymbolicationFiles,
          'upgradeSdk':sdktoUpgrade,'useAllErrorTypes':iosMechanismsUsed || androidMechanismsUsed,'useResolveWorkflow':useResolveWorkflow,'assignments':assignmentPercentage,'ownershipRules':ownershipRulesSet,
          'sessions':usingSessions,'releases':usingReleases,'attachments':usingAttachments,'profiles':usingProfiling,'performance':usingPerformance,
          'alerts':projectAlerts.length>0,'metricAlerts':metricAlerts.length>0,"Crash Free Alerts":crashFreeAlerts
        };
        
      /**
 *  'Project Name','Project Id','Project Uses Environments?','Project has minified Stacktraces?', 'Issue Workflow is used? (Issues get Resolved)',
    '% Of issues that are assigned', 'Sessions are being sent?', 'Releases are being created?', 'Attachments are being sent?', 'Profiles are being used?',
    'Performance is used in this project?', 'Project has alerts set up?', 'Project has metric alerts set up?', 'Project has a CFSR Alert?'
 */   
      let row = []
      for (let key in projectData) {
        row.push(projectData[key])
      }
      outputRows.push(row);
      console.log(row)
      // console.log(outputRows)
      // let csvContent = "data:text/csv;charset=utf-8," 
      //     + rows.map(e => e.join(",")).join("\n");
      //   console.log(projectName)
      //   console.log(projectData)
      allProjectAudits.push(projectData)
      
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", `${org}_audit.csv`);
      // link.innerText = "Download as CSV";
      // // document.body.appendChild(link); // Required for FF
      //   console.log(projectName)
      //   console.log(projectData)
      let dropRateRow = []

        aggregateProjects[projectId][0].forEach( element => {
          // console.log(element + " is dropping at alarming rate - " +(((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100') + "%")
          // console.log(aggregateProjects[projectId][2][element] + " dropped vs. " + (aggregateProjects[projectId][1][element] || 'none') + ' accepted.')
          dropRateRow.push([
            projectName, element, (((aggregateProjects[projectId][2][element]*100)/(aggregateProjects[projectId][2][element]+aggregateProjects[projectId][1][element])) || '100'),
            aggregateProjects[projectId][2][element],(aggregateProjects[projectId][1][element] || 'none')
          ])
        })
        console.log(dropRateRow)
        dropRateDataRows.push(dropRateRow)
        allProjectAudits.push(projectData)
      }
    }
    // console.log(outputRows)
    // console.log(dropRateDataRows)
  }

}

/**
 * 
 * Org level stats that I need to pull
 * 
 * Integrations:
 * https://sentry.io/api/0/organizations/testorg-az/sentry-app-installations/ - check for internal integrations
 * https://sentry.io/api/0/organizations/testorg-az/plugins/configs/ - check for which integrations have configs
 * √Check for Source Control Management
 * √Check for Notification software (Slack, MS Teams, Pagerduty)
 * √Check for Issue tracking (JIRA, Azure DevOPs)
 **/


async function checkIntegrations(org) {
  let sourceControlDict = ['github','bitbucket','gitlab'];
  let messagingDict = ['slack','ms-teams','teams'];
  let issueTrackingDict = ['JIRA','jira','azure'];
  // let internalIntegrationApi = `https://sentry.io/api/0/organizations/${org}/sentry-app-installations/`
  let integrationApi = `https://sentry.io/api/0/organizations/${org}/plugins/configs/`;
  // let internalIntegrations = await fetch(internalIntegrationApi).then((r)=> r.json()).then((result => {return result}))
  let externalIntegrations = await fetch(integrationApi).then((r)=> r.json()).then((result => {return result}));
  // console.log(externalIntegrations)
  var scmIntegrations = externalIntegrations.filter( function (element) {
    return sourceControlDict.includes(element.id);
  });
  var messagingIntegrations = externalIntegrations.filter( function (element) {
    return messagingDict.includes(element.id);
  });
  var issueIntegrations = externalIntegrations.filter( function (element) {
    return issueTrackingDict.includes(element.id); 
  });
  // console.log(scmIntegrations);
  // console.log(messagingIntegrations);
  // console.log(issueIntegrations);
  // let integrationUsage = {'soureControlUsed':scmIntegrations.length>0,'messagingIntegrationUsed':messagingIntegrations.length>0,'issueTrackingUsed':issueIntegrations.length>0}
  outputRows[4][3] = messagingIntegrations.length>0;
  outputRows[4][4] = scmIntegrations.length>0;
  outputRows[4][5] = issueIntegrations.length>0;

  orgObject.messageIntegration = messagingIntegrations.length > 0;
  orgObject.usesScm = scmIntegrations.length > 0;
  orgObject.usesIssueInt = issueIntegrations.length > 0;
  // console.log(integrationUsage);
}  


 /** 
 * Auth:
 * 
 * 
 * https://sentry.io/api/0/organizations/testorg-az/auth-provider/
 * 
 * Check if SSO is enabled - require_link
 * Check if SCIM is enabled - scim_enabled
 * 
 * If no SSO altogether then http response will be code 204
 * 
 * 
 * Audit log:
 * 
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/
 * https://sentry.io/api/0/organizations/testorg-az/audit-logs/?cursor=1671754313751%3A0%3A0
 * 
 * Check if projects were created recently
 * Check if Teams were created recently
 * Check projectKey.edit
 * 
 * 
 * Stats:
 * https://sentry.io/api/0/organizations/testorg-az/projects/ - project list
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?field=sum%28quantity%29&groupBy=category&groupBy=outcome&interval=1h&project=-1&statsPeriod=14d - orgwide outcomes for transactions/errors/others
 * https://sentry.io/api/0/organizations/testorg-az/stats_v2/?category=error&field=sum%28quantity%29&groupBy=outcome&groupBy=project&interval=1h&project=-1&statsPeriod=14d - dropped/accepted per project
 * Check if any projects have significant dropped/filtered stats
 * 
 * Check if projects with large percentage of events have 
 */


/**
 * 
 * Use Case: Mobile
 * 
 * Mobile SDK names:
 * sentry.java.android
 * sentry.cocoa
 * sentry.javascript.react-native
    - Does use-case exist? (i.e relevant sdks sending ~meaningful traffic)
    https://sentry.io/api/0/organizations/testorg-az/events/?field=project&field=sdk.name&field=sdk.version&field=count%28%29&per_page=50&query=&referrer=api.discover.query-table&sort=-count&statsPeriod=14d
    - For top X mobile projects
        - SDK Version (Major version/s behind?)
        - ProGaurd / dSyms / Source maps available?
        - Workflows -
            - CodeOwners linked? Code mapping in place?
            - Assigning/resolving/linking issues?
        - **Releases**
          https://sentry.io/api/0/organizations/testorg-az/releases/?adoptionStages=1&flatten=0&per_page=20&project=5808623&status=open
          https://sentry.io/api/0/organizations/testorg-az/sessions/?field=sum%28session%29&groupBy=project&groupBy=release&groupBy=session.status&interval=1d&project=5808623&query=release:{release} OR release:{release}}&statsPeriod=14d
            - Creating releases?
            - Sending sessions?

            https://sentry.io/api/0/organizations/testorg-az/combined-rules/?expand=latestIncident&expand=lastTriggered&sort=incident_status&sort=date_triggered&team=myteams&team=unassigned
            - Look for aggregate: "percentage(sessions_crashed, sessions) AS _crash_rate_alert_aggregate"   and dataset:"metrics" to check if CFSR is calculated
            - Metric Alerts: Does a crash-free rate metric alert exist?
        - **EM**
            - Enabling all error types  
            https://sentry.io/api/0/organizations/testorg-az/events-facets/?query=mechanism%3A%5BHTTPClientError%2C%20AppHang%2C%20out_of_memory%5D&statsPeriod=14d ios
            https://sentry.io/api/0/organizations/testorg-az/events/?field=mechanism&field=count%28%29&per_page=50&query=sdk.name%3Asentry.java.android%20%21event.type%3Atransaction%20mechanism%3A%5BSentryOkHttpInterceptor%2CANR%5D&referrer=api.discover.query-table&sort=-mechanism&statsPeriod=90d android
            (see Deep Audit > [](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) [SDK Utilization via Error Type / Mechanism](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38) )
            - Issue Alerts - exist? + metric alerts - a spike in errors
        - **PM**
            - Enabled/sending transactions?
            - Leveraging all auto instrumentation?  
            (see Deep Audit > [Auto Instrumentation Enabled](https://www.notion.so/Deep-Audit-Ideas-2e1346e6461a4df8a92cd53379023e38))
            - Sending profiles?
 * 
 */