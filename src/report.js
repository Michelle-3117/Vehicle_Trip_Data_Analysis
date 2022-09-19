const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  let newData = await getTrips();



  //to get my driver information
  driversID = []
  for(let i of newData){
  if(!driversID.includes(i.driverID)){
  driversID.push(i.driverID)
    }
  }

let resolvedDriverInfo = []
let driverInfo = []
  for(let i of driversID){
  driverInfo.push(getDriver(i));
}
const fulfilledDriverInfo = await Promise.allSettled(driverInfo);
for(let element of fulfilledDriverInfo){
  if(element['status'] === "fulfilled"){
  resolvedDriverInfo.push(element)
  };
}
//console.log(resolvedDriverInfo)

//to get the total number of trips per driver
let tripInfo = {};
  for(let i of newData){
    if(tripInfo[i.driverID]){
      tripInfo[i.driverID]++
    }
    else {
      tripInfo[i.driverID] = 1
    }
  
  }
  let tripInfo2 = Object.values(tripInfo);


  
  //to get my vehicle information
  let vehiclesID = [];
  for(let i of resolvedDriverInfo){
    if(!vehiclesID.includes(i.value.vehicleID)){
      vehiclesID.push(i.value.vehicleID)
      }
  }
  let resolvedVehicleInfo = []
  let vehicleInfo = []
  for(let i of vehiclesID){
    vehicleInfo.push(getVehicle(i));
  }
  const fulfilledVehicleInfo = await Promise.allSettled(vehicleInfo);
  for(let element of fulfilledVehicleInfo){
    if(element['status'] === "fulfilled"){
    resolvedVehicleInfo.push(element)
    }
  }
  
  let vehicle2;
  for(let i in resolvedVehicleInfo){
    vehicle2 = {};
    vehicle2['plate'] = resolvedVehicleInfo[i].value.plate
    vehicle2['manufacturer'] = resolvedVehicleInfo[i].value.manufacturer
    //console.log(vehicle2)
  };


  //to get the noOfCashTrips
  let cashTripInfo = {};
  let nonCashTripInfo = {};
  for(let i of newData){
    if (i.isCash === true){
      if(cashTripInfo[i.driverID]){// tripinfo['abc]
        cashTripInfo[i.driverID]++
      }
      else {
        cashTripInfo[i.driverID] = 1
      }
    }
    else {
      if(nonCashTripInfo[i.driverID]){// tripinfo['abc]
        nonCashTripInfo[i.driverID]++
      }
      else {
        nonCashTripInfo[i.driverID] = 1
      }
    }
  }
  let noOfCashTrips = Object.values(cashTripInfo);
  let noOfNonCashTrips = Object.values(nonCashTripInfo)
  // console.log(noOfCashTrips);
  // console.log(noOfNonCashTrips);
  // console.log(nonCashTripInfo);


  //to get the total amount earned for each driver
  let totalEarnInfo = {};
  for(let i of newData){
    if(totalEarnInfo[i.driverID]){
      totalEarnInfo[i.driverID] += parseFloat(String(i["billedAmount"]).split(',').join(''))
    }else{
      totalEarnInfo[i.driverID] = parseFloat(String(i["billedAmount"]).split(',').join(''))
    }
  }
  let totalAmountEarned = Object.values(totalEarnInfo)
  //console.log(totalEarnInfo);

  //to get the total cash and non-cash amount for each driver
  let totalCashAmt = {};
  let totalNonCashAmt = {}
  for(let i of newData){
    if(i.isCash === true){
      if(totalCashAmt[i.driverID]){
        totalCashAmt[i.driverID] +=  parseFloat(String(i["billedAmount"]).split(',').join(''))
      }
      else{
        totalCashAmt[i.driverID] = parseFloat(String(i["billedAmount"]).split(',').join(''));
      }
    }
    if(i.isCash === false){
      if(totalNonCashAmt[i.driverID]){
        totalNonCashAmt[i.driverID] +=  parseFloat(String(i["billedAmount"]).split(',').join(''))
      }
      else{
        totalNonCashAmt[i.driverID] = parseFloat(String(i["billedAmount"]).split(',').join(''));
      }
    }
  }
  let totalCashAmount = Object.values(totalCashAmt);
  let totalNonCashAmount = Object.values(totalNonCashAmt);
  // console.log(totalCashAmount);
  // console.log(totalNonCashAmount)

// to get my user trips info for my newData;
let usertrip;
for(let elem in newData){
    usertrip = {};
    usertrip['user'] = newData[elem].user.name;
    usertrip['created'] = newData[elem].created;
    usertrip['pickup'] = newData[elem].pickup;
    usertrip['destination']= newData[elem].destination;
    usertrip['billed'] = newData[elem].billedAmount;
    usertrip['isCash'] = newData[elem].isCash;

    //console.log(usertrip)
  }





// output of driverDetails;
let testArr = []
for(let elem in resolvedDriverInfo){
  let driverDetails = {};
 if(resolvedDriverInfo[elem]){
   driverDetails['fullName'] = resolvedDriverInfo[elem].value.name;
   driverDetails['id'] = driversID[elem];
   driverDetails['phone'] = resolvedDriverInfo[elem].value.phone;
   driverDetails['noOfTrips'] = tripInfo2[elem];
   driverDetails['noOfVehicles'] = ((resolvedDriverInfo[elem].value.vehicleID).length);
   driverDetails['vehicle'] = [];
   driverDetails['vehicle'].push(vehicle2);
   driverDetails['noOfCashTrips'] = noOfCashTrips[elem];
   driverDetails['noOfNonCashTrips'] = noOfNonCashTrips[elem];
   driverDetails['totalAmountEarned'] = +(totalAmountEarned[elem]).toFixed(2);
   driverDetails['totalCashAmount'] = +(totalCashAmount[elem]);
   driverDetails['totalNonCashAmount'] = +(totalNonCashAmount[elem]).toFixed(2);
   driverDetails['trips'] = [];
   driverDetails['trips'].push(usertrip)
 }
 testArr.push(driverDetails)
}
return testArr;
//console.log(testArr);

}
//console.log(driverReport())
module.exports = driverReport;
