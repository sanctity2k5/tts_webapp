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
  
  // Event listener for "Annuler" button inside the license modal
  document.getElementById("cancel").addEventListener("click", closeModal);
  
  // Event listener for "Close" button inside the error modal
  document.getElementById("closeError").addEventListener("click", closeErrorModal);
  
  // Event listener for "Acheter des licences" button (if needed)
  // document.getElementById("buyLicense").addEventListener("click", () => {
  //   window.location.href = "https://serenity838.gumroad.com/l/jhuppm";
  // });
  

  //Verifying the Gumroad License Key
    async function verifyLicense() {
        const licenseKey = document.getElementById("licenseInput").value;
        const response = await fetch('verifyLicense', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ licenseKey: licenseKey })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log("Success============>", data);
  if (data.success) {
    // License key is valid, proceed to the next page
    window.location.href = "./assistant.html";
  } else {
    // License key is not valid, show an error message
  }
})
.catch(error => {
    document.getElementById('errorMessage').innerHTML = '<div class="errorContainer"><img src="assets/error.svg" alt="error-icon"><p class="errorMessage">Hé, vous avez entré une clé de licence invalide</p></div>';
    console.log(error)
  console.error('There has been a problem with your fetch operation:', error);
});

      }
  