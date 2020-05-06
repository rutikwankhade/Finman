//budget Controller
var budgetController= (function(){
    //function constructors
    var Expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var allExpenses=[];
    var allIncomes=[];
    var data={
              allItems:{
              exp:[],
              inc:[]
            },
              totals:{
              exp:0,
              inc:0
            }
           }
   
           return {
               addItem:function(type,desc,val){
                   var newItem,ID;

                   //create new id
                   if (data.allItems[type].length > 0) {
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                } else {
                    ID = 0;
                }

            
                   //create new item based on type 'inc' or 'exp'
                   if(type==='exp'){
                       newItem= new Expense(ID,desc,val);
                   }else if(typep="inc"){
                       newItem=new Income(ID,desc,val);
                   }
                   //because of same name of array and type, it will choose in which array to apush
                   //push it into our data structure
                   data.allItems[type].push(newItem);
                   //return new element
                   return newItem;
               },
               testing:function(){
                   console.log(data);
               }
           }
})();





//UI controller
var UIController = (function(){
    //to replace domstrings  
    var DOMstrings={
         inputType:'.add-type',
         inputDescription:'.add-description',
         inputValue:'.add-value',
         inputBtn:'.add-btn',
         incomeContainer:'.income-list',
         expenseContainer:'.expense-list'

    }
     return {
         getInput:function(){
           //returning object to get it collectively
            return { type:document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                     description:document.querySelector(DOMstrings.inputDescription).value,
                     value:document.querySelector(DOMstrings.inputValue).value
                   };
             
         },

         addListItem:function(obj,type){

            var html;
            //create html string with placeholder
            html= `<li class=" list-group-item d-flex justify-content-between"id=${obj.Id} >
                <div class="d-flex flex-column">${obj.description}</div> 
                <div>
                   <span class="px-5">${obj.value}</span>
                   <button type="button" class="btn btn-sm mr-1" >
                     <i class="fa fa-trash" aria-hidden="true"></i>
                   </button>
                </div> 
               </li>`;
            
               if(type==='inc'){
                 element=DOMstrings.incomeContainer;
                }else if(type==='exp'){
                 element=DOMstrings.expenseContainer;
                }
          
        
            //replace placeholder with actual data

            //insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',html)
         },

         getDOMstrings:function(){
             return DOMstrings;
         }
     };


})();



//Global app controller
var controller = (function(budgetCtrl,UIctrl){
   //function for event listeners
    var setupEventListeners=function(){
        var DOM= UIctrl.getDOMstrings(); 
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
   
        document.addEventListener('keypress', function(event){
             if(event.keyCode===13){
                     ctrlAddItem();
            }
        });
    };
    
    var ctrlAddItem = function(){
        var input, newItem;

        //1. get the filled input data
              input = UIctrl.getInput();
    
        //2. add the item to budget controller
              newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. add item to ui
             UIctrl.addListItem(newItem,input.type);
        //4. calculate the budget

        //5. display budget on ui
    }
   
   //made it a public function by returning
    return {
        init:function(){
            console.log('application started');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

//this will set up event listeners
controller.init();