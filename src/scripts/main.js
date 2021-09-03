
import normalize from 'normalize.css';
import main from '../styles/main.scss';
import header_styles from '../styles/modules/header.scss';
import footer_styles from '../styles/modules/footer.scss';

const switchers = document.querySelectorAll(".switcher-wrapper");
switchers.forEach(el => {
    el.addEventListener("click", function(event){
        this.classList.toggle("switcher-wrapper--checked");
    })
});

console.log($);
