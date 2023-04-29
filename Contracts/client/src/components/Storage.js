import "./Storage.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchFileFromPinata, pinFileToPinata } from "./ipfs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosCloudUpload } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
// import axios from "axios";

const Storage = ({ account }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [response, setResponse] = useState([]);
  const [content, setContent] = useState("");

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const changeHandler = useCallback((event) => {
    setSelectedFile(event.target.files[0]);
  }, []);

  useEffect(() => {
    if (selectedFile instanceof Blob || selectedFile instanceof File) {
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      setLoading(true);
      pinFileToPinata(selectedFile, account)
        .then(function (res) {
          fileInputRef.current.value = null;
          // hiddenFileInput.current.value = null;
          setFileUrl(null); // Hide the preview
          setSelectedFile(null); // Reset the selected file
          setLoading(false);
          toast.success("File uploaded successfully!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
        .catch(function (e) {
          console.log(e);
          toast.error("Something went wrong:" + e, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        });
    } else {
      toast.warning("Please select a file to Upload!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    if (account) {
      let res = await fetchFileFromPinata(account);
      console.log(res);
      setResponse(res);
      try {
        // res.map((f)={});
        const resp = await fetch(
          `https://ipfs.io/ipfs/${res[0].ipfs_pin_hash}`
        );
        const blob = await resp.blob();
        setContent(URL.createObjectURL(blob));
      } catch (error) {
        toast.error("Error: " + error, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      toast.warning("Please Connect to Metamask!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  // const image = async (hash) => {
  //   try {
  //     const res = await fetch(`https://ipfs.io/ipfs/${hash}`);
  //     const blob = await res.blob();
  //     setContent(URL.createObjectURL(blob));
  //   } catch (error) {
  //     toast.error("Error: " + error, {
  //       position: toast.POSITION.BOTTOM_CENTER,
  //     });
  //   }

  //   // setContent(res.data);
  // };

  return (
    <div className="storageCont">
      <div className="upload">
        <span style={{ color: "#8DD8E8", fontSize: "30px" }}>
          Store Your Contracts
        </span>
        <form className="form">
          <label
            htmlFor="file"
            style={{ margin: "5px", fontSize: "18px", color: "#8DD8E8" }}
          >
            Select file to be uploaded:
          </label>
          <div className="file-input-container">
            <label
              htmlFor="file"
              className="custom-file-upload"
              onClick={handleClick}
            >
              <IoIosCloudUpload style={{ marginRight: "5px" }} /> Choose File
            </label>
            <span
              style={{ color: "whitesmoke", marginLeft: ".5rem" }}
              ref={fileInputRef}
            >
              {selectedFile ? selectedFile.name : "Choose a File"}
            </span>
            <input
              type="file"
              className="file"
              id="file"
              onChange={changeHandler}
              ref={hiddenFileInput}
              style={{
                border: "none",
                margin: "5px",
                paddding: "5px",
                color: "black",
                backgroundColor: "white",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
              // multiple
            />
          </div>

          {/* {fileUrl && ( */}
          <iframe
            ref={iframeRef}
            title="Preview"
            src={fileUrl}
            width="100%"
            height="400px"
            style={{
              border: "none",
              borderRadius: "10px",
            }}
          ></iframe>
          {/* )} */}
          <button
            className="upload-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={25} /> : "Upload"}
          </button>
        </form>
      </div>
      <div className="fetch">
        <span style={{ color: "#8DD8E8", fontSize: "30px", margin: "10px" }}>
          View Your Stored Contracts
        </span>
        <button className="fetchBtn" onClick={handleFetch}>
          Fetch
        </button>
        <div
          style={{
            margin: "10px",
            display: "flex",
            flexWrap: "wrap",
            flexBasis: "33.33%",
          }}
        >
          {response.map((filez) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                key={filez.id}
              >
                <span
                  // key={filez.id}
                  style={{ color: "#8DD8E8", cursor: "pointer" }}
                >
                  {filez.metadata.name.split(/[0-9-]/)}
                </span>
                <iframe
                  // crossOrigin="anonymous"
                  // key={filez.id}
                  src={content}
                  alt="Contract"
                  width={200}
                  height={200}
                  title="Contracts"
                  style={{
                    border: "none",
                    borderRadius: "13px",
                    scrollbarWidth: "2px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Storage;
