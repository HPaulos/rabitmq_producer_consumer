'use strict';

function getTaskContextRoom(context) {
    return context.userId + '$' + context.taskId;
}

function getTaskListContextRoom(context) {
    return '';
}

function getRoomName(context){
    switch(context.name){
        case 'Task':return getTaskContextRoom(context);
        case 'TaskList': return getTaskListContextRoom(context);        
        default: return '';
    }
}

module.exports = getRoomName;