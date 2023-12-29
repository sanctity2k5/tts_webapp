// Function to open the license modal
function openModal() {
  document.getElementById("licenseModal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the license modal
function closeModal() {
  document.getElementById("licenseModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Function to open the error modal
function openErrorModal() {
  document.getElementById("errorModal").style.display = "block";
  document.getElementById("errorOverlay").style.display = "block";
}

// Function to close the error modal
function closeErrorModal() {
  document.getElementById("errorModal").style.display = "none";
  document.getElementById("errorOverlay").style.display = "none";
}

// Event listener for "Utiliser des licences" button
document.getElementById("useLicense").addEventListener("click", openModal);

// Event listener for "Utiliser des licences" button inside the license modal
document.getElementById("use").addEventListener("click", verifyLicense);

//Verifying the Gumroad License Key
async function verifyLicense(e) {
  e.preventDefault();

  //Save the License Key to local storage;
  let licenseKeyValue = document.getElementById("licenseInput").value;

  // Save to localStorage
  localStorage.setItem("licenseKeyValue", licenseKeyValue);

  let licenseKey = localStorage.getItem("licenseKeyValue", licenseKeyValue);
  const button = document.getElementById("use");
  // button.disabled = true;
  button.innerHTML = "Verification in progress...";

  try {
    const response = await fetch("verifyLicense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ licenseKey }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data.status);

    if (data.status === "success") {
      handleValidLicense();
    } else {
      handleInvalidLicense();
    }
  } catch (error) {
    handleInvalidLicense();
  }
}

function handleValidLicense() {
  const licenseKey = document.getElementById("licenseInput").value;
  window.location.href = "./assistant.html/" + licenseKey;
}

function handleInvalidLicense() {
  // Define the button variable
  const button = document.getElementById("use");

  document.getElementById("errorMessage").innerHTML =
    '<div class="errorContainer"><img src="assets/error.svg" alt="error-icon"><p class="errorMessage">Hey, looks like you entered an invalid or used license key</p></div>';
  button.innerHTML = "Use License";
}
