let price = 19.5

let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]


const cash = document.getElementById('cash')
const purchaseBtn = document.getElementById('purchase-btn')
const priceDisplay = document.getElementById('price-left')
const registerTotalDisplay = document.getElementById('change-title')
const displayCid = document.getElementById('change-in-drawer')
const displayChangeDue = document.getElementById('change-due')



const formatResult = (status, change) => {
  displayChangeDue.innerHTML = ''
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`
  change.forEach(el => {
    displayChangeDue.innerHTML += `<p class='dollar-amt'>${el[0]}: $${el[1]}</p>`
  })
}

const checkRegister = () => {
  if( Number(cash.value) < price ){
    alert('Customer does not have enough money to purchase the item')
    cash.value = ''
    return
  }
  if( Number(cash.value) === price ){
    displayChangeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>`
    cash.value = ''
    return
  }

  let newCid = [...cid].reverse()
  let changeDue = Number(cash.value) - price
  let result = {
    status: 'OPEN',
    change: []
  }
  let regTotal = parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))
  let denoms = [100, 20, 10, 5, 1, .25, .1, .05, .01]

  if( changeDue === regTotal ){
    result.status = 'CLOSED'
  }

  if( regTotal < changeDue ){
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
    cash.value = ''
    return
  }

  for( let i = 0; i < newCid.length; i++ ){
    if( changeDue >= denoms[i] && newCid[i][1] > 0 ){
      let total = 0
      let cashType = newCid[i][0]
      while( changeDue >= denoms[i] && newCid[i][1] > 0 ){
        total++
        changeDue = parseFloat((changeDue -= denoms[i]).toFixed(2))
        newCid[i][1] = parseFloat((newCid[i][1] -= denoms[i]).toFixed(2))
      }
      result.change.push([cashType, total * denoms[i]])
    }
  }

  if( changeDue > 0 ){
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
    return
  }

  cid = newCid.reverse()
  renderRegister()
  return result

}

const renderRegister = () => {
  priceDisplay.innerHTML = `<p>$${price}</p>`
  registerTotalDisplay.innerHTML = `<p>$${parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))}`

  displayCid.innerHTML = ''
  cid.forEach(el => {
    displayCid.innerHTML += `<p class='dollar-amt'>${el[0].slice(0,1) + el[0].slice(1).toLowerCase()}: $${el[1]}`
  })
}

window.addEventListener('load', renderRegister)

purchaseBtn.addEventListener('click', () => {
  const result = checkRegister()
  formatResult(result.status, result.change)
})
