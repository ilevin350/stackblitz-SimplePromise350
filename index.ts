import './style.css';

const outputDiv: HTMLElement = document.getElementById('output');
const forceReject = true;

const myPromise = new Promise<string>((resolve, reject) => {
  forceReject
    ? setTimeout(() => reject(`myPromise rejected</br>`), 1000)
    : setTimeout(() => resolve(`myPromise resolved</br>`), 1000);
});

// -----------------------------------------------------------------------
// Starting with forceReject set to true, myPromise will be fulfilled and
// the success value will be passed to the success function for link #1 
// in the promise chain, which will append additional text to indicate
// the associated link, followed by a line break.
//
// The then function for link #1 will return a new Promise object, 
// representing link #2 in the promise chain, which will initially be
// in the pending state.  When the success callback for link #1
// completes, the promise for link #2 will become fulfilled and the
// return value from the success callback for link #1 will be passed 
// to the success callback for link #2, which will append additional 
// text to indicate the associated link, followed by another line break.
//
// This will be repeated for link #3.  When we get to link #4, the
// resulting value string built up from myPromise through link #3 is
// bound to the innerHTML of the output div in the HTML.
//
// The output will be:
//
// myPromise resolved
// link #1 resolved
// link #2 resolved
// link #3 resolved
//
// If you set forceReject to true, the output will be:
//
// myPromise rejected
// link #1 rejected
// link #2 resolved
// link #3 resolved
//
// In this case myPromise is rejected and the resulting failure reason
// is passed to the failure callback for link #1.  This is where things
// take an unexpected turn.  Link #1 returns a new Promise object for
// link #2 and the rules say that if the previous link returns a
// success OR failure value, then the new Promise object will be
// fulfilled.  This means the value string will be passed to the
// success callback for link #2 NOT the failure callback!
//
// This makes sense since the failure callback for Link #1 didn't fail.
// That could only happen if it had returned a promise that was
// eventually rejected.
//
// However, the end result appears as if the chain "fixed" itself -
// i.e., the remaining links are all resolved!  That's why it's better
// to remove all of the failure callbacks from all of the links
// except the last one in the chain, which by convention should be
// a catch function, which is the same as a then function with null
// for the success callback.  This makes the code more readable.
//
// You can test this by commenting out the failure callbacks for link #1
// through link #3.  In this case the code will traverse the chain until
// it finds a failure callback, which is at the catch function.
// -----------------------------------------------------------------------
myPromise
  .then(                                                     // Link #1
    (value) => `${value} link #1 resolved</br>`, 
    (reason) => `${reason} link #1 rejected</br>`
  )
  .then(                                                     // Link #2
    (value) => `${value} link #2 resolved</br>`,
    (reason) => `${reason} link #2 rejected</br>`
  )
  .then(                                                     // Link #3
    (value) => `${value} link #3 resolved</br>`,
    (reason) => `${reason} link #3 rejected</br>`
    )
  .then((value) => (outputDiv.innerHTML = value))            // Link #4
  .catch((err) => {
    outputDiv.innerHTML = `${err} from catch`;
  });
