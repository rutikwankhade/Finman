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

    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
        sum=sum+cur.value;
        });
        data.totals[type]=sum;
    }

    var data={
              allItems:{
              exp:[],
              inc:[]
            },
              totals:{
              exp:0,
              inc:0
            },
            balance:0
           }
  localStorage.setItem('data',JSON.stringify(data)); 
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

               deleteItem:function(type,id){

                var ids, index;
                ids=data.allItems[type].map(function(current){

                    return current.id;

                });
                index=ids.indexOf(id);
                if(index !== -1){
                    data.allItems[type].splice(index, 1);
                }
               },

               calculateBudget:function(){

                //calculate total income and expenses
                 calculateTotal('exp');
                 calculateTotal('inc');
                //calculate balance
                data.balance=data.totals.inc- data.totals.exp;
               },

               getbudget:function(){
                   return {
                        balance:data.balance,
                        totalInc:data.totals.inc,
                        totalExp:data.totals.exp
                   }
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
         expenseContainer:'.expense-list',
         balanceLabel:'.total-balance',
         incomeLabel:'.total-income',
         expenseLabel:'.total-expense',
         container:'.main-container'

    }
     return {
         getInput:function(){
           //returning object to get it collectively
            return { type:document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                     description:document.querySelector(DOMstrings.inputDescription).value,
                     value:parseInt(document.querySelector(DOMstrings.inputValue).value)
                   };
             
         },

         addListItem:function(obj,type){

            var html;
            //create html string with placeholder
            html= `<li class=" list-group-item d-flex justify-content-between" id="${type +"-"+ obj.id}">
                <div class="d-flex flex-column des">${obj.description}
                </div> 
                <div>
                   <span class="px-5">${obj.value} &#8377;</span>
                   <button type="button" class="btn btn-sm " >
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
         deleteListItem:function(selectorID){

           var el= document.getElementById(selectorID);
           el.parentNode.removeChild(el);
         },

         clearFields:function(){
             var fields, fieldsArr;
             fields=document.querySelectorAll('input');
             fieldsArr=Array.prototype.slice.call(fields);
             fieldsArr.forEach(function(current){
                current.value="";
                fieldsArr[0].focus();
             })
          },

          displayBudget:function(obj){
              document.querySelector(DOMstrings.balanceLabel).textContent= obj.balance;
              document.querySelector(DOMstrings.incomeLabel).textContent= obj.totalInc;
              document.querySelector(DOMstrings.expenseLabel).textContent= obj.totalExp;


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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    
    var updateBudget=function(){
         //1. calculate the budget
         budgetCtrl.calculateBudget()

         //2. return budget
         var budget=budgetCtrl.getbudget();
        //3. display budget on ui
        UIctrl.displayBudget(budget);
    }
    var ctrlAddItem = function(){
        var input, newItem;

        //1. get the filled input data
              input = UIctrl.getInput();
              if(input.description!=="" && !isNaN(input.value) && input.value>0){
                
              //2. add the item to budget controller
                   newItem = budgetCtrl.addItem(input.type, input.description, input.value);
              //3. add item to ui
                   UIctrl.addListItem(newItem,input.type);
              //4. clear the fields
                   UIctrl.clearFields();  
              //5. Calculate and update budget
                   updateBudget();
              }
              else{alert("Please enter a valid input")}
    
           
       
    }

    var ctrlDeleteItem=function(event){

        var itemId,splitId,type,ID;
        itemId=event.target.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitId=itemId.split("-");
            type=splitId[0];
            ID=parseInt(splitId[1]);
            //1. delete the item from data structure
               budgetCtrl.deleteItem(type,ID);
            //2. delete the item from ui
            UIctrl.deleteListItem(itemId);
            //3. update budget
             updateBudget();
        }
    };
   
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