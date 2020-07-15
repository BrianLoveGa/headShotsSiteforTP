import React, { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from "./ImagePreview";
import ShowBtn from './ShowBtn';
import { removeBackgroundFromImageBase64 } from "remove.bg";

function CameraComponent(props) {
	const [dataUri, setDataUri] = useState('');
	const isFullscreen = false;


	function handleTakePhoto(dataUri) {
		//console.log('takePhoto');
	}

	function handleTakePhotoAnimationDone(dataUri) {
		//console.log(dataUri, 'takePhoto');
		setDataUri(dataUri);
	}

	function handleCameraError(error) {
		//console.log('handleCameraError', error);
	}

	function handleCameraStart(stream) {
		//console.log('handleCameraStart');
	}

	function handleCameraStop() {
		//console.log('handleCameraStop');
	}

	function resetState() {
		setDataUri(null);
	}

	function savePhoto() {
		download(dataUri, "headshot.jpeg", "image/jpeg");
	};

	function changeBg() {
		if (process.env.REACT_APP_API_KEY === undefined) {
			throw new Error("No API key found");
		  }

		  async function removeBgFromBase64() {
			try {
		  
			  //const outputFile = `${__dirname}/out/img-removed-from-base64.png`;
			  //const base64img = fs.readFileSync(path, { encoding: "base64" });
			  const base64img = dataUri;
			  const result = await removeBackgroundFromImageBase64({
				base64img,
				apiKey: process.env.REACT_APP_API_KEY,
				size: "auto",
				type: "person",
				bg_image_url: window.location.href + "img/portrait-bg.jpg"
			  });
		  
			  //console.log(`File saved to ${outputFile}`);
			  //console.log(`${result.creditsCharged} credit(s) charged for this image`);
			 //console.log(`Result width x height: ${result.resultWidth} x ${result.resultHeight}, type: ${result.detectedType}`);
			  console.log(result.base64img.substring(0, 40) + "..");
			  setDataUri("data:image/jpeg;base64," + result.base64img);
			} catch (e) {
			  console.log("Error: " + JSON.stringify(e));
			}
			return null;
		  }

		  removeBgFromBase64();
	}

	//found on http://danml.com/download.html
	function download(data, strFileName, strMimeType) {
		
		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function (a) { return String(a); },
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
		myBlob = myBlob.call ? myBlob.bind(self) : Blob;

		if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload = [payload, mimeType];
			mimeType = payload[0];
			payload = payload[1];
		}


		if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
			if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
				var ajax = new XMLHttpRequest();
				ajax.open("GET", url, true);
				ajax.responseType = 'blob';
				ajax.onload = function (e) {
					download(e.target.response, fileName, defaultMime);
				};
				setTimeout(function () { ajax.send(); }, 0); // allows setting custom ajax headers using the return:
				return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if (dataUri) {

			if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
				payload = dataUrlToBlob(payload);
				mimeType = payload.type || defaultMime;
			} else {
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload); // everyone else can save dataURLs un-processed
			}

		}//end if dataURL passed?

		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], { type: mimeType });


		function dataUrlToBlob(strUrl) {
			var parts = strUrl.split("[:;,]"),
				type = parts[1],
				decoder = parts[2] === "base64" ? atob : decodeURIComponent,
				binData = decoder(parts.pop()),
				mx = binData.length,
				i = 0,
				uiArr = new Uint8Array(mx);

			for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

			return new myBlob([uiArr], { type: type });
		}

		function saver(url, winMode) {

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
				document.body.appendChild(anchor);
				setTimeout(function () {
					anchor.click();
					document.body.removeChild(anchor);
					if (winMode === true) { setTimeout(function () { self.URL.revokeObjectURL(anchor.href); }, 250); }
				}, 66);
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if (!winMode) { // force a mime that will download:
				url = "data:" + url.replace(dataUri, defaultMime);
			}
			f.src = url;
			setTimeout(function () { document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if (self.URL) { // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		} else {
			// handle non-Blob()+non-URL browsers:
			if (typeof blob === "string" || blob.constructor === toString) {
				try {
					return saver("data:" + mimeType + ";base64," + self.btoa(blob));
				} catch (y) {
					return saver("data:" + mimeType + "," + encodeURIComponent(blob));
				}
			}

			// Blob but not URL support:
			reader = new FileReader();
			reader.onload = function (e) {
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */


	return (
		<div className="cameraDiv">
			{/* <Popup /> */}
				<div className="camera">
					{(dataUri)
						?
						<><ImagePreview dataUri={dataUri}
							isFullscreen={isFullscreen}
						/>
							<div className="preview-btn-div">
								<button className="all-btns preview-btns retake" onClick={resetState}>Retake Photo</button>
								<button className="all-btns preview-btns save" onClick={savePhoto}>Save Photo</button>
								<button className="all-btns preview-btns change" onClick={changeBg}>Change Background</button>
							</div>
						</>
						:
						<>
							<div className="showBtn">
								<ShowBtn />
							</div>
							<Camera
								onTakePhoto={(dataUri) => {
									handleTakePhoto(dataUri);
								}}
								onTakePhotoAnimationDone={(dataUri) => {
									handleTakePhotoAnimationDone(dataUri);
								}}
								onCameraError={(error) => {
									handleCameraError(error);
								}}
								onCameraStart={(stream) => {
									handleCameraStart(stream);
								}}
								onCameraStop={() => {
									handleCameraStop();
								}}
								idealResolution={{ width: 640, height: 480 }}
								isMaxResolution={true}
								idealFacingMode={FACING_MODES.ENVIRONMENT}
								imageType={IMAGE_TYPES.JPG}
								imageCompression={0.97}
								isImageMirror={false}
								isSilentMode={false}
								isDisplayStartCameraError={true}
								isFullscreen={false}
								sizeFactor={1}
							/>
						</>
					}</div>
		</div>
	);
}

export default CameraComponent;