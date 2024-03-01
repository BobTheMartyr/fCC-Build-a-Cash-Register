let price = 19.5

let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]


const cash = document.getElementById('cash')
const purchaseBtn = document.getElementById('purchase-btn')
const priceDisplay = document.getElementById('price-left')
const registerTotalDisplay = document.getElementById('change-title')
const displayCid = document.getElementById('change-in-drawer')
const status = document.getElementById('status-title')
const displayChangeDue = document.getElementById('change-due')



const formatResults = (status, change) => {
  displayChangeDue.innerHTML = ''
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`
  change.forEach(el => {
    displayChangeDue.innerHTML += `<p>${el[0]}: $${el[1]}</p>`
  })
}


const checkRegister = () => {
  let payment = Number(cash.value)
  
  if( payment < price ){
    alert('Customer does not have enough money to purchase the item')
    cash.value = ''
    return
  }
  if( payment === price ){
    displayChangeDue.innerHTML += `<p>No change due - customer paid with exact cash</p>`
    cash.value = ''
    return
  }

  let result = {
    status: 'OPEN',
    change: []
  }

  let changeDue = parseFloat((payment - price).toFixed(2))
  let regTotal = parseFloat(cid.map(el => el[1]).reduce((t,c) => t + c).toFixed(2))
  let denoms = [100, 20, 10, 5, 1, .25, .1, .05, .01]
  let revCid = [...cid].reverse()

  if( changeDue === regTotal ){
    result.status = 'CLOSED'
  }

  if( changeDue > regTotal ){
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
    return
  }
  

  for( let i = 0; i < denoms.length; i++ ){
    if( denoms[i] <= changeDue && revCid[i][1] > 0 ){
      let total = 0
      let cashType = revCid[i][0]
      while( denoms[i] <= changeDue && revCid[i][1] > 0 ){
        total++
        changeDue = parseFloat((changeDue -= denoms[i]).toFixed(2))
        revCid[i][1] -= denoms[i]
      }
      result.change.push([cashType, total * denoms[i]])
    }
  }

  if( changeDue > 0 ){
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
    cash.value = ''
    return
  }

  return result
}

purchaseBtn.addEventListener('click', () => {
  const result = checkRegister()
  formatResults(result.status, result.change)
})
