const hre = require("hardhat");

async function main() {
  // const [addr1, addr2] = await hre.ethers.getSigners();
  // addr1 = "0x35D5AcD394FFF9D5266C90447E9F2aC51d42CB10";
  // addr2 = "0xA76199ac02B1c5BFF9B7ce1B83abE4fEF05446Fd";
  // Marriage deploy
  const marriage = await hre.ethers.getContractFactory("Marriage");
  const marr = await marriage.deploy();
  await marr.deployed();
  //Marriage test
  // await marr.setSpouse(addr1, addr2).then((x) => {
  //   console.log(x.logs);
  // });
  // await marr.setSpouse(addr1, addr2).then((x) => {
  //   console.log(x);
  // });
  // await marr.setSpouse(addr1, addr2).then((x) => {
  //   console.log(x);
  // });
  // await marr.setSpouse(addr1, addr2).then((x) => {
  //   console.log(x);
  // });

  // marr.husbandAddress().then((val) => {
  //   console.log("Husband Address:", val);
  // });
  // marr.wifeAddress().then((val) => {
  //   console.log("Wife Address:", val);
  // });
  // await marr.signContract(12345678, "Abhijit", "123", "asdad", "asdasdasd");

  // await marr
  //   .connect(addr2)
  //   .signContract(12345678, "Abhijit", "123", "asdad", "asdasdasd");

  // await marr.signed().then((val) => {
  //   console.log("Both Signed:", val);
  // });
  // await marr.divorced().then((val) => {
  //   console.log("Divorced", val);
  // });

  // await marr.divorce();
  // await marr.connect(addr2).divorce();
  // await marr.divorced().then((val) => {
  //   console.log("Divorced", val);
  // });

  //ShopRental deploy
  const shopRental = await hre.ethers.getContractFactory("ShopRental");
  const sr = await shopRental.deploy();
  await sr.deployed();

  // Patent deploy
  const patent = await hre.ethers.getContractFactory("PatentOwnershipTransfer");
  const pt = await patent.deploy();
  await pt.deployed();
  //Patent Testing
  // await pt.setParams(addr1.address, addr2.address, "p12345", 1, "Maharashtra");
  // await pt.licensor().then((val) => {
  //   console.log("Licensor:", val);
  // });
  // await pt.licensee().then((val) => {
  //   console.log("Licensee:", val);
  // });
  // await pt.patent_number().then((val) => {
  //   console.log("patent_no:", val);
  // });
  // await pt.amount().then((val) => {
  //   console.log("Amount:", val);
  // });
  // await pt.createdTimestamp().then((val) => {
  //   console.log("Time:", val);
  // });
  // await pt.signed().then((val) => {
  //   console.log("Both signed:", val);
  // });
  // await pt.signLicensor(123123123123, "Abhijit", "someaddresshere");
  // const amount = { value: 1 };
  // await pt
  //   .connect(addr2)
  //   .signLicensee(123123123324, "bhushan", "someaddressheretooo", amount);
  // await pt.signed().then((val) => {
  //   console.log("Both signed:", val);
  // });

  console.log("Address of Marriage contract:", marr.address);
  console.log("Address of ShopRental Contract:", sr.address);
  console.log("Address of patent Contract:", pt.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
