/*****************************************************************
File: main.js
Author: Yanming Meng
Description: MAD9022 Midterm Project - GiftR
Here is the sequence of logic for the app:
- This is a Cordova App that help people save gift ideas
- There are two pages, one shows people list, the other shows gift ideas.
- All data is saved in localStorage 
Version: 0.0.1
Updated: March, 30 2017
*****************************************************************/
'use strict';
var app = {
	// declare variales
	localStorageList: {
		people: []
	}
	, currrentPerson: null
		// main function
		
	, init: function () {
		document.addEventListener('deviceready', app.onDeviceReady);
	}
	, onDeviceReady: function () {
			console.dir("enter onDeviceReady");
			window.addEventListener('push', app.pageChanged);
			var addButton = document.getElementById("addPersonButton");
			addButton.addEventListener("touchstart", function (ev) {
				app.currrentPerson = 0;
				document.getElementById("name").value = "";
				document.getElementById("dateOfBirth").value = "";
			});
			// add event listener to person modal buttons
			let savePersonButton = document.getElementById("savePersonButton");
			savePersonButton.addEventListener("touchend", app.savePerson);
			let cancelPersonButton = document.getElementById("cancelPersonButton");
			cancelPersonButton.addEventListener("touchend", app.cancelPerson);
			app.showIndexPage();
		}
		// page change function
		
	, pageChanged: function () {
			let contentDiv = document.querySelector(".content");
			let id = contentDiv.id;
			switch (id) {
			case "index":
				// load index page
				app.showIndexPage();
				var addButton = document.getElementById("addPersonButton");
				addButton.addEventListener("touchstart", function (ev) {
					app.currrentPerson = 0;
					document.getElementById("name").value = "";
					document.getElementById("dateOfBirth").value = "";
				});
				// add event listener to person modal buttons
			let savePersonButton = document.getElementById("savePersonButton");
			savePersonButton.addEventListener("touchend", app.savePerson);
			let cancelPersonButton = document.getElementById("cancelPersonButton");
			cancelPersonButton.addEventListener("touchend", app.cancelPerson);
				break;
			case "gifts":
				//load gifts page
				app.showGiftPage();
				var addGiftButton = document.getElementById("addGiftButton");
				addGiftButton.addEventListener("touchstart", function (ev) {
					document.getElementById("idea").value = "";
					document.getElementById("store").value = "";
					document.getElementById("url").value = "";
					document.getElementById("cost").value = "";
				});
				// add event listener to gift modal buttons
				let saveGiftButton = document.getElementById("saveGiftButton");
				saveGiftButton.addEventListener("touchend", app.saveGift);
				let cancelGiftButton = document.getElementById("cancelGiftButton");
				cancelGiftButton.addEventListener("touchend", app.cancelGift);
				break;
			default:
				app.showIndexPage();
			}
		}
		// local storage functions
		
	, saveLocalStorage: function () {
		localStorage.setItem("giftr-meng0028", JSON.stringify(people));
	}
	, getLocalStorage: function () {
			if (!localStorage.getItem("giftr-meng0028")) {}
			else {
				people = JSON.parse(localStorage.getItem("giftr-meng0028"));
			}
		}
		// index page functions
		
	, savePerson: function () {
		if (app.currrentPerson == 0) {
			var tempArray = document.getElementById("dateOfBirth").value.split("-");
			var monthDayString = tempArray[1] + tempArray[2];
			let temPerson = {
				id: Date.now()
				, fullname: document.getElementById("name").value
				, dateOfBirth: document.getElementById("dateOfBirth").value
				, monthDay: parseInt(monthDayString)
				, ideas: []
			};
			// if both full name and DOB entered, save to local storage
			if (temPerson.fullname && temPerson.dateOfBirth) {
				app.localStorageList.people.push(temPerson);
			}
		}
		else {
			var indexCurrentLiClicked = -1;
			for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
				if (app.currrentPerson == app.localStorageList.people[i].id) {
					indexCurrentLiClicked = i;
				}
			}
			app.localStorageList.people[indexCurrentLiClicked].fullname = document.getElementById("name").value;
			app.localStorageList.people[indexCurrentLiClicked].dateOfBirth = document.getElementById("dateOfBirth").value;
			var tempArray = document.getElementById("dateOfBirth").value.split("-");
			var monthDayString = tempArray[1] + tempArray[2];
			app.localStorageList.people[indexCurrentLiClicked].monthDay = parseInt(monthDayString);
		}
		localStorage.setItem("giftr-meng0028", JSON.stringify(app.localStorageList));
		var touchEndEvent = new CustomEvent("touchend", {
			bubbles: true
		});
		var closePersonModal = document.getElementById("closePersonModal");
		closePersonModal.dispatchEvent(touchEndEvent);
		app.showIndexPage();
	}
	, cancelPerson: function () {
		var touchEndEvent = new CustomEvent("touchend", {
			bubbles: true
		});
		var closePersonModal = document.getElementById("closePersonModal");
		closePersonModal.dispatchEvent(touchEndEvent);
	}
	, showIndexPage: function () {
			let list = document.querySelector('#contact-list');
			list.innerHTML = "";
			app.localStorageList = JSON.parse(localStorage.getItem("giftr-meng0028"));
			if (!app.localStorageList) {
				app.localStorageList = {
					people: []
				};
			}
			else {
				app.localStorageList.people.sort(function (a, b) {
					return a.monthDay - b.monthDay;
				});
			}
			app.localStorageList.people.forEach(function (person) {
				let li = document.createElement("li");
				li.className = "table-view-cell";
				/
				var dateObj = new Date();
				var monthCurrent = (dateObj.getMonth() + 1).toString();
				var dayCurrent = dateObj.getDate().toString();
				var monthDayCurrentNum = -1;
				if (dateObj.getDate() < 10) {
					monthDayCurrentNum = parseInt(monthCurrent) * 100 + parseInt(dayCurrent);
				}
				else {
					monthDayCurrentNum = parseInt(monthCurrent + dayCurrent);
				}
				if (person.monthDay < monthDayCurrentNum) {
					li.classList.add("grey");
				}
				li.setAttribute("data-id", person.id);
				let span_name = document.createElement("span");
				span_name.className = "name";
				let a_modal = document.createElement("a");
				a_modal.href = "#personModal";
				a_modal.innerHTML = person.fullname;
				span_name.appendChild(a_modal);
				a_modal.addEventListener("touchstart", function (ev) {
					var anchorTemp = ev.currentTarget;
					app.currrentPerson = anchorTemp.parentNode.parentNode.getAttribute("data-id");
					document.getElementById("name").value = person.fullname;
					document.getElementById("dateOfBirth").value = person.dateOfBirth;
				});
				let a_chevron = document.createElement("a");
				a_chevron.href = "gifts.html";
				a_chevron.className = "navigate-right pull-right goToGiftPage";
				a_chevron.addEventListener("touchstart", function (ev) {
					var anchorTemp = ev.currentTarget;
					app.currrentPerson = anchorTemp.parentNode.getAttribute("data-id");
				});
				let span_dob = document.createElement("span");
				span_dob.className = "dob";
				let dateToMoment = moment(person.dateOfBirth).format("MMMM D");
				span_dob.innerHTML = dateToMoment;
				a_chevron.appendChild(span_dob);
				li.appendChild(span_name);
				li.appendChild(a_chevron);
				list.appendChild(li);
			});
		}
		//gifts page functions
		
	, saveGift: function () {
		var indexTemp = -1;
		for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
			if (app.currrentPerson == app.localStorageList.people[i].id) {
				indexTemp = i;
				break;
			}
		}
		let ideaEachTemp = {
			id: Date.now()
			, idea: document.getElementById("idea").value
			, at: document.getElementById("store").value
			, url: document.getElementById("url").value
			, cost: document.getElementById("cost").value
		};
		if (document.getElementById("idea").value) {
			app.localStorageList.people[indexTemp].ideas.push(ideaEachTemp);
			localStorage.setItem("giftr-meng0028", JSON.stringify(app.localStorageList));
		}
		var touchEndEvent = new CustomEvent("touchend", {
			bubbles: true
		});
		var closeGiftModal = document.getElementById("closeGiftModal");
		closeGiftModal.dispatchEvent(touchEndEvent);
		app.showGiftPage();
	}
	, cancelGift: function () {
		var touchEndEvent = new CustomEvent("touchend", {
			bubbles: true
		});
		var closeGiftModal = document.getElementById("closeGiftModal");
		closeGiftModal.dispatchEvent(touchEndEvent);
	}
	, showGiftPage: function () {
		let list = document.getElementById("gift-list");
		list.innerHTML = "";
		app.localStorageList = JSON.parse(localStorage.getItem("giftr-meng0028"));
		if (!app.localStorageList) {
			app.localStorageList = {
				people: []
			};
		}
		var indexTemp = -1;
		for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
			if (app.currrentPerson == app.localStorageList.people[i].id) {
				indexTemp = i;
				break;
			}
		}
		let giftHeading = document.getElementById("gift-heading");
		giftHeading.textContent = "Gift idea for " + app.localStorageList.people[indexTemp].fullname;
		let modalHeading = document.getElementById("modal-heading");
		modalHeading.textContent = "Gift idea for " + app.localStorageList.people[indexTemp].fullname;
		for (var i = 0, len = app.localStorageList.people[indexTemp].ideas.length; i < len; i++) {
			let li = document.createElement("li");
			li.className = "table-view-cell media";
			let span = document.createElement("span");
			span.className = "pull-right icon icon-trash midline";
			span.setAttribute("gift-idea-id", app.localStorageList.people[indexTemp].ideas[i].id);
			span.addEventListener("touchend", function (ev) {
				let deleteIcon = ev.currentTarget;
				let idForDelele = deleteIcon.getAttribute("gift-idea-id");
				let len = app.localStorageList.people[indexTemp].ideas.length;
				let indexDeleteItem = -1;
				for (let i = 0; i < len; i++) {
					if (idForDelele == app.localStorageList.people[indexTemp].ideas[i].id) {
						indexDeleteItem = i;
						break;
					}
				}
				if (indexDeleteItem > -1) {
					app.localStorageList.people[indexTemp].ideas.splice(indexDeleteItem, 1);
					app.saveLocalStorage();
					ev.currentTarget.parentElement.parentElement.removeChild(ev.currentTarget.parentElement);
				}
			});
			let div = document.createElement("div");
			div.className = "media-body";
			div.textContent = app.localStorageList.people[indexTemp].ideas[i].idea;
			let pstore = document.createElement("p");
			pstore.textContent = app.localStorageList.people[indexTemp].ideas[i].at;
			let purl = document.createElement("p");
			let a = document.createElement("a");
			a.href = "http://" + app.localStorageList.people[indexTemp].ideas[i].url;
			a.target = "_blank";
			a.innerHTML = app.localStorageList.people[indexTemp].ideas[i].url;
			purl.appendChild(a);
			let pcost = document.createElement("p");
			pcost.innerHTML = app.localStorageList.people[indexTemp].ideas[i].cost;
			div.appendChild(pstore);
			div.appendChild(purl);
			div.appendChild(pcost);
			li.appendChild(span);
			li.appendChild(div);
			list.appendChild(li);
		}
	}
};
app.init();

