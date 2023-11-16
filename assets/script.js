// Wait for the DOM to be ready before executing any code
document.addEventListener('DOMContentLoaded', function () {
  // Function to create time blocks for standard business hours
  function createBlocks() {
    var businessHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // Standard business hours
    var container = $(".container-fluid");

    // Loop through each business hour and create the corresponding time block
    businessHours.forEach(function (hour) {
      // Create a time-block div
      var timeBlock = $("<div>").attr("id", "hour-" + hour).addClass("row time-block");

      // Create the hour column
      var formattedHour = hour > 12 ? hour - 12 + "PM" : (hour === 12 ? "12PM" : hour + "AM");
      var hourColumn = $("<div>").addClass("col-2 col-md-1 hour text-center py-3").text(formattedHour);

      // Create the description textarea
      var descriptionTextarea = $("<textarea>").addClass("col-8 col-md-10 description").attr("rows", "3");

      // Create the save button
      var saveButton = $("<button>")
        .addClass("btn saveBtn col-2 col-md-1")
        .attr("aria-label", "save")
        .html('<i class="fas fa-save" aria-hidden="true"></i>');

      // Append the elements to the time block
      timeBlock.append(hourColumn, descriptionTextarea, saveButton);

      // Append the time block to the container
      container.append(timeBlock);
    });
  }

  // Function to update the time-blocks based on the current time
  function updateBlocks() {
    // Get the current hour using dayjs library
    var currentHour = dayjs().hour();

    // Loop through each time-block
    $(".time-block").each(function () {
      // Extract the hour from the time-block id
      var blockHour = parseInt($(this).attr("id").split("-")[1]);

      // Compare the block hour with the current hour and apply the appropriate class
      if (blockHour < currentHour) {
        $(this).removeClass("present future").addClass("past");
      } else if (blockHour === currentHour) {
        $(this).removeClass("past future").addClass("present");
      } else {
        $(this).removeClass("past present").addClass("future");
      }
    });
  }

  // Function to save the user's input to local storage
  $(".container-fluid").on("click", ".saveBtn", function () {
    var blockId = $(this).closest(".time-block").attr("id");
    var userText = $(this).siblings(".description").val().trim();

    // Save to local storage
    localStorage.setItem(blockId, userText);
    console.log('Saved to local storage:' , blockId, userText);
  });

  // Function to load saved user input from local storage
  function loadSavedData() {
    $(".time-block").each(function () {
      var blockId = $(this).attr("id");
      var savedText = localStorage.getItem(blockId);

      // Display saved text in the corresponding textarea
      $(this).find(".description").val(savedText);
    });
  }

  // Display the current date in the header
  $("#currentDay").text(dayjs().format("dddd, MMMM D"));

  // Create time blocks for standard business hours
  createBlocks();

  // Update time-blocks when the page loads
  updateBlocks();

  // Load saved data when the page loads
  loadSavedData();

  // Update time-blocks every minute
  setInterval(updateBlocks, 60000);
});
