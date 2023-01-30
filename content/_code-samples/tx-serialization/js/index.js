'use strict'

// Organize imports
const fs = require("fs")
const parseArgs = require('minimist')
const TxSerializer = require('./tx-serializer') // Main serialization logic can be found in this file


function main(rawJson, verbose) {
    const json = JSON.parse(rawJson)
    const serializer = new TxSerializer(verbose)
    const serializedTx = serializer.serializeTx(json)

    console.log(serializedTx.toUpperCase())
}

const args = parseArgs(process.argv.slice(2), {
    alias: {
        'f': 'filename',
        'j': 'json',
        's': 'stdin',
        'v': 'verbose',
    },
    default: {
        'f': 'test-cases/tx1.json',
        'v': false
    }
})

let rawJson
if (args.json) {
    rawJson = args.json
    main(rawJson)
} else if (args.stdin) {
    const stdin = process.openStdin();

    let data = ""

    stdin.on('data', function(chunk) {
        data += chunk
    });

    stdin.on('end', function() {
        main(data)
    });
} else {
    rawJson = fs.readFileSync(args.filename, 'utf8')
    main(rawJson, args.verbose)
}