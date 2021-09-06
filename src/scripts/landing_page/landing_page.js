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

   
    datePanel.dataset.month = month;
    datePanel.dataset.year = year;

    makeDayList();
}
function makeDayList(){
    console.log("makeDayList Started")
    let oldElements = datePanel.querySelectorAll(".date-panel__days-item")
    oldElements.forEach( el => {
        el.remove();
    })

    let month = +datePanel.dataset.month;
    let year = +datePanel.dataset.year;
    datePanelTitle.textContent = `${monthList[month]} ${year}`;

    datePanel.dayList = [];

    let firstMonthDay = new Date(year, month, 1);
    let lastMonthDay = new Date(year, month + 1, 0)
    
    for(let i = firstMonthDay.getDay() - 2; i >= 0; i--){
        let day = new Date(year, month, -i)
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }
    for(let i = firstMonthDay.getDate(); i < lastMonthDay.getDate() + 1; i++){
        let day = new Date(year, month, i);
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        if (datePanel.startDate){
            if(datePanel.startDate.getDate() == day.getDate() &&
               datePanel.startDate.getMonth() == day.getMonth() &&
               datePanel.startDate.getFullYear() == day.getFullYear()){
                dayCell.classList.add("date-panel__days-item--start")
            }
                
        }
        if (datePanel.endDate){
            if (datePanel.endDate.getDate() == day.getDate() &&
                datePanel.endDate.getMonth() == day.getMonth() &&
                datePanel.endDate.getFullYear() == day.getFullYear()) {
                dayCell.classList.add("date-panel__days-item--start")
            }
        }

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }
    for(let i = 1; i <= 7 - lastMonthDay.getDay(); i++){
        if(lastMonthDay.getDay() === 0) break

        let day = new Date(year, month + 1, i);
        datePanel.dayList.push(day);

        let dayCell = document.createElement('div');
        dayCell.classList.add("date-panel__days-item")
        dayCell.textContent = day.getDate();

        datePanel.querySelector(".date-panel__days").append(dayCell);
    }

    
}
makeDayList();

function dayClick(event){
    let cell = event.target.closest(".date-panel__days-item");

    if(datePanel.toggle)
    cell.classList.add("date-panel__days-item--start")


}

dayClick.startDateInput = document.querySelector(".landing-page-form__date--start");
dayClick.endDateInput = document.querySelector(".landing-page-form__date--end");
dayClick.toggle = "start";

dayClick.startDateInput.addEventListener("click", () => {
    datePanel.toggle = "start";
})
dayClick.endDateInput.addEventListener("click", () => {
    datePanel.toggle = "end";
})

function dateInputKeyDown(event){
    let text = this.value;

    if (text.length === 2 && event.inputType !== "deleteContentBackward"){
        text+= ".";
        this.value = text;
    }
    if (text.length === 5 && event.inputType !== "deleteContentBackward"){
        text+= ".";
        this.value = text;
    }
    if(text.length > 10){
        this.value = text.slice(0, -1);
    }

    if(text.length === 10){
        let day = +text.slice(0, 3)
        let month = +text.slice(3, 6)
        let year = +text.slice(6)

        if(isNaN(day) || isNaN(month) || isNaN(year)){
            alert("невозможно преобразить в дату " + text)
            return null
        }
        if(day > 31 || day < 1){
            alert("Ошибка даты, некоректный день")
            return null;
        }
        if(month > 12 || month < 1){
            alert("Ошибка даты, некоректый месяц");
            return null;
        }
        if(year > aYear + 2){
            alert(`Ошибка даты, невозможно забронировать номер более чем на год вперед`)
            return null;
        }

        let date = new Date(year, month - 1, day);
        if(date < new Date()){
            alert(`Ошибка ( Указана прошедшая дата ${text})`);
            this.value = "";
            return null;
        }

        console.log(datePanel.toggle)
        if(datePanel.toggle === "start"){
            datePanel.startDate = date;
            datePanel.dataset.year = year
            datePanel.dataset.month = month - 1;
        }else if(datePanel.toggle === "end"){
            console.log("dateEnd")
            datePanel.endDate = date;
            datePanel.dataset.year = year
            datePanel.dataset.month = month - 1;
        }
        makeDayList();


    }


}

dayClick.startDateInput.addEventListener("input", dateInputKeyDown);
dayClick.endDateInput.addEventListener("input", dateInputKeyDown);

document.querySelector('.date-panel__days').addEventListener("click", dayClick)
