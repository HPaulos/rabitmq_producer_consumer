'use strict';

const contextMapper = require('../../config/config');

const namespaceToExchangeMap = contextMapper.namespaceToExchangeMap;

function getExchangeContextFromNameSpaceContext(context) {
    let exchangeContext = { name: namespaceToExchangeMap[context.name], key: context.room };
    return exchangeContext;
}

module.exports = getExchangeContextFromNameSpaceContext;