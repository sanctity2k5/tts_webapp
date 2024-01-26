# Assistant Startup Documentation

## HTML/FRONTEND Documentation

### Overview
This HTML file is for a webpage titled "Assistant Startup". The webpage is designed to welcome users to the Assistant Startup and provide them with options to buy or use a license.

### Details

#### DOCTYPE
The document type declaration is `<!DOCTYPE html>`, which is for HTML5.

#### Language
The language of the document is French, as specified by the `lang` attribute in the `<html>` tag.

#### Head Section
The `<head>` section includes:
- A character encoding declaration for UTF-8.
- A viewport meta tag to control layout on mobile browsers.
- The title of the webpage, "Assistant Startup".
- A link to an external CSS file named "style.css".

#### Body Section
The `<body>` section includes:
- A `div` element with the class "landing-container", which includes:
  - A script to import the DotLottie Player Component.
  - A DotLottie Player that plays a Lottie animation from a specified URL.
  - A heading displaying the text "Bienvenue sur l'Assistant Startup".
  - A `div` element with the class "licenseButtons", which includes:
    - A script to import the Gumroad button.
    - A Gumroad button linking to a product page to buy a license.
    - A button that opens a modal to use a license.
- A `div` element with the id "licenseModal", which is a modal for users to enter their license key.
- A `div` element with the id "overlay".
- A script tag linking to an external JavaScript file named "index.js".

#### Scripts
The webpage uses external scripts for the DotLottie Player Component and the Gumroad button. It also links to a custom JavaScript file named "index.js".

## JavaScript Documentation

### Overview
This JavaScript file is for handling license key verification and modal operations on the "Assistant Startup" webpage.

### Details

#### Functions
- `openModal()`: Opens the license modal and overlay.
- `closeModal()`: Closes the license modal and overlay.
- `openErrorModal()`: Opens the error modal and overlay.
- `closeErrorModal()`: Closes the error modal and overlay.
- `verifyLicense(e)`: An asynchronous function that prevents the default form submission event, retrieves the license key value from the input field, saves it to local storage, and sends a POST request to the "verifyLicense" endpoint with the license key in the request body. If the response is successful and the status is "success", it calls `handleValidLicense()`. If the response status is not "success", it calls `handleInvalidLicense()` with the error message.
- `handleValidLicense()`: Redirects the user to the assistant page with the license key as a URL parameter.
- `handleInvalidLicense()`: Displays an error message in the license modal and resets the "Use License" button text.

#### Event Listeners
- An event listener is added to the "useLicense" button that opens the license modal when clicked.
- An event listener is added to the "use" button inside the license modal that calls `verifyLicense()` when clicked.


#### Assitant.html and Assitatnt.js

### Overview
This HTML file is for a webpage titled "Dialogue avec l'Assistant". The webpage is designed to interact with the Assistant and provide options to upload a pitch deck.

### Details

#### Head Section
The `<head>` section includes:
- A character encoding declaration for UTF-8.
- A viewport meta tag to control layout on mobile browsers.
- The title of the webpage, "Dialogue avec l'Assistant".
- A link to an external CSS file named "../style.css".

#### Body Section
The `<body>` section includes:
- A `div` element with the class "assistant-modal" and id "licenseModal", which includes a popup for purchasing a Gumroad license and uploading a pitch deck.
- A `div` element with the id "overlay".
- A `div` element with the class "pitch-deck-modal" and id "pitchDeck-popup", which includes a popup for confirming the end of the license and finalizing the pitch.
- A `div` element with the class "assistant-container", which includes a DotLottie player, a heading, start and stop buttons for recording, a canvas for visualizing audio data, an audio element for playing back the recording, a loading div, and a button for uploading the pitch deck.
- A script tag linking to an external JavaScript file named "../javascript/assistant.js".

### Overview
This JavaScript file is for handling license key verification, modal operations, audio recording and visualization, and Lottie animation control on the "Dialogue avec l'Assistant" webpage.

### Details

#### Variables
- `startBtn`, `stopBtn`, `audio`, `uploadBtn`: These variables store references to HTML elements with the corresponding IDs.
- `recorder`, `audioStream`, `audioContext`, `analyser`, `dataArray`: These variables are declared but not assigned any values. They are likely used for audio recording and analysis.
- `canvas`, `canvasCtx`: These variables store references to a canvas element and its 2D rendering context, likely used for visualizing audio data.

#### Functions
- `showPopup()`, `closePopup()`: These functions show and hide the license modal.
- `showPitchPopup()`: This function checks if a PDF file is selected and if its size is less than 20MB, then it calls `uploadPitchDeck()` and shows the pitch deck popup.
- `closePitchPopup()`: This function hides the pitch deck popup.
- `updateLicense()`: This asynchronous function retrieves the license key from local storage, sends a PATCH request to the "/updateLicense" endpoint with the license key in the request body, and handles the response.




### Server/Backend Documentation
## Overview
This JavaScript file is for managing license keys in an Express.js application. It uses the Express.js framework, the Axios HTTP client, and the `License` model from a separate module.

## Details

### Modules
- `express`: A web application framework for Node.js.
- `License`: A model for license keys, likely defined using Mongoose.
- `axios`: A promise-based HTTP client for the browser and Node.js.
- `catchAsync`: A utility function for handling asynchronous operations.
- `body-parser`: Middleware to parse incoming request bodies.
- `dotenv`: A module to load environment variables from a `.env` file.

### Middleware
- `bodyParser.urlencoded({ extended: false })`: Parses URL-encoded bodies.
- `bodyParser.json()`: Parses JSON request bodies.

### Environment Variables
The `.env` file is loaded using `dotenv.config({ path: "../../config.env" })`.

### Functions
- `createLicenseKey()`: An asynchronous function that sends a POST request to the Gumroad API to verify a license key. If the response is successful, it checks if the license key already exists in the database. If it does and it's not expired, it sends a success response with the existing license key. If it doesn't, it creates a new license key and sends a success response with the new license key. If the Gumroad API response is not successful, it sends a failure response.
- `protectRoute()`: An asynchronous middleware function that retrieves a license key from the request parameters, finds the license in the database, and checks if it's valid and not expired. If it is, it calls `next()`. If it's not, it sends a response with an error message.
- `updateLicense()`: An asynchronous function that retrieves a license key from the request body, finds the license in the database, and updates its 'expired' property to true. If the license is not found, it sends a response with an error message. If the license is found and updated, it sends a success response.


### app.js
## Details
This JavaScript code is for an Express.js application that handles license verification, audio and pitch deck file uploads, and runs Python scripts for processing these files. Here’s a brief overview of its functionalities:

License Verification: The application uses a custom licenseController module to create, verify, and update licenses. The routes for these operations are /verifyLicense, /assistant.html/:id, and /updateLicense, respectively.

File Uploads: The application uses Multer, a middleware for handling multipart/form-data, to handle file uploads. It has routes for uploading audio files (/uploadAudio) and pitch deck files (/uploadPitchDeck). The uploaded files are stored in the uploads/ directory.

Python Script Execution: The application runs Python scripts for processing the uploaded files. The runPythonScript function is used to execute a Python script with two arguments and return its output. This function is used in the uploadPitchAndFeedBack and SpeechToGPTToTTS functions to run the pitchDeckFile.py and transcribe.py scripts, respectively.

Session Management: The application uses the express-session middleware to handle sessions. It generates a unique session ID for each user using the uuid module.

Error Handling: The application uses a custom globalErrorHandler module to handle errors. If a user tries to access a route that doesn’t exist, the application will return a 404 error.

### Modules
- `express`: A web application framework for Node.js.
- `session`: A module for handling Express.js sessions.
- `multer`: A middleware for handling `multipart/form-data`.
- `body-parser`: Middleware to parse incoming request bodies.
- `FormData`: A module to create readable `multipart/form-data` streams.
- `stream`: A module to work with streaming data in Node.js.
- `fs`: A module to work with the file system in Node.js.
- `path`: A module to work with file and directory paths.
- `exec`: A method from the `child_process` module to run shell commands.
- `uuidv4`: A method from the `uuid` module to generate UUIDs.
- `licenseController`: A custom module for license management.
- `globalErrorHandler`: A custom module for global error handling.
- `AppError`: A custom error class.

### Middleware
- `bodyParser.urlencoded({ extended: false })`: Parses URL-encoded bodies.
- `bodyParser.json()`: Parses JSON request bodies.
- `multer({ storage: storage })`: Handles `multipart/form-data` with a custom storage option.
- `express.static(path.join(__dirname, "public"))`: Serves static files from the "public" directory.
- `express.static("uploads")`: Serves static files from the "uploads" directory.
- `session({ secret: "NOT_SECURE", resave: false, saveUninitialized: true, cookie: { secure: false } })`: Initializes Express.js sessions with a weak secret and insecure cookies.

### Routes
- `POST /verifyLicense`: Verifies a license key.
- `GET /assistant.html/:id`: Serves the "assistant.html" file if the license is valid.
- `PATCH /updateLicense`: Updates a license.
- `POST /uploadAudio`: Uploads an audio file and returns its path.
- `POST /uploadPitchDeck`: Uploads a pitch deck and returns its path.
- `ALL *`: Returns a 404 error for all other routes.

### Functions
- `uploadPitchAndFeedBack(req, filePath, res)`: Runs a Python script to process a pitch deck file and returns its result.
- `SpeechToGPTToTTS(req, filePath)`: Runs a Python script to transcribe an audio file and returns its result.
- `runPythonScript(scriptName, argument1, argument2)`: Runs a Python script with two arguments and returns its output.
- `createUniqueID(req)`: Generates a UUID and stores it in the session.


### server.js
### Overview
The main entry point of the app. It sets up express, configures middleware, defines routes
and starts the server on port 3000.
### Code Explanation
Environment Variables: The application uses the dotenv module to load environment variables from a .env file.

Database Connection: The application connects to a MongoDB database using Mongoose. The database URL and password are retrieved from environment variables.

Server Creation: The application creates an Express.js server that listens on a specified port.

Error Handling: The application listens for uncaught exceptions and unhandled promise rejections. If either event occurs, it logs the error and shuts down the server gracefully.

Graceful Shutdown: The application listens for the SIGTERM signal, which is sent when the server process is about to be terminated. When this signal is received, it shuts down the server gracefully.

### config.env file
This is where all the environment variables are stored

NODE_ENV: This is the Node.js environment variable. It’s commonly used to indicate the context in which an app is running (i.e., development, testing, or production).

PORT: This is the port number on which your application will run.

USERNAME: This could be a username for a service your application is using.

PASSWORD and DATABASE_PASSWORD: These are passwords that your application needs. They could be for accessing a database or an external service.

DATABASE: This is the connection string for your MongoDB database hosted on MongoDB Atlas.

PRODUCT_ID: This could be an ID for a product your application is using or managing.



