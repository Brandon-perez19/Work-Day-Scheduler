var currentDay = $("#currentDay").text(moment().format("dddd, MMMM Do YYYY"));
var textAreas = $(".input")

$(".btn").on("click", function(event){
    //selects event object and extracts target property
    var clicked = $(event.target);

    //selects parent element of the button with a class of input
    var input = clicked.parent().find(".input");

    //selects the parent element with the class .time-holder
    var date = clicked.parent().find(".time-holder");

    //finds textarea and grabs its id
    var id = clicked.parent().find(".input").attr("id");

    //extracts the value of the textarea with the class .input
    var content = input.val().trim();

    //extracts the value of the element with the class .time-holder
    var dateValue = date.text().trim();

    //timeObj creation
    var timeObj = {
        time: dateValue,
        content: content,
        id: id,
    };
    //pass timeObj into taskAudit as an argument
    taskAudit(timeObj);
});

//created taskAudit function passing timeObj as a parameter
function taskAudit (timeObj) {
    //extracts saved content from local storage 
    var savedTasks = JSON.parse(localStorage.getItem('savedTasks'));

    //variable to remove items from an array
    var indexToRemove = -1

    //is savedTasks is not null/empty then 
    if (savedTasks !=null) {
        //itterates through array
        for (let i = 0; i < savedTasks.length; i++) {
            //detects if the content for that time we are trying to push already exists in the array
            if (timeObj.time === savedTasks[i].time) {
                //if it does, set the indextoremove to i. This means that the for loop has detected a similarity 
                indexToRemove = i;
            };
        };
        //if the array has detected a similarity, then remove it
        if (indexToRemove > -1) {
            savedTasks.splice(indexToRemove, 1);
        }
        //pushes object into array
        savedTasks.push(timeObj)
    } else {
        //if task array returns null, create a new array with the objects
        savedTasks = [
            timeObj
        ];
    };
    //sets itens into local storage
    localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
}

// function to populate schedule
var loadSchedule = function () {
    //retrieves from local storage
    var savedTasks = JSON.parse(localStorage.getItem('savedTasks'));

    //if savedTasks has tasks saved to it 
    if (savedTasks != null ) {
        //itterates through savedTasks array
        for (let i = 0; i < savedTasks.length; i++) {
            //setting new variable 
            var tasks = savedTasks[i];
            //targeting the textAreas saved in local storage. (find elements with the id of #task.id);
            var textAreas = $('#'+tasks.id);
            //sets the text of the selected textArea from local storage to the content saved in local storage.
            textAreas.text(tasks.content);
        };
    };
};

function checkTimes() {
    for (let i = 0; i < textAreas.length; i++) {
        //have to make textArea into a jquery object inorder to use jquery methods
        var textArea = $(textAreas[i]);

        //grabs the id's of the textAreas and saves it to the variable time
        var time = textArea.attr("id");

        //formats the current time right now
        var currentTime = moment()

        // formats the textAreas times
        var textAreaTime = moment(time, "hh:mm a");

        // if the textArea time is before the current time
        var isBefore = textAreaTime.isBefore(currentTime);

        //if the current time is the same time as the textArea
        var isSameHour = currentTime.hour() === textAreaTime.hour()

        //checks conditions in order to add appropriate css classes for color coding
        if (isBefore) {
            //remove other classes to prevent multiple classes stacking
            textArea.removeClass('future present')
            textArea.addClass('past');
        }
        else if (isSameHour) {
            textArea.removeClass('future past')
            textArea.addClass('present');
        }
        else {
            textArea.removeClass('present past')
            textArea.addClass('future');
        };
    };
};

//calls the checkTimes function every 30 minutes to make sure color coding is up-to-date
function reloadSchedule () {
    setInterval(function(){
        checkTimes();
    }, 60000);
};

reloadSchedule();
checkTimes();
loadSchedule();