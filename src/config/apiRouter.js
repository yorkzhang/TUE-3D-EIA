global.APIROUTER = {
  geo: {
    getrangetrainedlist: APIURL.API + 'geo/getrangetrainedlist',
    updatetraineddata: APIURL.API + 'geo/updatetraineddata',
    getgeotrainedjsonbyid: APIURL.API + 'geo/getgeotrainedjsonbyid',
  },
  projecttextent: {
    uploadjsonfile: APIURL.API + "projecttextent/uploadjsonfile",
    bufferAnalysis: APIURL.API + "projecttextent/bufferanalysis",
    getprojectextentbyjsonobject: APIURL.API + "projecttextent/getprojectextentbyjsonobject",
  },
  view: {
    getallspecies: APIURL.API + "habitatcategoryspecies/getallspecies",
    getimportspecies: APIURL.API + "habitatcategoryspecies/getimportspecies"
  }
}