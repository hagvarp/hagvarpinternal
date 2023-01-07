if (document.getElementById("outputDisseminationFrontPage") != null) {


  let drupalLanguage = "fo";

  // ### 1. Calendar elements list ###
  var calendarElementListRoot = document.getElementById(
    "outputDisseminationFrontPage"
  );
  var calendarElementList = document.createElement("div");
  calendarElementList.setAttribute("class", "calendarElementList");
  calendarElementList.id = "calendarElementList";
  calendarElementListRoot.appendChild(calendarElementList);

  // Get calendar elements from API
  var requestCalendarElements = new XMLHttpRequest();
  requestCalendarElements.open(
    "GET",
    "https://kalendari.hagstova.fo/api/Dissemination",
    true
  );
  requestCalendarElements.onload = function () {
    // Begin accessing calendar elements JSON data here
    var data = JSON.parse(this.response);

    let i = 0;

    if (
      requestCalendarElements.status >= 200 &&
      requestCalendarElements.status < 400
    ) {
      for (i = 0; i < 5; i++) {
        var listElement = document.createElement("div");
        listElement.setAttribute("class", "listElement"); // Create a <div class="card"> element
        listElement.setAttribute("style", "margin-bottom:15px");

        var listElementHeader = document.createElement("div");
        listElementHeader.setAttribute("class", ""); // Create a <div class="card-header"> element
        listElementHeader.id = "heading" + i;

        var listElementHeading = document.createElement("H5"); // Create a <h5> element
        listElementHeading.setAttribute("class", "mb-0");

        var listElementButton = document.createElement("div"); // Create a <button> element
        listElementButton.id = "button" + i;
        listElementButton.setAttribute("class", "btn nopadding cursortext"); // Create a class for the button element

        calendarElementDesign = document.createElement("div");
        calendarElementDesign.setAttribute("class", "calendarElementDesign");
        calendarElementDesignDay = document.createElement("div");
        calendarElementDesignDay.setAttribute(
          "class",
          "calendarElementDesignDay"
        );
        calendarElementDesignDay.innerText = moment(
          data[i].deadline,
          "YYYY-MM-DD HH:mm:s"
        )
          .locale(drupalLanguage)
          .format("D");
        calendarElementDesignMonth = document.createElement("div");
        calendarElementDesignMonth.setAttribute(
          "class",
          "calendarElementDesignMonth"
        );
        calendarElementDesignMonth.innerText = moment(
          data[i].deadline,
          "YYYY-MM-DD HH:mm:s"
        )
          .locale(drupalLanguage)
          .format("MMM");

        // If date is changed
        if (data[i].postponedToDate != null && data[i].isPostponed == false) {
          calendarElementDesignDay.innerText = moment(
            data[i].postponedToDate,
            "YYYY-MM-DD HH:mm:s"
          )
            .locale(drupalLanguage)
            .format("D");
          calendarElementDesignMonth.innerText = moment(
            data[i].postponedToDate,
            "YYYY-MM-DD HH:mm:s"
          )
            .locale(drupalLanguage)
            .format("MMM");
        }

        var hreflink = document.createElement("a"); // Create a <a href> element
        if (drupalLanguage == "fo") {
          
        } else {
          
        }

        listElementName = document.createElement("div");
        listElementName.setAttribute("class", "calendarElementName");
        listElementName1 = document.createElement("div");
        listElementName1.setAttribute("class", "calendarElementName1");
        listElementName2 = document.createElement("div");
        listElementName2.setAttribute("class", "calendarElementName2");

        if (drupalLanguage == "fo") {
          listElementName1.innerText = data[i].name;
        } else {
          listElementName1.innerText = data[i].name_En;
        }

        if (drupalLanguage == "fo") {
          listElementName2.innerText = data[i].timePeriod;
        } else {
          listElementName2.innerText = data[i].timePeriod;

          listElementName2.innerText = listElementName2.innerText.replace(
            "kvartal",
            "quarter"
          );

          if (listElementName2.innerText.length == 8) {
            var m = moment(listElementName2.innerText, "MMMM YYYY", "fo");
            listElementName2.innerText = m.locale("en").format("MMM YYYY");
          }
        }

        listElementPostponedStatus = data[i].isPostponed;
        listElementPostponedToDate = data[i].postponedToDate;

        if (data[i].isPostponed == true) {
          postPonedTextElement = document.createElement("span");
          postPonedTextElement.setAttribute("class", "postPoned");
          listElementName1.setAttribute(
            "class",
            "calendarElementName1 nopadding"
          );

          currentTime = new Date(data[i].deadline);
          postPondeDate = new Date(data[i].postponedToDate);

          if (drupalLanguage == "fo") {
            if (postPondeDate >= currentTime) {
              postPonedText = "Útsett til";
            } else if (postPondeDate < currentTime) {
              postPonedText = "Framskundað, uppr. ";
              postPonedTextElement.setAttribute(
                "class",
                "postPonedFrontpage rescheduled"
              );
            }
          } else {
            if (postPondeDate >= currentTime) {
              postPonedText = "Postponed to";
            } else if (postPondeDate < currentTime) {
              postPonedText = "Rescheduled, orig. ";
              postPonedTextElement.setAttribute(
                "class",
                "postPonedFrontpage rescheduled"
              );
            }
          }

          if (postPondeDate >= currentTime) {
            postPonedTextElement.innerText =
              " (" +
              postPonedText +
              " " +
              moment(data[i].postponedToDate, "YYYY-MM-DD HH:mm:s")
                .locale(drupalLanguage)
                .format("DD. MMM") +
              ")";
          } else if (
            postPondeDate < currentTime &&
            data[i].postponedToDate != null
          ) {
            postPonedTextElement.innerText =
              " (" +
              postPonedText +
              " " +
              moment(data[i].deadline, "YYYY-MM-DD HH:mm:s")
                .locale(drupalLanguage)
                .format("DD. MMM") +
              ")";
            calendarElementDesignDay.innerText = moment(
              data[i].postponedToDate,
              "YYYY-MM-DD HH:mm:s"
            )
              .locale(drupalLanguage)
              .format("D");
          }

          listElementName1.appendChild(postPonedTextElement);
        }

        if (data[i].isPostponed == true) {
          if (data[i].postponedToDate == null) {
            if (drupalLanguage == "fo") {
              postPonedTextElement.innerText = " (Útsett)";
              postPonedTextElement.setAttribute("class", "postPonedFrontpage");
            } else {
              postPonedTextElement.innerText = " (Postponed)";
              postPonedTextElement.setAttribute("class", "postPonedFrontpage");
            }
          }
        }

        var timePeriodDiv = document.createElement("div");
        timePeriodDiv.textContent = data[i].timePeriod;

        var tableQueryResultDiv = document.createElement("div");
        tableQueryResultDiv.id = "tableQueryResult" + i;

        calendarElementList.appendChild(listElement); // Her verður listin gjørdur

        listElement.appendChild(listElementHeader);

        listElementHeader.appendChild(listElementHeading);
        listElementHeading.appendChild(listElementButton);

        listElementButton.appendChild(calendarElementDesign);
        calendarElementDesign.appendChild(calendarElementDesignDay);
        calendarElementDesign.appendChild(calendarElementDesignMonth);

        listElementButton.appendChild(hreflink);
        hreflink.appendChild(listElementName);
        listElementName.appendChild(listElementName1);
        listElementName1.appendChild(listElementName2);
      }
    } else {
      var errorMessage = document.createElement("marquee");
      errorMessage.textContent = "Gah, it's not working!";
      calendarElementListRoot.appendChild(errorMessage);
    }
  };

  requestCalendarElements.send();
}
