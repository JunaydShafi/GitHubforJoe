document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const completeBtn = document.getElementById("completeBtn");
    const backBtn = document.querySelector(".back-button");
  
    startBtn.addEventListener("click", () => {
      alert("Job started!");
      // future: send PUT/POST request to backend
    });
  
    completeBtn.addEventListener("click", () => {
      alert("Job marked complete!");
      // future: send PUT request to update job status
    });
  
    backBtn.addEventListener("click", () => {
      window.history.back(); // or navigate elsewhere
    });
  });
  