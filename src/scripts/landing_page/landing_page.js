import landingPage from "../../styles/pages/landing_page.scss";
var monthList = ["Январь", "Февраль", "Март", "Апрель", "Мая", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

var date = new Date();
var aYear = Number(date.getFullYear());
var aMonth = date.getMonth();
var aDay = date.getDate();


var datePanel = document.querySelector(".date-panel")
var datePanelTitle = document.querySelector(".date-panel__header-title");
var nextMonthBtn = datePanel.querySelector(".date-panel__header-btn--right");
var prevMonthBtn = datePanel.querySelector(".date-panel__header-btn--left");

datePanelTitle.textContent = `${monthList[aMonth]} ${date.getFullYear()}`;
datePanel.dataset.month = aMonth
datePanel.dataset.year = aYear;

nextMonthBtn.addEventListener("click", monthUp);
function monthUp(){
    let month = +datePanel.dataset.month;
    let year = +datePanel.dataset.year;
    month+= 1;

    if(month >= 12){
        year+= 1
        month = 0;
    }
    
    datePanelTitle.textContent = `${monthList[month]} ${datePanel.dataset.year}`;
    datePanel.dataset.month = month;
    datePanel.dataset.year = year;

    makeDayList()
}
prevMonthBtn.addEventListener("click", monthDown)
function monthDown(){
    let month = +datePanel.dataset.month;
    let year = +datePanel.dataset.year;
    month-= 1;

    if(month <= -1){
        year = year - 1;
        month = 11;
    }

    datePanelTitle.textContent = `${monthList[month]} ${year}`;
    datePanel.dataset.month = month;
    datePanel.dataset.year = year;

    makeDayList();
}
function makeDayList(){
    let oldElements = datePanel.querySelectorAll(".date-panel__days-item")
    oldElements.forEach( el => {
        el.remove();
    })

    let month = +datePanel.dataset.month;
    let year = +datePanel.dataset.year;

    datePanel.dayList = [];

    let firstMonthDay = new Date(year, month, 1);
    let lastMonthDay = new Date(year, month + 1, 0)
    
    console.log("startMakeDayList ----------- ")
    console.log(firstMonthDay.getDay() - 2);
    console.log("");

    for(let i = firstMonthDay.getDay() - 2; i >= 0; i--){
        let day = new Date(datePanel.dataset.year, datePanel.dataset.month, -i)
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }
    for(let i = firstMonthDay.getDate(); i < lastMonthDay.getDate() + 1; i++){
        let day = new Date(datePanel.dataset.year, datePanel.dataset.month, i);
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }
    for(let i = 1; i <= 7 - lastMonthDay.getDay(); i++){
        if(lastMonthDay.getDay() === 0) break
        console.log(i, "day", 7 - lastMonthDay.getDay());

        let day = new Date(datePanel.dataset.year, datePanel.dataset.month + 1, i);
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }

    
    datePanel.dayList.forEach(element => {
        console.log(element.getDate());
    });
}
makeDayList();

function dayClick(event){
    let cell = event.target.closest(".date-panel__days-item");

    cell.classList.add(".data-panel__days-item--start")
}

dayClick.startDateInput = document.querySelector(".landing-page-form__date--start");
dayClick.endDateInput = document.querySelector(".landing-page-form__date--end");
dayClick.toggle = "start";

dayClick.startDateInput.addEventListener("click", () => {
    dayClick.toggle = "start";
})
dayClick.endDateInput.addEventListener("click", () => {
    dayClick.toggle = "end";
})

document.querySelector('.date-panel__days').addEventListener("click", dayClick)
