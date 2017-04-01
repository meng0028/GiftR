//ask the browser to support the latest programing language
'use strict';
var app = {
    localStorageList: {
        people: []
    }
    , init: function () {
        document.addEventListener('deviceready', app.onDeviceReady);
    }
    , onDeviceReady: function () {
        window.addEventListener('push', app.pageChanged);
        //set time format to Canadian English
        moment.locale('en-ca');
        app.showPeoplePage();
    }
    , pageChanged: function () {
        // load index.html
        if (location.pathname.indexOf("index.html") != -1) {
            app.showPeoplePage();
            let addPersonBtn = document.getElementById("addPersonBtn");
            let savePersonBtn = document.getElementById("savePersonBtn");
            let closePersonBtn = document.getElementById("closePersonBtn");
            // add click listener for each button
            addPersonBtn.addEventListener("touchend", app.showPeoplePage.addPerson);
            savePersonBtn.addEventListener("touchend", app.showPeoplePage.savePerson);
            closePersonBtn.addEventListener("touchend", app.showPeoplePage.closePerson);
        }
        // load gifts.html
        else {
            app.showGiftsPage();
            let addGiftBtn = document.getElementById("addGiftBtn");
            let saveGiftBtn = document.getElementById("saveGiftBtn");
            let closeGiftBtn = document.getElementById("closeGiftBtn");
            let removeGiftBtn = document.getElementById("removeGiftBtn");
            // add click listener for each button
            addGiftBtn.addEventListener("touchend", app.showGiftsPage.addGift);
            saveGiftBtn.addEventListener("touchend", app.showGiftsPage.saveGift);
            closeGiftBtn.addEventListener("touchend", app.showGiftsPage.closeGift);
            removeGiftBtn.addEventListener("touchend", app.showGiftsPage.removeGift);
        }
    }
    , showPeoplePage: function () {
        peopleId: 0
        , printPeopleList: function (contactList = []) {
            let peopleList = document.getElementById("contact-list");
            // clear people html
            peopleList.innerHTML = "";
            app.localStorageList = JSON.parse(localStorage.getItem("giftr-meng0028"));
            app.localStorageList.people.sortByBirthDate;
            peopleList.forEach(function (people) {
                let li = document.createElement("li");
                li.className = "table-view-cell";
                let dob = moment(people.dob).set("year", moment().year());
                li.innerHTML = "".concat('<span class="name"><a href="#personModal">', people.name, '</a></span>', '<a class="navigate-right pull-right" href="gifts.html">', '<span ' + (dob < moment() ? 'class="dob"' : "") + '>', dob.format("MMMM Do"), '</span>', '</a>');
                //adds Event listeners
                li.querySelector("span a").addEventListener("touchend", () => app.showPeoplePagePage.addPerson(people.id));
                li.querySelector("a.navigate-right.pull-right").addEventListener("touchend", () => app.showGiftsPage.peopleId = people.id);
                //adds item to the list
                document.getElementById("contact-list").appendChild(li);
            });
        }
    }
    , addPerson: function (peopleId) {
        if (peopleId) {
            let people = app.localData.getPersonById(peopleId);
            if (people) {
                this.peopleId = peopleId;
                document.getElementById("person_name").value = people.name;
                document.getElementById("person_dob").value = moment(people.dob).format("YYYY-MM-DD");
                document.querySelector("#personModal header h1").textContent = "Edit: " + people.name;
            }
        }
    }
    , savePerson: function () {
        let name = document.getElementById("contact_name").value.trim();
        let dob = document.getElementById("contact_dob").value.trim();
        if (name && dob) {
            localStorage.setItem( 'giftr-meng0028' , JSON.stringify( lsData ) ); 
            app.showPeoplePage.printPeopleList(app.localData.getLocalStorageData().people);
            app.showPeoplePage.closePerson();
        }
    }
    , closePerson: function () {
        app.contactsPage.closePerson();
        document.getElementById("close_contact").dispatchEvent(new CustomEvent("touchend", {
            bubbles: true
            , cancelable: true
        }));
    }
    , showGiftsPage: {
        giftId: 0
        , personId: 0
        , printGiftsList: function (giftList = []) {
            let giftsList = document.getElementById("gift-list");
            giftsList.innerHTML = "";
            giftsList.forEach(function (gift) {
                let url = /^(http|https):\/\//.test(gift.url) ? "" : "http://" + gift.url;
                let li = document.createElement("li");
                li.className = "table-view-cell media";
                li.innerHTML = "".concat('<span class="pull-right icon icon-trash midline"></span>', '<div class="media-body">', gift.idea, (gift.store ? '<p>at ' + gift.store + '</p>' : ""), (gift.url ? '<a href="' + url + '" target="_blank" >' + gift.url + '</a>' : ""), (gift.cost ? '<p>' + (/^\$/.test(gift.cost) ? "" : "$") + gift.cost + '</p>' : ""), '</div>');
                li.querySelector("span").addEventListener("click", () => app.showGiftsPage.removeGift(gift.id));
                document.getElementById("gift-list").appendChild(li);
            });
        }
    }
    , addGift: function () {
        let contact = app.localData.getPersonById(app.giftsPage.contactId);
        if (contact) {
            app.giftsPage.drawGiftsList(contact.ideas);
            document.querySelector("#giftModal div p").textContent = "New idea for " + people.name;
            document.querySelector(".content h5").textContent = "Ideas for " + people.name;
        }
    }
    , saveGift: function () {
        let idea = document.getElementById("gift_idea").value.trim();
        let store = document.getElementById("gift_store").value.trim();
        let url = document.getElementById("gift_url").value.trim();
        let cost = document.getElementById("gift_cost").value.trim();
        if (idea) {
            localStorage.setItem( 'giftr-meng0028' , JSON.stringify( lsData ) ); 
            app.giftsPage.printGiftsList(app.localData.getPersonById(app.giftsPage.peopleId).ideas);
            app.giftsPage.closeGift();
        }
    }
    , closeGift: function () {
        app.giftsPage.cleanModal();
        document.getElementById("close_gift").dispatchEvent(new CustomEvent("touchend", {
            bubbles: true
            , cancelable: true
        }));
    }
    , removeGift: function (id) {
        localStorage.removeItem( 'giftr-meng0028' , JSON.stringify( lsData ) ); 
        let contact = app.localData.getPersonById(app.showGiftsPage.contactId);
        if (contact) {
            app.showGiftsPage.printGiftsList(contact.ideas);
        }
    }
    , sortByBirthDate: function (people) {
        return people.sort(function (a, b) {
            let ma = moment(a.dob).set("year", moment().year());
            let mb = moment(b.dob).set("year", moment().year());
            return ma < mb ? -1 : ma > mb ? 1 : 0;
        });
    }
};
app.init();

