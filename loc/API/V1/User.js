var {usersDetail} = require('./UsersDetail');

checkUserAuthenticity= (params)=>{
  isAuthentic =  false;
  if(params.userName && usersDetail[params.userName]){
    if((usersDetail[params.userName].password === params.password)){
      isAuthentic= true;
    }
  }
  return isAuthentic;
}

module.exports ={
  checkUserAuthenticity: checkUserAuthenticity,
}
