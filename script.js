const cashInput=document.getElementById('cash');
const statusBar=document.getElementById('status-bar');
const purchaseBtn=document.getElementById('purchase-btn');
const clearBtn=document.getElementById('clear-btn');
const totalChange=document.querySelector('.total-change');

let price = 140;
let cid = [
  ["PENNY", 1.01], 
  ["NICKEL", 2.05], 
  ["DIME", 3.1], 
  ["QUARTER", 4.25], 
  ["ONE", 90], 
  ["FIVE", 55], 
  ["TEN", 20], 
  ["TWENTY", 60], 
  ["ONE-HUNDRED", 100]
];

let cidContent = document.querySelector('.cid'); // to display change in drawer
cid.forEach(subArray => {
  let div = document.createElement('div');
  div.className = 'cid-content';
  div.textContent = `${subArray[0]}: $${subArray[1].toFixed(2)}`;
  cidContent.appendChild(div);
});

const clearDivs = () => { // function to clear innerHTML of every div for every execution
  const divs=document.querySelectorAll('.denomination'); 
  totalChange.textContent='';
  divs.forEach(div=>{ 
    div.innerHTML=''
  });
}

const checkCashRegister = () => {
  const denominations = [
    ["ONE-HUNDRED", 100],
    ["TWENTY", 20],
    ["TEN", 10],
    ["FIVE", 5],
    ["ONE", 1],
    ["QUARTER", 0.25],
    ["DIME", 0.1],
    ["NICKEL", 0.05],
    ["PENNY", 0.01]
  ];
  const changeAmount = Number((cashInput.value-price).toFixed(2)); // 500-140 = 360 // 475.41-140 = 335.41 // 430 - 140 = 290
  let changeDue = changeAmount;
  const totalCashInDrawer=cid.reduce((acc,currValue)=>acc+currValue[1],0).toFixed(2); // 335.41
  const change = [];

  for(let [denomination,value] of denominations) {
    let available = cid.find(subArray=>subArray[0]===denomination)[1];
    let count = 0;

    while(changeDue>=value && available > 0) {
      changeDue-=value; 
      available-=value; 
      count++; 
      changeDue=Math.round(changeDue*100)/100;
    }

    if(count>0){
      change.push([denomination, (value*count).toFixed(2)]);
    }
  }

  clearDivs();

  change.forEach(subArray=>{ // add innerHTML to every div for every execution
    const [denomination,amount] = subArray;
    const div = document.getElementById(denomination);
    if ((div && totalCashInDrawer==changeAmount && changeDue===0) || (div && totalCashInDrawer>changeAmount && changeDue===0)) {
      div.innerHTML=`<span style="font-weight:bold;">${denomination}:</span> $${amount}`;
    }
  });

  if(totalCashInDrawer==changeAmount && changeDue===0){
    statusBar.innerHTML=`<span style="font-weight:bold;">Status:</span> <span style="color:red; font-weight:bold">CLOSED</span>`;
    totalChange.textContent=`$${changeAmount}`;
    return;
  }
  else if(totalCashInDrawer>changeAmount && changeDue===0){
    statusBar.innerHTML=`<span style="font-weight:bold;">Status:</span> <span style="color:green; font-weight:bold">OPEN</span>`;
    totalChange.textContent=`$${changeAmount}`;
    return;
  }
  else {
    statusBar.textContent=`Status: INSUFFICIENT FUNDS`;
    return;
  }
};

purchaseBtn.addEventListener('click',()=>{
  if(cashInput.value<price){
    cashInput.value='';
    clearDivs();
    alert('Customer does not have enough money to purchase the item');
    return;
  }
  else if(cashInput.value==price){
    clearDivs();
    statusBar.textContent='No change due - customer paid with exact cash';
    return;
  }
  else if(cashInput.value>price){
    checkCashRegister();
  }
});

clearBtn.addEventListener('click',()=>{
  cashInput.value='';
  clearDivs();
})