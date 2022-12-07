const StorageController = (function (){

  return{
    storeItem: function(item){
      let items =[];
      if(localStorage.getItem('items')===null){
        items=[];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items))
      }else{
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));

      };
    },
  getItemsFromStorage: function(){

    let items;
    if(localStorage.getItem('items')=== null){
items =[];
    }
    else{
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  },
  updateIteminStorage: function(updatedItem){

    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach((item, index)=>{
       if(item.id==updatedItem.id){

        items.splice(index, 1, updatedItem);
       
       }
    })

    localStorage.setItem('items', JSON.stringify(items));


  },
  deleteItemFromStorage: function(currentItem){
    let items = JSON.parse(localStorage.getItem('items'));
    console.log(currentItem.id);
    items.forEach((item, index)=>{
       if(item.id==currentItem.id){

        items.splice(index, 1);
       
       }
    })
   
    localStorage.setItem('items', JSON.stringify(items));


  },
  deleteItemsfromStorage: function(){
    localStorage.removeItem('items');
  }
  }
})();





const ItemController = (function () {
  Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calories) {
      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);
      let newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function () {
      let totalCalories  = 0;
      data.items.forEach((item) => {
        totalCalories += item.calories;
      });
      data.totalCalories = totalCalories;
      return data.totalCalories;
    },
    getItem(itemId) {
      let found;
      data.items.forEach((item) => {
        if (item.id == itemId) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      let found;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = parseInt(calories);
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(){

      const ids = data.items.map((item) => {
        return item.id
        }
      );

      const index = ids.indexOf(data.currentItem.id);

      data.items.splice(index,1);
    },
    deleteAll: function(){
      data.items =[];
      data.currentItem = null;
      data.totalCalories =0;
    }
  };
})();

const UIController = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    calories: ".total-calories",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    editBtn: ".secondary-content",
    itemCollection: ".collection-item",
    clearBtn: ".clear-btn"
  };
  return {
    populateItems: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong><em>${item.calories}</em>
        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>
        </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getUISelectors: UISelectors,

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },
    displayItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories}</em>
        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateItemDisplay: function(item){
      let listItems = document.querySelectorAll(UISelectors.itemCollection);
      listItems = Array.from(listItems);
      console.log(listItems)
      listItems.forEach((listItem)=>{
        const itemID = listItem.getAttribute('id');
        
        console.log(itemID)
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories}</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
        }
      })

    },
    deleteItemDisplay: function(){
          const itemID = `#item-${ItemController.getCurrentItem().id}`
          document.querySelector(itemID).remove();
    },
    deleteList: function(){
      let listItems = document.querySelectorAll(UISelectors.itemCollection);
      listItems = Array.from(listItems);
      console.log(listItems)
      listItems.forEach((listItem)=>{
            listItem.remove();
      })
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCalories).value = "";
    },
    showInput: function (item) {
      document.querySelector(UISelectors.itemName).value =
        ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value =
        ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showCalories(totalCalories) {
      document.querySelector(UISelectors.calories).textContent = totalCalories;
    },
    clearEditState: function () {
      UIController.clearInput();
      console.log("hide");
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      console.log("show");
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

const App = (function (ItemController, UIController,StorageController) {
  const loadEventListeners = () => {
    const UISelectors = UIController.getUISelectors;

    //Add Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemUpdateDisplay);
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UIController.clearEditState);
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAll);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode == 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  const itemDeleteSubmit =(e)=>{
    e.preventDefault();

    let currentItem = ItemController.getCurrentItem();
    // console.log(currentItem.id)
    ItemController.deleteItem();
    UIController.deleteItemDisplay();
    let totalCalories = ItemController.getTotalCalories();
      UIController.showCalories(totalCalories);
      StorageController.deleteItemFromStorage(currentItem);
    UIController.clearEditState();

  }

  const clearAll = (e) =>{
    e.preventDefault();
    ItemController.deleteAll();
    UIController.deleteList();
    let totalCalories = ItemController.getTotalCalories();
    UIController.showCalories(totalCalories);
    StorageController.deleteItemsfromStorage();
    UIController.hideList();
  }
   
 
  const itemUpdateDisplay = (e) => {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      console.log("itemUpdateDisplay");
      const listIdLable = e.target.parentNode.parentNode.id;
      const listIDArr = listIdLable.split("-");
      const itemId = listIDArr[1];
      const item = ItemController.getItem(itemId);
      ItemController.setCurrentItem(item);
      UIController.showInput();
    }
  };
  
  const itemUpdateSubmit = (e) => {
    e.preventDefault();
    const input = UIController.getItemInput();
        if (input.name != "" && input.calories != "") {
      const updatedItem = ItemController.updateItem(input.name, input.calories);
      UIController.updateItemDisplay(updatedItem);
      UIController.clearInput();
      ItemController.logData();
      let totalCalories = ItemController.getTotalCalories();
      UIController.showCalories(totalCalories);

      StorageController.updateIteminStorage(updatedItem);
      UIController.clearEditState();
    }
  };
  const itemAddSubmit = (e) => {
    e.preventDefault();
    const input = UIController.getItemInput();

    if (input.name != "" && input.calories != "") {
      const newItem = ItemController.addItem(input.name, input.calories);
      UIController.displayItem(newItem);
      StorageController.storeItem(newItem);
      UIController.clearInput();
      ItemController.logData();
      let totalCalories = ItemController.getTotalCalories();
      UIController.showCalories(totalCalories);
    }
  };
  return {
    init: function () {
      console.log("Initializing App");
      UIController.clearEditState();
      const items = ItemController.getItems();
      if (items.length > 0) {
        UIController.populateItems(items);
        let totalCalories = ItemController.getTotalCalories();
        UIController.showCalories(totalCalories);
      } else {
        UIController.hideList();
      }

      loadEventListeners();
    },
  };
})(ItemController, UIController, StorageController);

App.init();
