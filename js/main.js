
(function() {
    //Categories
    let cat = document.getElementsByClassName("category");
    for (let index = 0; index < cat.length; index++) {
        cat[index].addEventListener("click", changeCategory);
    }
    let filter = document.getElementById("btn_filter_items");
    filter.addEventListener("click", filterItems);

    //GET
    GetLists("./json/bol_cat_elek.json");

})();
function changeCategory(event){
    //If clicked, find 'selected' and remove '> ' + 'selected'-class, and add to the new selected item
    let cat = document.getElementsByClassName("category");
    for (let index = 0; index < cat.length; index++) {
        if(cat[index].classList.contains("selected_category")){
            cat[index].classList.remove("selected_category")
            cat[index].textContent = cat[index].textContent.substr(2);
        }
    }
    event.target.classList = "selected_category category";
    event.target.textContent = "> " + event.target.textContent;
    //Load the new json, remove all current items
    var myNode = document.getElementById("item_container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    let url = "./json/bol_cat_" + event.target.name + ".json";
    GetLists(url);
    
}

function GetLists(url) {
    console.log("== Getting Lists ==");
    // https://partnerblog.bol.com/documentatie/open-api/handleiding/api-requests/catalog/get-catalogv4lists/
    // https://api.bol.com/catalog/v4/search/?q=muziek&offset=0&limit=12&dataoutput=products&apikey=D6207618A6924D7E9324A8CC6CCDD134&format=json
    // https://api.bol.com/catalog/v4/lists/?ids=1430&limit=3&apikey={apikey}&format=json
    // KEY : D6207618A6924D7E9324A8CC6CCDD134
    
    console.time("Fetching Time from " + url);
    //let url = "./json/bol_cat_elek.json";
    fetch(url).then(function(response){
        return response.json();
    }).then(function(json){
        console.log(json);
        //console.log(json['products'][0]);
        console.timeEnd("Fetching Time from " + url);
        CreateItems(json);
    }).catch(function(error){
        console.error("An error occurred during fetch: " + error);
    });
}

function CreateItems(json){
    let container = document.getElementById("item_container");
    let item, title, image, description, link;
    json.products.forEach(element => {
        //console.log(element);
        item = document.createElement("div");
        item.className = "item";

        title = document.createElement("p");
        title.className = "item_title";
        title.innerHTML = element.title;
        image = document.createElement("img");
        image.className = "item_img";
        image.src = element.media[0].url;
        description = document.createElement("p");
        description.className = "item_description";
        //trim description length :
        let strLength = 400;
        if(element.shortDescription.length > strLength){
            description.innerHTML = element.shortDescription.substring(0, strLength) + "...";
        }
        else {
            description.innerHTML = element.shortDescription;
        }
        link = document.createElement("a");
        link.className = "item_url";
        link.innerHTML = "> Order now"
        link.href = element.urls[0].value;

        item.appendChild(title);
        item.appendChild(image);
        item.appendChild(description);
        item.appendChild(link);
        container.appendChild(item);
    });
}

function filterItems(){
    let filterText = document.getElementById("input_filter").value.toLowerCase();
    console.log("filtering on " + filterText);
    //get all items
    let items = document.getElementsByClassName("item");
    //Remove all hidden
    for (let index = 0; index < items.length; index++) {
        items[index].className = "item";
    }
    //set hidden
    for (let index = 0; index < items.length; index++) {
        //console.log(items[index].childNodes); //0 title, 2 descr
        if(items[index].childNodes[0].textContent.toLowerCase().indexOf(filterText) > -1 
        || items[index].childNodes[2].textContent.toLowerCase().indexOf(filterText) > -1){
            //console.log(items[index].childNodes[0].textContent + " CONTAINS " + filterText);
        }
        else{
            //console.log("hiding " + items[index])
            items[index].classList.add("item_hidden")
        }
    }
}