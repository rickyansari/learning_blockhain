pragma solidity ^0.4.17;

contract LineOfCredit {
  address private buyer_bank;
  address private buyer;
  address private seller_bank;
  address private seller;
  bytes32 private loc_document_hash;
  string private status;
  string private shipmentId;
  string private transactionId;
  enum Statuses { GoLeft, GoRight, GoStraight, SitStill }
  Statuses private currentStatus;
  event LogStatusChange(string new_status);

  /* Constructor function */
  function LineOfCredit( address buyer_address, address seller_address, string loc_document) public{
    buyer_bank = msg.sender;
    buyer = buyer_address;
    seller = seller_address;
    storetLocDocumentHash(loc_document);
    status = "LocCreated";
    currentStatus = Statuses.GoLeft;
  }

  function getLocDocumentHash()public view returns(bytes32) {
    return loc_document_hash;
  }

  function getContractStatus()public view returns(string) {
    return status;
  }
   function getCurrentStatus()public view returns(uint) {
    return uint(currentStatus);
  }
function getShipmentId()public view returns(string) {
    return shipmentId;
  }

  function getTransactionId()public view returns(string) {
    return transactionId;
  }
  function storetLocDocumentHash(string loc_document) private {
    loc_document_hash = getProof(loc_document);
  }

  function getProof(string document) private pure returns (bytes32) {
    return sha256(document);
  }

  function verifyLocDocument(string locDoc) public view returns(bool) {
    if (getLocDocumentHash() == getProof(locDoc))
      return true;
    return false;
  }
  modifier onlyBuyerBank(){
    require(msg.sender == buyer_bank);
    _;
  }

  modifier onlySeller(){
    require(msg.sender == seller);
    _;
  }

  modifier onlyBuyer(){
    require(msg.sender == buyer);
    _;
  }

  modifier onlySellerBank(){
    require(msg.sender == seller_bank);
    _;
  }

  function createSellerBank(address seller_bank_addresss) public onlySeller { 
    seller_bank = seller_bank_addresss;
    LogStatusChange(status);
  }

  function compareStrings (string a, string b) private pure returns (bool) {
       return keccak256(a) == keccak256(b);
   }

  function updateLocPresented() public onlyBuyer {
    if (compareStrings(status, "LocCreated"))
      status = "LOCPresentedToSeller";
    LogStatusChange(status);
  }

  function updateValidation() public onlySeller {
    if (seller_bank != address(0)) {
      if (compareStrings(status, "LOCPresentedToSeller"))
         status = "LOCPresentedForValidation";
    LogStatusChange(status);
    }
  }

  function updateValidated() public onlySellerBank {
   
      if (compareStrings(status, "LOCPresentedForValidation"))
         status = "LOCValidated";
    LogStatusChange(status);
  }

  function updateGoodsDispatched() public onlySeller {
    if (compareStrings(status, "LOCValidated")) 
      status = "GoodsDispatched";
    LogStatusChange(status);
  }

function setShipmentId(string shipid) public onlySeller {
    shipmentId = shipid;
    LogStatusChange(status);
}

  function updateGoodsReceived() public onlyBuyer {
    if (compareStrings(status, "GoodsDispatched"))
      status = "GoodsReceived";
    LogStatusChange(status);
  }

  function updateMoneyTransferred() public onlyBuyerBank {
    if (compareStrings(status, "GoodsReceived"))
      status = "MoneyTransferred";
    LogStatusChange(status);
  }

function setTransactionId(string transcid) public onlyBuyerBank {
   transactionId = transcid;
    LogStatusChange(status);
  }
  function updateMoneyReceived() public onlySellerBank {
    if (compareStrings(status, "MoneyTransferred"))
      status = "MoneyReceived";
    LogStatusChange(status);
  }
}
