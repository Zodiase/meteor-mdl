/*!
 * Process Queue v2.4.3 r1
 * https://github.com/Zodiase/PQUEUE
 *
 * Copyright 2013 Xingchen Hong
 * Released under the MIT license
 * https://raw.github.com/Zodiase/PQUEUE/master/LICENSE
 *
 * Date: 2014-02-09 10:03
 */
/*
Change Log:
     Fixed a bug when connecting to a parent.
     Added a predefined process PQUEUE_IDLE for easy access.
     Added an option to turn off console logs.
*/
// add ';' to seperate from previous code clips.

function microtime(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}
var startTime = microtime(true);
function elapsedTime() {
    return microtime(true) - startTime;
}
function log(msg) {
    console.log('@' + (elapsedTime().toString(10) + '        ').substr(0,8) + ', PQUEUE: ' + msg);
}
function warn(msg) {
    console.warn('@' + (elapsedTime().toString(10) + '        ').substr(0,8) + ', PQUEUE: ' + msg);
}
function isArray(obj) {
    if (typeof obj !== 'object') return false;
    if (typeof obj.constructor !== 'function') return false;
    if (typeof obj.constructor.name !== 'string') return false;
    return (obj.constructor.name === 'Array');
}
// a stack for back-track to queues
var queueStack = [];
// this function returns a pqueue object
var PQUEUE = function () {
    "use strict";
    var parent = null,
        processArray = [],
        initialProcessID = 0,
        queueName = '',
        arg1Type = typeof arguments[0],
        arg2Type = typeof arguments[1],
        arg3Type = typeof arguments[2],
        arg4Type = typeof arguments[3];
    switch (arguments.length) {
        case 1:
            if (arg1Type === 'string') {
                // PQUEUE(string queueName)
                return queueStack[arguments[0]];
            } else if (arg1Type === 'object') {
                if (isArray(arguments[0])) {
                    // PQUEUE(object processArray)
                    processArray = arguments[0];
                } else if (isArray(arguments[0].processArray)) {
                    parent = (typeof arguments[0].parent === 'object') ? arguments[0].parent : null;
                    processArray = arguments[0].processArray;
                    initialProcessID = (typeof arguments[0].initialProcessID === 'number') ? arguments[0].initialProcessID : 0;
                    queueName = (typeof arguments[0].queueName === 'string') ? arguments[0].queueName : '';
                } else {
                    return null;
                }
            } else {
                return null;
            }
            break;
        case 2:
            if (arg1Type === 'object' && arg2Type === 'object') {
                // PQUEUE(object parentQueue, object processArray)
                parent = arguments[0];
                processArray = arguments[1];
                initialProcessID = 0;
                queueName = '';
            } else if (arg1Type === 'object' && arg2Type === 'number') {
                // PQUEUE(object processArray, number initialProcessID)
                parent = null;
                processArray = arguments[0];
                initialProcessID = arguments[1];
                queueName = '';
            } else if (arg1Type === 'object' && arg2Type === 'string') {
                // PQUEUE(object processArray, string queueName)
                parent = null;
                processArray = arguments[0];
                initialProcessID = 0;
                queueName = arguments[1];
            } else {
                return null;
            }
            break;
        case 3:
            if (arg1Type === 'object' && arg2Type === 'object' && arg3Type === 'number') {
                // PQUEUE(object parentQueue, object processArray, number initialProcessID)
                parent = arguments[0];
                processArray = arguments[1];
                initialProcessID = arguments[2];
                queueName = '';
            } else if (arg1Type === 'object' && arg2Type === 'object' && arg3Type === 'string') {
                // PQUEUE(object parentQueue, object processArray, string queueName)
                parent = arguments[0];
                processArray = arguments[1];
                initialProcessID = 0;
                queueName = arguments[2];
            } else if (arg1Type === 'object' && arg2Type === 'number' && arg3Type === 'string') {
                // PQUEUE(object processArray, number initialProcessID, string queueName)
                parent = null;
                processArray = arguments[0];
                initialProcessID = arguments[1];
                queueName = arguments[2];
            } else {
                return null;
            }
            break;
        case 4:
            if (arg1Type === 'object' && arg2Type === 'object' && arg3Type === 'number' && arg4Type === 'string') {
                // PQUEUE(object parentQueue, object processArray, number initialProcessID, string queueName)
                parent = arguments[0];
                processArray = arguments[1];
                initialProcessID = arguments[2];
                queueName = arguments[3];
            } else {
                return null;
            }
            break;
        default:
            return null;
    }
    // filter init process id
    if (typeof initialProcessID !== 'number')
        initialProcessID = 0;
    log('Instantiating new process queue.');
    // parameter check
    if (typeof processArray !== 'object') {
        warn('Invalid argument[1]. Expecting an Object.');
        warn('Returning NULL.');
        // 'return;' returns undefined
        return null;
    }
    log('Generating new process queue object.');
    // local copy of core data
    var PQ = {
        // core clock used to fire ticks
        'clock': false,
        // back reference to its parent queue if available
        'parent': (parent && typeof parent === 'object' && parent.PQUEUE) ? parent : null,
        // name of queue
        'name': '',
        /**
         * flags indicating queue status
         *     bit[0]  indicates a process is running
         *     bit[1]  indicates the queue is handling one tick
         *     bit[2]  indicates the queue is booted up but not yet stopped
         *     bit[3]  indicates the queue should get to the next process automatically
         *     bit[4]  indicates the queue is paused and waiting for a resume call
         *     bit[5]  indicates a general error
         *     bit[6]  indicates pc underflow
         *     bit[7]  indicates pc overflow
         *     bit[8]  indicates pc at halt
         *     bit[9]  indicates pc at barrier
         *     bit[10] indicates pc at no-op
         */
        'status': 0,
        // message array for errors
        'errorMessages': [],
        // array of processes
        'processStack': [],
        // fully-associative array used to find the index of a process
        'processIndexs': [],
        // index of the next process
        'processCounter': 0,
        // pointer to the next process
        'nextProcess': null,
        // storage for processes
        'sharedHeap': {},
        /**
         * waker stack is used to store resume call timers so that
         * when a resume call is called before the timer expires,
         * the rest timer won't affect the queue
         */
        'wakerStack': []
    },
    // flag constants
    FLAG_RUNNING = 0x001, // 0000 0000 0001
    FLAG_TICKING = 0x002, // 0000 0000 0010
    FLAG_BOOTED  = 0x004, // 0000 0000 0100
    FLAG_PAUSED  = 0x008, // 0000 0000 1000
    
    FLAG_GENERR  = 0x010, // 0000 0001 0000
    FLAG_PCUNDER = 0x020, // 0000 0010 0000
    FLAG_PCOVER  = 0x040, // 0000 0100 0000
    FLAG_PCHALT  = 0x080, // 0000 1000 0000
    FLAG_PCBAR   = 0x100, // 0001 0000 0000
    FLAG_PCNOOP  = 0x200, // 0010 0000 0000
    
    // interface object passed to processes
    api = {
        'heap': PQ.sharedHeap,
        'heap_dump': dumpSharedHeap,
        'pause': function (time) {
            /**
             * a wait call can only be made when the process is executing
             * and it should not be made twice
             */
            if (queueIsRunning() && !queueIsPaused()) pauseQueue(time);
        },
        'resume': function () {
            /**
             * however, a resume call can be made within the process right
             * after the pause call, or, at a later time
             * a resume call only clears the pause flag so that the clock
             * is again effective to the queue
             */
            if (queueIsPaused()) resumeQueue();
        },
        'pc': {
            'increment': pcIncrement,
            'decrement': pcDecrement,
            'offset': pcOffset,
            'goto': pcGoto,
            'locate': pcReference,
            'valueOf': valueOfPC,
            'toString': PCtoString
        },
        'isPaused': function () {
            return queueIsPaused();
        },
        // the so-called parent is actually the api object of the parent queue
        'parent': PQ.parent,
        // this is necessary for parent check to recognize a pqueue object
        'PQUEUE': true
    },
    // wrapper object returned to parent scripts
    wrapper = {
        'boot': function () {
            bootQueue();
            return wrapper;
        },
        'halt': function () {
            haltQueue();
            return wrapper;
        },
        'reset': function () {
            resetQueue();
            return wrapper;
        }
    };
    /* macro functions */
    // clock related functions
    function enableClock() {
        if (PQ.clock === false) {
            // keep calling tick as fast as possible
            PQ.clock = setInterval(tick, 0);
        }
    }
    function disableClock() {
        if (PQ.clock !== false) {
            // stop queue clock
            clearInterval(PQ.clock);
            PQ.clock = false;
        }
    }
    // heap related functions
    /**
     * this function returns a string representing
     * contents in shared heap
     */
    function dumpSharedHeap() {
        var result = '';
        for (var key in PQ.sharedHeap) {
            if (result !== '') result += ', \n';
            result += key + ':' + PQ.sharedHeap[key];
        }
        return '{\n' + result + '\n}';
    }
    /**
     * this function removes everything in the heap
     */
    function cleanSharedHeap() {
        // may cause memory leak but let's keep it this way for now
        PQ.sharedHeap.length = 0;
    }
    // <<< status related functions
    /**
     * this the core function handling status bits
     * the rest are macros using this function
     */
    function _statIs(setValue, flag) {
        var returnValue = Boolean(PQ.status & flag);
        if (setValue !== undefined) {
            if (setValue) PQ.status |= flag;
            else PQ.status &= ~flag;
        }
        return returnValue;
    }
    function queueIsRunning(setValue) {
        return _statIs(setValue, FLAG_RUNNING);
    }
    function queueIsTicking(setValue) {
        return _statIs(setValue, FLAG_TICKING);
    }
    function queueIsBooted(setValue) {
        return _statIs(setValue, FLAG_BOOTED);
    }
    function queueIsPaused(setValue) {
        return _statIs(setValue, FLAG_PAUSED);
    }
    function queueError(setValue) {
        return _statIs(setValue, FLAG_GENERR);
    }
    function pcUnderflow(setValue) {
        return _statIs(setValue, FLAG_PCUNDER);
    }
    function pcOverflow(setValue) {
        return _statIs(setValue, FLAG_PCOVER);
    }
    function pcAtHalt(setValue) {
        return _statIs(setValue, FLAG_PCHALT);
    }
    function pcAtBarrier(setValue) {
        return _statIs(setValue, FLAG_PCBAR);
    }
    function pcAtNoOp(setValue) {
        return _statIs(setValue, FLAG_PCNOOP);
    }
    /**
     * this function clears all flags related to pc
     * such as pcOverflow and pcHitBarrier, etc
     */
    function clearPcStatus() {
        pcUnderflow (false);
        pcOverflow  (false);
        pcAtHalt    (false);
        pcAtBarrier (false);
        pcAtNoOp    (false);
    }
    /**
     * this function sets all flags related to pc
     * such as pcOverflow and pcHitBarrier, etc
     */
    function updatePcStatus() {
        pcUnderflow (PQ.processCounter < 0);
        pcOverflow  (PQ.processCounter >= PQ.processStack.length);
        pcAtHalt    (PQ.nextProcess === PQUEUE_HALT);
        pcAtBarrier (PQ.nextProcess === PQUEUE_BARRIER);
        pcAtNoOp    (typeof PQ.nextProcess !== 'function');
        queueError  (pcUnderflow() || pcOverflow() || pcAtNoOp());
    }
    // >>> status related functions
    // <<< pc related functions
    /**
     * these functions should call updatePcStatus()
     */
    function pcGoto(newPc) {
        if (typeof newPc !== 'number') return;
        PQ.processCounter = newPc;
        PQ.nextProcess = PQ.processStack[PQ.processCounter];
        updatePcStatus();
    }
    function pcIncrement() {
        // halt when in error
        if (queueError()) return;
        pcGoto(PQ.processCounter + 1);
    }
    function pcDecrement() {
        // halt when in error
        if (queueError()) return;
        pcGoto(PQ.processCounter - 1);
    }
    function pcOffset(offset) {
        if (typeof offset !== 'number') return;
        PQ.processCounter += offset;
        PQ.nextProcess = PQ.processStack[PQ.processCounter];
        updatePcStatus();
    }
    function pcReference(funcName) {
        var index = PQ.processIndexs[String(funcName)];
        return (typeof index === 'number') ? index : -1;
    }
    function valueOfPC() {
        return PQ.processCounter;
    }
    function PCtoString() {
        return (typeof PQ.nextProcess === 'function') ? PQ.nextProcess.name : String(PQ.processCounter);
    }
    // >>> pc related functions
    function fireError(message) {
        queueError(true);
        PQ.errorMessages.push((typeof message === 'string') ? message : '');
    }
    function throwErrors() {
        warn('pcUnderflow: ' + Boolean(pcUnderflow()));
        warn('pcOverflow: ' + Boolean(pcOverflow()));
        warn('pcAtNoOp: ' + Boolean(pcAtNoOp()));
        warn('pcAtHalt: ' + Boolean(pcAtHalt()));
        warn('pcAtBarrier: ' + Boolean(pcAtBarrier()));
        while (PQ.errorMessages.length > 0) {
            warn(PQ.errorMessages.shift());
        }
        // clear error flag?
    }
    /* interface functions */
    /**
     * this function starts this queue
     * and sets the flag 'booted'
     * a booted queue can not be booted
     * again, unless it has been halted
     */
    function bootQueue() {
        // check flag
        if (queueIsBooted()) return;
        // set flag
        queueIsBooted(true);
        log('[' + PQ.name + '].boot');
        enableClock();
    }
    /**
     * this function kills this queue
     * and clears the flag 'booted'
     * it has no effect on an un-activated queue
     */
    function haltQueue() {
        // check flag
        if (!queueIsBooted()) return;
        // set flag
        queueIsBooted(false);
        log('[' + PQ.name + '].halt');
        disableClock();
    }
    /**
     * this function resets PC and heap (optional)
     * a booted queue can not be reset
     * added in 2.4.2
     */
     function resetQueue(clearHeap) {
        // check flag
        if (queueIsBooted()) return;
        log('[' + PQ.name + '].reset');
        pcGoto(initialProcessID);
        if (clearHeap)
            cleanSharedHeap();
     }
    /**
     * proceed to next process
     */
    function tick() {
        // check flags
        // a queue has to be booted first
        if (!queueIsBooted()) return;
        // skip ticks while the queue is paused
        if (queueIsPaused()) return;
        // prevent other ticks from interfering
        if (queueIsTicking()) return;
        // set flag
        queueIsTicking(true);
        log('[' + PQ.name + '].tick');
        // check if there was an error previously
        if (queueError()) {
            warn('Has error(s)');
            // is not ticking
            queueIsTicking(false);
            // throw errors
            throwErrors();
            // halt queue
            haltQueue();
            return;
        }
        if (pcAtHalt()) {
            // is not ticking
            queueIsTicking(false);
            // halt queue
            haltQueue();
            return;
        }
        /**
         * No need to verify PC value or process
         * since every pc modification will
         * also check the pc range and process
         * and set flags accordingly, so the 
         * previous error check is enough.
         */
        // -- verify PC value
        // -- verify process
        // fetch process
        var thePC = PQ.processCounter,
            theProcess = PQ.nextProcess;
        /**
         * mimic the behavior of a processor, 
         * increment the process counter before
         * executing
         * this step should also fire any error
         * if pc goes out of range and these errors
         * will be processed later
         */
        pcIncrement();
        log('PC:' + thePC + '>>' + theProcess.name);
        // set running flag
        queueIsRunning(true);
        /**
         * pass wrapped api over so client script
         * can not harm core objects
         */
        try {
            theProcess.call(api, api, api.heap);
        } catch (e) {
            fireError(e.message);
        }
        // clear running flag
        queueIsRunning(false);
        queueIsTicking(false);
    }
    /**
     * queue pausing mechanism
     */
    function appendWaker(time) {
        PQ.wakerStack.push(setTimeout(api.resume, time));
    }
    function removeWakers() {
        while (PQ.wakerStack.length > 0) {
            clearTimeout(PQ.wakerStack.shift());
        }
    }
    function pauseQueue(time) {
        // check flag
        if (!queueIsBooted()) return;
        if (queueIsPaused()) return;
        queueIsPaused(true);
        // disable clock
        disableClock();
        if (typeof time === 'number') appendWaker(time);
    }
    function resumeQueue() {
        // check flag
        if (!queueIsBooted()) return;
        if (!queueIsPaused()) return;
        queueIsPaused(false);
        removeWakers();
        enableClock();
    }
    // append processes
    for (var i = 0, n = processArray.length; i < n; ++i) {
        var process = processArray[i];
        var name = process.name;
        var index = PQ.processStack.length;
        PQ.processStack.push(process);
        if (name !== '') PQ.processIndexs[name] = index;
    }
    // set pc
    pcGoto(initialProcessID);
    // set name
    if (typeof queueName === 'string' && queueName !== '') {
        PQ.name = queueName;
        // insert into record only if the name is specified
        queueStack[queueName] = api;
    } else {
        PQ.name = String((new Date()).getTime());
    }
    return wrapper;
},
core_version = '2.4.3',
PQUEUE_HALT = function PQUEUE_HALT() {},
PQUEUE_BARRIER = function PQUEUE_BARRIER(queue) {
    queue.pause();
},
PQUEUE_IDLE = function PQUEUE_IDLE(queue) {
    queue.pause();
    // pc offset -1 so this process will be executed again on next resume()
    queue.pc.offset(-1);
};

// store version
Object.defineProperty(PQUEUE, "PQUEUE", {
    configurable: false,
    enumerable: false,
    value: core_version,
    writable: false
});

// Bind constants
Object.defineProperty(PQUEUE, "HALT", {
    configurable: false,
    enumerable: false,
    value: PQUEUE_HALT,
    writable: false
});
Object.defineProperty(PQUEUE, "BARRIER", {
    configurable: false,
    enumerable: false,
    value: PQUEUE_BARRIER,
    writable: false
});
Object.defineProperty(PQUEUE, "IDLE", {
    configurable: false,
    enumerable: false,
    value: PQUEUE_IDLE,
    writable: false
});

// export
module.exports = PQUEUE;