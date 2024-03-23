const nameInput = document.querySelector(".name-input");
const submitButton = document.querySelector(".add-btn");
const form = document.querySelector(".form");
const mainDiv = document.querySelector(".main-div");
let newDivs = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

submitButton.addEventListener("click", () => {
  if (nameInput.value === "") {
    return;
  }
  createNewRow();
  nameInput.value = "";
});

function createNewRow() {
  const newOutputDiv = document.createElement("div");
  const newOutputField = document.createElement("input");
  const newEditBtn = document.createElement("button");
  const newDeleteBtn = document.createElement("button");
  newOutputField.setAttribute("readonly", true);
  newOutputField.setAttribute("type", "text");
  newEditBtn.textContent = "Edit";
  newDeleteBtn.textContent = "Delete";
  newOutputDiv.classList.add("output-div");
  newEditBtn.classList.add("edit-btn");
  newDeleteBtn.classList.add("delete-btn");
  newOutputField.classList.add("output-field");
  mainDiv.insertBefore(newOutputDiv, mainDiv.firstChild);
  newOutputDiv.appendChild(newOutputField);
  newOutputDiv.appendChild(newEditBtn);
  newOutputDiv.appendChild(newDeleteBtn);
  newOutputField.value = nameInput.value;
  newDivs.unshift(newOutputDiv);
  editEvent(newEditBtn, newOutputField);
  deleteEvent(newDeleteBtn, newOutputDiv);
  saveToLocalStorage();
}

function editEvent(editbtn, outputfield) {
  editbtn.addEventListener("click", () => {
    if (outputfield.hasAttribute("readonly")) {
      editbtn.textContent = "Done";
      outputfield.removeAttribute("readonly");
      outputfield.focus();
    } else {
      outputfield.setAttribute("readonly", true);
      editbtn.textContent = "Edit";
    }
    saveToLocalStorage();
  });
}

function deleteEvent(deletebtn, newdiv) {
  deletebtn.addEventListener("click", () => {
    newDivs = newDivs.filter((item) => item !== newdiv);
    newDivs = newDivs.filter(
      (item) => item !== newdiv.querySelector(".output-field")
    );
    newDivs = newDivs.filter(
      (item) => item !== newdiv.querySelector(".edit-btn")
    );
    newDivs = newDivs.filter(
      (item) => item !== newdiv.querySelector(".delete-btn")
    );
    newdiv.remove();
    saveToLocalStorage();
  });
}

function saveToLocalStorage() {
  const divData = [];
  newDivs.forEach((div) => {
    const outputField = div.querySelector(".output-field");
    const data = {
      value: outputField.value,
      readonly: outputField.hasAttribute("readonly"),
    };
    divData.push(data);
  });
  localStorage.setItem("divData", JSON.stringify(divData));
}

function restoreFromLocalStorage() {
  newDivs = [];
  const savedDivData = localStorage.getItem("divData");

  if (savedDivData) {
    const divData = JSON.parse(savedDivData);
    mainDiv.innerHTML = "";

    divData.forEach((data) => {
      const newOutputDiv = document.createElement("div");
      const newOutputField = document.createElement("input");
      const newEditBtn = document.createElement("button");
      const newDeleteBtn = document.createElement("button");
      newOutputField.setAttribute("readonly", true);
      newOutputField.setAttribute("type", "text");
      newOutputField.value = data.value;
      newEditBtn.textContent = "Edit";
      newDeleteBtn.textContent = "Delete";
      newOutputDiv.classList.add("output-div");
      newEditBtn.classList.add("edit-btn");
      newDeleteBtn.classList.add("delete-btn");
      newOutputField.classList.add("output-field");
      mainDiv.appendChild(newOutputDiv);
      newOutputDiv.appendChild(newOutputField);
      newOutputDiv.appendChild(newEditBtn);
      newOutputDiv.appendChild(newDeleteBtn);
      newOutputField.value = data.value;
      newDivs.push(newOutputDiv);
      editEvent(newEditBtn, newOutputField);
      deleteEvent(newDeleteBtn, newOutputDiv);
    });
  }
}

window.onload = function () {
  restoreFromLocalStorage();
};
