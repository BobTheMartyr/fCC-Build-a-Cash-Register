let price = 19.5

let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]


const cash = document.getElementById('cash')
const purchaseBtn = document.getElementById('purchase-btn')
const priceContainer = document.getElementById('price-left')
const registerTotalContainer = document.getElementById('change-title')
const changeInDrawer = document.getElementById('change-in-drawer')
const status = document.getElementById('status-title')
const changeDueContainer = document.getElementById('change-due')

priceContainer.innerHTML = `<p>$${price}</p>`

let registerTotal = parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))

const updateRegisterTotal = () => {
  registerTotal = parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))
  registerTotalContainer.innerHTML = `<p>Register Total: $${registerTotal}</p>`
}

const updateRegister = () => {
  changeInDrawer.innerHTML = ''
  cid.forEach(el => {
    changeInDrawer.innerHTML += `<div id='money'<p>${el[0]}</p><p class='dollar-amt'>$${parseFloat(el[1].toFixed(2))}</p></div>`
  })
}

const formatResults = (status, change) => {
  changeDueContainer.innerHTML = ''
  changeDueContainer.innerHTML += `<p class='dollar-amt'>Status: ${status}</p>`
  change.forEach(el => {
    changeDueContainer.innerHTML += `<p class='dollar-amt'>${el[0]}: $${el[1]}</p>`
  })
}


window.addEventListener('load', () => {
  updateRegisterTotal()
  updateRegister()
}) 

purchaseBtn.addEventListener('click', () => {
  changeDueContainer.innerHTML = ''
  if( Number(cash.value) < price ) {
    alert('Customer does not have enough money to purchase the item')
    cash.value = ''
    return
    }
  if( Number(cash.value) === price) {
      changeDueContainer.innerHTML +=  `<p class='dollar-amt' style='text-align:center;font-size: 30px;'>No change due - customer paid with exact cash</p>`
      cash.value = ''
      return
    }
  const result = checkRegister(Number(cash.value) - price)

  formatResults(result.status, result.change)
  updateRegisterTotal()
  updateRegister()
})


const checkRegister = (changeDue) => {

  let result = {
    status: 'pending',
    change: []
    }
  

  if( changeDue > registerTotal ){
    result.status = 'INSUFFICIENT_FUNDS'
    return result
  } else if( changeDue === registerTotal ){
    result.status = 'CLOSED'
  }

  let denoms = [100, 20, 10, 5, 1, .25, .1, .05, .01]
  cid.reverse()


  for( let i = 0; i < denoms.length; i++ ){
    if( denoms[i] <= changeDue && cid[i][1] > 0 ){
      let total = 0
      let cashType = cid[i][0]
      while( denoms[i] <= changeDue && cid[i][1] > 0 ){
        total += parseFloat(denoms[i].toFixed(2))
        changeDue -= parseFloat(denoms[i].toFixed(2))
        cid[i][1] -= parseFloat(denoms[i].toFixed(2))
        changeDue = parseFloat(changeDue.toFixed(2))
        total = parseFloat(total.toFixed(2))
      }
      result.change.push([cashType, total])
    }
  }
  
  
  if( changeDue > 0 ){
    result.status = 'INSUFFICIENT_FUNDS'
  } else if( result.status === 'pending' ) {
    result.status = 'OPEN'
  }

  cid.reverse()
  return result
}

