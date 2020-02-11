import React from 'react';

function InfoPlate(props) {
  return (
	<>    
<div className="right-side__blank">
		<div className="right-side__row_short" >
				<div className="right-side__row">
						<p className="right-side__row-title">Номер договора</p>
						<input type="text" name=""  value={props.prop.auth_contact_number} readOnly="readonly"/>
				</div>
				<div className="right-side__row">
						<p className="right-side__row-title">Баланс</p>
						<span className="right-side__balance">{props.prop.auth_balance} ₽</span>
				</div>
		</div>
		<div className="right-side__row">
				<p className="right-side__row-title">Тариф</p>
				<input type="text" name=""  value={props.prop.auth_tariff_inet} readOnly="readonly"/>
		</div>
		<div className="right-side__row">
				<p className="right-side__row-title"> ФИО абонента</p>
				<input type="text" name=""  value={props.prop.author} readOnly="readonly"/>
		</div>
		<div className="right-side__row">
				<p className="right-side__row-title">Адрес</p>
				<input type="text" name=""  value={props.prop.auth_address} readOnly="readonly"/>
		</div>
		<div className="right-side__row" >
				<div className="right-side__row">
						<p className="right-side__row-title">Контактные телефоны</p>
						<input type="text" name=""  value={props.prop.auth_phone} readOnly="readonly"/>
				</div>
		</div>
</div>
    </>
  );
}
export default InfoPlate;
