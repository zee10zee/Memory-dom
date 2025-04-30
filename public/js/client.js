
const textareas = document.querySelectorAll('textarea')

// dynamicising text area height
textareas.forEach((area)=>{
    if(area.value !== ""){
        area.style.height =  "auto"
        area.style.height = area.scrollHeight + "px";
    }else{
        area.addEventListener('input', function(){
            this.style.height =  "auto"
            this.style.height = area.scrollHeight + "px";
        })
    }
 
 
})


// select dropdown for coutries

const coutries = []


coutries.forEach((coutry) =>{
    
})




