
(function() {
    //GET
    GetLists();

})();

function GetLists(id) {
    console.log("Getting Lists");
    //try catch
    //https://partnerblog.bol.com/documentatie/open-api/handleiding/api-requests/catalog/get-catalogv4lists/
    // https://api.bol.com/catalog/v4/lists/?ids=1430&limit=3&apikey={apikey}&format=json
    //KEY : D6207618A6924D7E9324A8CC6CCDD134
    
    //let url = "https://partnerblog.bol.com/app/pagina/handleiding/json/search.json";
    console.time("fetchingTime");
    let url = "json/bol_list2.json";
    fetch(url).then(function(response){
        return response.json();
    }).then(function(json){
        console.log(json);
        //console.log(json['products'][0]);
        console.timeEnd("fetchingTime");
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
        let strLength = 500;
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

