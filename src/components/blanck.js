import React from 'react';
import './blanck.css';
const key =     "12ebdcf718ab7c061a72ad990eb8426e"; //в данный момент это данные для входа от имени Жанны
const token =   "9a61335f73a25a96ae327c0596137e6510c1200686a06268644d4cbd9c74f799"; //токен Жанны
const idList =  "5ca7c0a68d00c41839aab5b5"; //Id колонки куда будут добавляться карточки
const link =    "https://api.trello.com/1/cards?idList="; //URL для формировки POST Запроса 

//основные поля для карточки, пользовательские будут добавлены путем UPDATE основной карточки
var data = 
  {
    name:'error',
    desc: 'error',
    address: 'error',
    pos: 'top'
  };

let send_To_trello = () =>
  {
    let dogovor = document.getElementById('dogovor').value; //Номер договора
    let tariff = document.getElementById('tariff').value; // Ныне стоящий тариф
    let balans = document.getElementById('balans').innerText; // Баланс на счету
    let contact_phone = document.getElementById('contact_phone').value; //Контактный телефон
    let full_name = document.getElementById('full_name').value; // ФИО
    let address = document.getElementById('address').value; //настоящий адрес
    let description = document.getElementById('description').value; // коментарий к записи
    let n_zayavki = document.getElementById('n_zayavki').value; // номер заявки
    let l_address = document.getElementById('l_address').value; //адрес, с которого позвонили
    let service_type = document.getElementById("service_type"); // типы услуг
    let service = service_type.options[service_type.selectedIndex].value; //получаем значение типа услуги
    data.name = n_zayavki + " " + l_address; //заглавие карточки
    data.desc = description;    
    data.address = address;
    var xhr = new XMLHttpRequest();
    let url = link+idList+"&keepFromSource=all&key="+key+"&token="+token; //формируем рабочую URL
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data)); 

    alert("Заявка отправлена на Трелло")
    //после отправки карты Теперь нужно добавить пользовательские поля, для этого создаем EventListener

    xhr.addEventListener("readystatechange", function () { 
      if (this.readyState === this.DONE) {
        let card_id = JSON.parse(this.responseText).id;  //принимает значения card_id(Id той самой отправленной карточки)
        start_sending_trello(card_id, service, dogovor, contact_phone, full_name, l_address);
      }
    });
  }
let start_sending_trello = (card_id, service, dogovor, contact_phone, full_name, l_address ) =>
  {
    let delivered_id = "5e3a93e653bccf8452ff9c24"; //поступило откуда ID
    let added_time_id = "5cb0c0f26b6751560e1c89ed"; //время добавления ID
    let service_type_id = "5cb0c15b22c8766deb3c1f0f";// тип сервиса ID
    let contract_n_id = "5cb0c29f8060f05eed0a8510"; //номер договора ID
    let phone_n_id = "5cb0c2c641e3c13d94a9a031"; //номер телефона ID
    let FIO_id = "5cb0c35d94834810e090cbc9"; // ФИО id
    let address_id = "5cb0c68c2dab2655a4ec4b79"; //адрес ID
    var date = Date.now();
    var d = new Date();
    //Коротко объясню, в оригинале на компе стоит 06.02.2020, при отправке даты методом toLocaleString в Trello появится 2-е Июня 2020. Поэтому форматируем как нам нужно
    var formatedDate = new Intl.DateTimeFormat('en-US').format(date); 
    var fullDate = formatedDate+ " " +d.getHours()+":"+d.getMinutes(); //добавляем часы и минуты
    let dt = new Date(fullDate); //формируем окончательную дату. 
    //Начинаем отправку данных на трелло с указанием типа данных.
    add_custom_value(card_id, added_time_id, dt, "date");
    add_custom_value(card_id, service_type_id, service, "list");
    add_custom_value(card_id, contract_n_id, dogovor, "text");
    add_custom_value(card_id, phone_n_id, contact_phone, "text");
    add_custom_value(card_id, FIO_id, full_name, "text");
    add_custom_value(card_id, address_id, l_address, "text");
  }
let  add_custom_value = (card_id, field_id, data, data_type) => 
  {
      let link_card = "https://api.trello.com/1/card/";//уникальный линк
      let url = link_card + card_id + "/customField/" + field_id + "/item" + "?key="+key+"&token="+token; //создание рабочего URL
      var xhr2 = new XMLHttpRequest();
      xhr2.open("PUT", url, true); //Открываем PUT . Это аналог UPDATE
      xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      switch(data_type) //у каждого пользовательского поля свой тип, в основном это TEXT, DATE, и LIST
      {
        case "text" : 
          var field_data = {
            value:{
              text: data
            }
          };
        break;

        case "date" : 
          var field_data = {
            value:{
              date: data
            }  
          }; 
        break;

        case "list" : 
        switch(data)  //Есть название услуги, у каждого названия свой ID в Options выбора в trello, т.к там стоит Listbox
          { //Задаем каждому типу услуги свой ID, взятый с Trello API, он у каждого уникальный, не пытайтесь вставлять в другие Listbox.
            case "Ремонт x1" :     var idValue = "5cb0c163b49ddc7907c06523"; break;
            case "Ремонт x2" :     var idValue = "5cb0c16663c9df61f5997be7"; break;
            case "Ремонт x3" :     var idValue = "5cb0c16af835cf5b73a0eea6"; break;
            case "Подключение" :   var idValue = "5cb0c17042ab2417d12f5a1b"; break;
          }
          var field_data = {
            idValue: idValue, //айди выборки опции в трелло
            list: data
          }
      }
            
    
      xhr2.send(JSON.stringify(field_data));
  }

const Blanck =() =>{
  let reload =  () => window.location.assign("/")
  return(
<>

<header className="header">
    <div className="header__main">
        <div className="header__leftside">
            <span className="header__tech-text">Чат технической поддержки</span>
        </div>
    </div>
</header>

<main>

    <div className="blanck-wrapper">
        <div className="blank">
            <div className="blank__row blank__row_line" >
                <div className="blank__row_short ">
                    <p className="blank__row-title">Номер договора</p>
                    <input type="text" name="" id ="dogovor" value={sessionStorage.getItem('auth_contact_number')} readOnly="readonly" />
                </div>
                <div className="blank__row_short">
                    <p className="blank__row-title">Баланс</p>
                    <span className="blank__balance" id ="balans">{sessionStorage.getItem('auth_balance')}</span>
                </div>
            </div>
            <div className="blank__row">
                <p className="blank__row-title">Тариф</p>
                <input type="text" name="" id = "tariff"  value={sessionStorage.getItem('auth_tariff_inet')} readOnly="readonly"/>
            </div>
            <div className="blank__row">
                <p className="blank__row-title"> ФИО абонента</p>
                <input type="text" name="" id = "full_name"  value={sessionStorage.getItem('author')} readOnly="readonly"/>
            </div>
            <div className="blank__row">
                <p className="blank__row-title">Адрес</p>
                <input type="text" name="" id = "address" value={sessionStorage.getItem('auth_address')} readOnly="readonly"/>
            </div>
            <div className="blank__row" >
                <div className="blank__row">
                    <p className="blank__row-title">Контактные телефоны</p>
                    <input type="text" name="" id = "contact_phone"  value={sessionStorage.getItem('auth_phone')} readOnly="readonly"/>
                </div>
            </div>
        </div>
        <div className="blank__button" onClick={reload}> <p>  Вернуться назад  </p> </div>
    </div>

    <div className="blanck-wrapper">
        <div className="blank">
            <div className="blank__row">
                <p className="blank__row-title">Номер заявки</p>
                <input type="text" name="" id = "n_zayavki" />
            </div>
            <div className="blank__row">
                <p className="blank__row-title"> Адрес</p>
                <input type="text" name="" id = 'l_address'  />
            </div>
            <div className="blank__row">
                <p className="blank__row-title">Вид услуги</p>
                <select className="blanck__service" id = "service_type">
                <option className="blanck__service">Ремонт x1</option>
                <option className="blanck__service">Ремонт x2</option>
                <option className="blanck__service">Ремонт x3</option>
                <option className="blanck__service">Подключение</option>
                </select>
            </div>
            <div className="blank__row" >
                <div className="blank__row">
                    <p className="blank__row-title">Коментарии</p>
                    <textarea className="blanck__coments" id = "description" name="name" rows="9" cols="43"></textarea>
                </div>
            </div>
        </div>
        <div className="blank__button"><p onClick={send_To_trello}> Отправить заявку в Trello</p></div>
    </div>

</main>


</>
    )
    }

export default Blanck;
