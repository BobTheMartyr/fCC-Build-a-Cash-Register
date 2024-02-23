let price = 19.5

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];


const payment = document.getElementById('cash')
const purchaseBtn = document.getElementById('purchase-btn')
const priceDisplay = document.getElementById('price-left').textContent += "$" + price
const changeInDrawer = document.getElementById('change-in-drawer')
const changeTitle = document.getElementById('change-title')
const statusTitle = document.getElementById('status-title')
const changeDude = document.getElementById('change-dude')
const imSalty = document.getElementById('change-due')

let drawerTotal = parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))

const updateDrawerTotal = () => {
  changeTitle.innerHTML = `<p>Cash in Drawer $${parseFloat(drawerTotal).toFixed(2)}<p>`
}



const updateCashInDrawer = () => {
  changeInDrawer.innerHTML = ''
  cid.forEach(el => {
    changeInDrawer.innerHTML += `<div id='money'><p>${el[0].slice(0,1) + el[0].slice(1).toLowerCase()}</p><p class='dollar-amt'><strong>$</strong> ${parseFloat(el[1].toFixed(2))}</p></div>`
  })
}

window.addEventListener('load', updateCashInDrawer)
window.addEventListener('load', updateDrawerTotal)

purchaseBtn.addEventListener('click', () => {
  if( Number(payment.value) === price ){
    changeDude.innerHTML = ''
    imSalty.innerHTML = ''
    changeDude.innerHTML += `<p class='dollar-amt' style='text-align:center;font-size: 30px;'>No change due - customer paid with exact cash</p>`
    imSalty.innerHTML += `<p class='dollar-amt' style='text-align:center;font-size: 30px;'>No change due - customer paid with exact cash</p>`
  } else if( Number(payment.value) < price ){
    alert('Customer does not have enough money to purchase the item')
  } else { 
    checkCashRegister(payment.value)
  }
  
})


const updateChangeDue = (change, status) => {
  statusTitle.style.display = 'none'
  changeDude.innerHTML = ''
  imSalty.innerHTML = ''
  changeDude.innerHTML += `<p style='width: 95%; font-size: 25px; margin-top: 5px; margin-left: 10px'class='dollar-amt'>${status}</p>`
  imSalty.innerHTML = `<p>${status}</p>`
  change.forEach(el => {
    imSalty.innerHTML += el[0] + ': ' + '$' + el[1]
  })

  change.forEach(el => {
    changeDude.innerHTML += `<div id='money'><p>${el[0].slice(0,1) + el[0].slice(1).toLowerCase()}</p><p class='dollar-amt'><strong>$</strong>${parseFloat(el[1]).toFixed(2)}</p></div>`
  })

}


const checkCashRegister = (value) => {
  let cash = Number(value)
  let change = parseFloat((cash - price).toFixed(2))
  let regTotal = Number(drawerTotal)


  if( change > regTotal ){
    updateChangeDue(0, 'Status: INSUFFICIENT_FUNDS')
    return
  }

  
  if( change === regTotal ){
    updateChangeDue([...cid.filter(el => el[1] != 0)], 'Status: CLOSED')
    drawerTotal = 0
    updateDrawerTotal()
    updateCashInDrawer()
    return 
  }
  
  

  let values = [100, 20, 10, 5, 1, .25, .1, .05, .01]
  let amt = cid.reverse()
  let result = []
  updateDrawerTotal()

  for( let i = 0; i < values.length; i++ ){
    if( change >= values[i] && amt[i][1] > 0 ){
      let amount = 0
      let moneyType = amt[i][0]
      while( change >= values[i] && amt[i][1] > 0 ){
        amount += parseFloat(values[i].toFixed(2))
        console.log(amount, typeof(amount))
        change = parseFloat(change.toFixed(2) - values[i].toFixed(2))
        amt[i][1] -= parseFloat(values[i].toFixed(2))
      }
      result.push([moneyType, parseFloat(amount.toFixed(2))])

    }
  }

  if( change > 0 ){
      updateChangeDue(0, 'Status: INSUFFICIENT_FUNDS')
    } else if( Number(change) === 0 && drawerTotal === 0 ){
      updateChangeDue(result, 'Status: CLOSED')
    } else {
      updateChangeDue(result, 'Status: OPEN')
    }

  for( let i = 0; i < result.length; i++ ){
    for( let j = 0; j < cid.length; j++ ){
      if( cid[j][0] === result[i][0] ){
        cid[j][1] -= result[i][1]
      }
    }
  }

  cid.reverse()
  updateCashInDrawer()
}








