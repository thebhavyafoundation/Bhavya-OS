/**
 * Bhavya OS — State Module
 * State management.
 */

export class State {
  constructor() {
    this.state = {};
    this.history = [];
  }

  get(key) {
    return key.split(".").reduce((obj, k) => obj?.[k], this.state);
  }

  set(key, value) {
    const keys = key.split(".");
    let obj = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.history.push({
      key,
      value,
      timestamp: new Date().toISOString(),
    });
    return this.state;
  }

  delete(key) {
    const keys = key.split(".");
    let obj = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) return false;
      obj = obj[keys[i]];
    }
    delete obj[keys[keys.length - 1]];
    return true;
  }

  getAll() {
    return { ...this.state };
  }

  getHistory() {
    return [...this.history];
  }

  reset() {
    this.state = {};
    this.history = [];
  }
}
