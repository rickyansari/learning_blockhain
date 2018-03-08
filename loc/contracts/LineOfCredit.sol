pragma solidity ^0.4.17;

contract LineOfCredit {
  address private buyer_bank;
  address private buyer;
  address private seller_bank;
  address private seller;
  bytes32 private loc_document_hash;
  string private status;
  event LogStatusChange(string new_status);

  /* Constructor function */
  function LineOfCredit( address buyer_address, address seller_address, string loc_document) public{
    buyer_bank = msg.sender;
    buyer = buyer_address;
    seller = seller_address;
    storetLocDocumentHash(loc_document);
    status = "LocCreated";
  }

  function getLocDocumentHash()public view returns(bytes32) {
    return loc_document_hash;
  }

  function getContractStatus()public view returns(string) {
    return status;
  }

  function storetLocDocumentHash(string loc_document) private {
    loc_document_hash = getProof(loc_document);
  }

  function getProof(string document) private pure returns (bytes32) {
    return sha256(document);
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
    status = "LocNotPresented";
    LogStatusChange(status);
  }

  function updateLocPresented() public onlyBuyer {
    status = "LOCPresentedToSeller";
    LogStatusChange(status);
  }

  function updateValidation() public onlyBuyer {
    status = "Validation";
    LogStatusChange(status);
  }

  function updateValidated() public onlySellerBank {
    status = "Validated";
    LogStatusChange(status);
  }

  function updateGoodsDispatched() public onlySeller {
    status= "GoodsDispatched";
    LogStatusChange(status);
  }

  function updateGoodsReceived() public onlyBuyer {
    status = "GoodsReceived";
    LogStatusChange(status);
  }

  function updateMoneyTransferred() public onlyBuyerBank {
    status = "MoneyTrasnferred";
    LogStatusChange(status);
  }

  function updateMoneyReceived() public onlySellerBank {
    status = "MoneyReceived";
    LogStatusChange(status);
  }
}
