import { rounds, roundChange, roundTotal } from "./catalog.ts"
import { changeHint, formatMoney, tenderJiao, totalHint } from "./money.ts"

function check(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

check(formatMoney(0) === "0元", formatMoney(0))
check(formatMoney(5) === "5角", formatMoney(5))
check(formatMoney(13) === "1元3角", formatMoney(13))
check(formatMoney(20) === "2元", formatMoney(20))
check(formatMoney(48) === "4元8角", formatMoney(48))
check(formatMoney(100) === "10元", formatMoney(100))

check(roundTotal(rounds[0]) === 13, "round 1 total")
check(roundChange(rounds[0]) === 37, "round 1 change")
check(roundTotal(rounds[1]) === 21, "round 2 total")
check(roundChange(rounds[1]) === 29, "round 2 change")
check(roundTotal(rounds[2]) === 48, "round 3 total")
check(roundChange(rounds[2]) === 2, "round 3 change")
check(roundTotal(rounds[3]) === 45, "round 4 total")
check(roundChange(rounds[3]) === 55, "round 4 change")

check(totalHint(13, [5, 8]) === "ok", "5角+8角")
check(totalHint(3, [5, 8]) === "carry", "forgot carry")
check(totalHint(11, [15, 6]) === "carry", "1元5角+6角 missed carry")
check(totalHint(21, [15, 6]) === "ok", "2元1角")
check(totalHint(40, [20, 28]) === "retry", "forgot jiao")
check(changeHint(2, 2, false) === "ok", "exact change")
check(changeHint(10, 2, true) === "carry", "yuan for jiao change")
check(changeHint(30, 37, true) === "retry", "yuan is valid when change is over 1 yuan")
check(totalHint(48, [20, 28]) === "ok", "three-or-two prices still add")
check(totalHint(33, [5, 8, 20]) === "ok", "free basket total")
check(totalHint(23, [5, 8, 20]) === "carry", "free basket forgot carry")
check(tenderJiao(13) === 50, "pay 5 yuan for 1元3角")
check(tenderJiao(48) === 50, "pay 5 yuan for 4元8角")
check(tenderJiao(55) === 100, "pay 10 yuan past 5 yuan")
check(tenderJiao(100) === 100, "exact 10 yuan")

console.log("money ok")
