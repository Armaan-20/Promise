const PromiseState = {
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected"
};

class MyPromise {
    #state = PromiseState.PENDING;
    #value = undefined;
    #thenCbs = [];
    #catchCbs = [];
    constructor(callback) {
        try {
            callback(this.#onSuccess.bind(this), this.#onFailure.bind(this));
        } catch (error) {
            this.#onFailure(error);
        }
    }

    #runCallbacks = () => {
        // this needs to be a microtask, runs asynchronously
        queueMicrotask(() => {
            if(this.#state === PromiseState.FULFILLED) {
                this.#thenCbs.forEach(cb => {
                    cb(this.#value);
                });
                this.#thenCbs = [];
            }
            if(this.#state === PromiseState.REJECTED) {
                this.#catchCbs.forEach(cb => {
                    cb(this.#value);
                });
                this.#catchCbs = [];
            }
        });
    }
    #onSuccess = (value) => {
        // Implementation here
        if(this.#state !== PromiseState.PENDING) return;
        this.#state = PromiseState.FULFILLED;
        this.#value = value;
        this.#runCallbacks();
    }
    #onFailure = (error) => {
        // Implementation here
        if(this.#state !== PromiseState.PENDING) return;
        this.#state = PromiseState.REJECTED;
        this.#value = error;
        this.#runCallbacks();
    }

    then = (successCb, failureCb) => {
        return new MyPromise((resolve, reject) => {
            this.#thenCbs.push((value) => {
                if(!successCb) {
                    resolve(value);
                    return;
                }
                try {
                    const result = successCb(value);
                    if(result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            })

            this.#catchCbs.push((error) => {
                if(!failureCb) {
                    reject(error);
                    return;
                }
                try {
                    const result = failureCb(error);
                    if(result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (err) {
                    reject(err);
                }
            })

            this.#runCallbacks();
        });

        // if(successCb) {
        //     this.#thenCbs.push(successCb);
        // }
        // if(failureCb) {
        //     this.#catchCbs.push(failureCb);
        // }
        // this.#runCallbacks();
    }

    catch = (callback) => {
        return this.then(undefined, callback);
    }

    static resolve = (value) => {
        return new MyPromise((resolve) => {
            resolve(value);
        });
    }

    static reject = (error) => {
        return new MyPromise((_, reject) => {
            reject(error);
        });
    }
}

const myPromise = new MyPromise((resolve, reject) => {
    // Simulate an asynchronous operation
    setTimeout(() => {
        const success = true; // Change to false to test rejection
        if (success) {
            resolve("Operation successful!");
        } else {
            reject("Operation failed!");
        }
    }, 1000);
});

// myPromise.then((value) => {
//     console.log("First Chain:", value);
//     return "Data from first then";
// }).then((value) => {
//     console.log("Second Chain:", value);
// })


// myPromise.catch().catch().catch((error) => {
//     console.log("Caught Error:", error);
// });

MyPromise.resolve("Resolved Value").then((value) => {
    throw value;
})

