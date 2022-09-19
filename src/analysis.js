import { getTrips, getDriver } from 'api';

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  let totalBilledAmount = 0;
  let isCash = 0;
  let totalIsCash = 0;
  let totalIsNonCash = 0;
  let nonCash = 0;
  let output;
  
  const data = await getTrips();
  //console.log(data);

  for(let element of data){
    if(element["isCash"]=== true){
    isCash++;
    totalIsCash += parseFloat(String(element["billedAmount"]).split(',').join(''));
    }
    else if(element["isCash"] === false){
    nonCash++;
    totalIsNonCash += parseFloat(String(element["billedAmount"]).split(',').join(''));
    }
  
    totalBilledAmount += parseFloat(String(element["billedAmount"]).split(',').join(''))
 
  }
  //to get the unique driverID by looping through data and ensuring zero duplicity.
  driversID = []
    for(let i of data){
    if(!driversID.includes(i.driverID)){
    driversID.push(i.driverID)
    }
  }
// console.log(driversID)
  let driverInfo = []
    for(let i of driversID){
    driverInfo.push(getDriver(i));
  }
  
  let resolvedDriverInfo = [];
  let noOfDriversWithMoreVehicle = 0;
 
  //to get a resolved data on driverInfo because of error "driver not found".
  const fulfilledDriverInfo = await Promise.allSettled(driverInfo)
  for(let element of fulfilledDriverInfo){
    if(element['status'] === "fulfilled"){
    resolvedDriverInfo.push(element)
    }
  }
//  console.log( resolvedDriverInfo)
  for(let element in resolvedDriverInfo){
    if(((resolvedDriverInfo[element].value.vehicleID).length) > 1){
    noOfDriversWithMoreVehicle++;
    }
  }
 
  //to get the driver with highest number of trips
  //console.log(data)
  let tripInfo = {};
  for(let i of data){
    if(tripInfo[i.driverID]){// tripinfo['abc]
      tripInfo[i.driverID]++
    }
    else {
      tripInfo[i.driverID] = 1
    }
  
  }
  let newValues = Object.values(tripInfo);
  let maxTripValues = Math.max(...newValues);
  let indexMaxTripsByDriver = newValues.indexOf(maxTripValues);
  //console.log(maxTripValues);
  
  let earnInfo = {};
  for(let i of data){
    if(earnInfo[i.driverID]){
      earnInfo[i.driverID] += parseFloat(String(i["billedAmount"]).split(',').join(''))
    }else{
      earnInfo[i.driverID] = parseFloat(String(i["billedAmount"]).split(',').join(''))
    }
  }
    let newValues2 = Object.values(earnInfo);
    let maxEarnValues = Math.max(...newValues2);
    let indexOfHighestEarningDriver = newValues2.indexOf(maxEarnValues)
    //console.log(maxEarnValues);
  
    //computing the output
    output = {};
    output['noOfCashTrips'] = isCash;
    output['noOfNonCashTrips'] = nonCash;
    output['billedTotal'] = Number(totalBilledAmount.toFixed(2));
    output['cashBilledTotal'] = Number(totalIsCash.toFixed(2));
    output['nonCashBilledTotal'] = Number(totalIsNonCash.toFixed(2));
    output['noOfDriversWithMoreThanOneVehicle'] = noOfDriversWithMoreVehicle;
    output['mostTripsByDriver'] = {};
    output['mostTripsByDriver']['name'] = resolvedDriverInfo[indexMaxTripsByDriver].value['name'];
    output['mostTripsByDriver']['email'] = resolvedDriverInfo[indexMaxTripsByDriver].value['email']
    output['mostTripsByDriver']['phone'] = resolvedDriverInfo[indexMaxTripsByDriver].value['phone']
    output['mostTripsByDriver']['noOfTrips'] = newValues[indexMaxTripsByDriver]
    output['mostTripsByDriver']['totalAmountEarned'] = newValues2[indexMaxTripsByDriver];
    output['highestEarningDriver'] = {};
    output['highestEarningDriver']['name'] = resolvedDriverInfo[indexOfHighestEarningDriver].value['name'];
    output['highestEarningDriver']['email'] = resolvedDriverInfo[indexOfHighestEarningDriver].value['email'];
    output['highestEarningDriver']['phone'] = resolvedDriverInfo[indexOfHighestEarningDriver].value['phone'];
    output['highestEarningDriver']['noOfTrips'] = newValues[indexOfHighestEarningDriver];
    output['highestEarningDriver']['totalAmountEarned'] = maxEarnValues;
    
    //console.log(output);
    return output;
}
export default analysis;




//console.log(await analysis())
// console.log(driverInfo())
