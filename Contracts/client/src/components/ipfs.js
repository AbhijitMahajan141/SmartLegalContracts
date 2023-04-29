import axios from "axios";
const FormData = require("form-data");

export async function connect() {
  try {
    await axios
      .get(
        "https://api.pinata.cloud/data/testAuthentication",

        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
          },
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log(res.data);
  } catch (e) {
    console.error(e);
  }
}

export const pinFileToPinata = async (file, userId) => {
  // console.log(file);
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();
  data.append("file", file, `${Date.now()}-${file.name}`);
  data.append("pinataMetadata", JSON.stringify({ keyvalues: { uid: userId } }));

  const headers = {
    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
  };
  await axios.post(url, data, { headers });
  // .then(function (response) {
  //   alert("File Uploaded Successfully!!!");
  // })
  // .catch(function (error) {
  //   alert("Something went wrong!" + error);
  // });
  //   console.log(response.data);
  //   return response.data.IpfsHash;
};

export const fetchFileFromPinata = async (uid) => {
  JSON.stringify({ uid });
  const url = `https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues]={"uid":{"value":"${uid}","op":"eq"}}`;
  const config = {
    headers: {
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
    },
  };
  const response = await axios.get(url, config);
  // .then(function (res) {
  //   console.log(res.data.rows);
  //   return res.data.rows;
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  return response.data.rows;
};
