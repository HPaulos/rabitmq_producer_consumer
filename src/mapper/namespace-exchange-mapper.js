'use strict';
const contextMapper = require('../../config/config');

const namespaceToExchangeMap = contextMapper.namespaceToExchangeMap;

//TODO enable exchange name mapper  map context to object having exchange name and routineekey

function getExchangeContextFromNameSpaceContext(context) {
    let exchangeContext = { name: namespaceToExchangeMap[context.name], key: context.room };
    return exchangeContext;
}

module.exports = getExchangeContextFromNameSpaceContext;