const swt = document.querySelector(".tgl");
const notax = document.querySelectorAll(".notax");
const notax_list = [...notax];
const withtax = document.querySelectorAll(".withtax");
const withtax_list = [...withtax];
toggle = true;
console.dir(swt);
swt.addEventListener("click",()=>{
    console.log('hello');
    if(toggle){
        for(i=0;i<notax_list.length;i++)
            notax_list[i].style.display = "none";
        for(i=0;i<withtax_list.length;i++)
            withtax[i].style.display = "inline";
        toggle = false;
    }
    else{
        for(i=0;i<notax_list.length;i++)
            notax_list[i].style.display = "inline";
        for(i=0;i<withtax_list.length;i++)
            withtax[i].style.display = "none";
        toggle = true;
    }
});