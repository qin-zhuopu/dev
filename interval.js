iId = setInterval(() => { gs.next() }, 1000)

clearInterval(iId)
iId = setInterval(() => {
    console.log('pressureSimulator ' + pressureSimulator.next())
}, 1000)