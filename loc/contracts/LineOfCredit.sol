pragma solidity ^0.4.17;

contract LineOfCredit{

  address public buyer_bank;
  address public buyer;
  address public seller_bank;
  address public seller;
  bytes32 public deal_document_hash;
  string public status;
  event LogDocumentProof(bytes32 document_hash);
  event LogStatusChange(string new_status);

  /* Constructor function */
  function LineOfCredit() public{
    buyer_bank = msg.sender;
  }

  /* function modifier */
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

  /* only buyer bank can invoke this function*/
  function SubmitDeal(address buyer_address, address seller_address, string deal_document) public onlyBuyerBank {
    buyer = buyer_address;
    seller = seller_address;
    storeDealDocument(deal_document);
  }

  function createSellerBank(address seller_bank_addresss) public onlySeller{
    seller_bank = seller_bank_addresss;
  }

  function getProof(string document)  private pure returns (bytes32) {
    return sha256(document);
  }

  function storeDealDocument(string document)private{
    deal_document_hash = getProof(document);
    LogDocumentProof(deal_document_hash);
  }

   function updateGoodsDispatched() public onlySeller{
     status= "GoodsDispatched";
     LogStatusChange(status);
   }

   function updateGoodsReceived() public onlyBuyer{
      status = "GoodsReceived";
      LogStatusChange(status);
   }

   function updateMoneyTransferred() public onlyBuyerBank{
      status = "MoneyTrasnferred";
      LogStatusChange(status);
   }

   function updateMoneyReceived() public onlySellerBank{
      status = "MoneyReceived";
      LogStatusChange(status);
   }
}
