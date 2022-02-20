import events from './events.js';
import logger from './logger.js';

export default class Ticker {
	constructor() {
		this.timeScale = 1;
		this.events = events;

		this.active = false;
		this.refDt = 16;
		this.lastFrame = 0;
		this.guid = 0;
		this.timeouts = {};

		this._scopedTickFunc = this._tick.bind(this);
	}

	init() {
		return this;
	}

	run() {
		this.active = true;
		this.lastFrame = performance.now();
		requestAnimationFrame(this._scopedTickFunc);

		return this;
	}

	stop() {
		this.active = false;
	}

	_tick(timestamp) {
		if (!this.active) {
			return;
		}

		requestAnimationFrame(this._scopedTickFunc);

		const currFrame = performance.now();
		const dt = currFrame - this.lastFrame;
		const dtf = dt / this.refDt;

		// Main loop event

		if (dtf >= 1) {
			try {
				this.events.emit('frame_tick', dt * this.timeScale, dtf * this.timeScale);
			} catch (err) {
				this.stop();
				logger.group('CORE_WARNS', 'Ticker.frame_tick error: ', err);
			}

			// Delays trigger
			try {
				for (const k in this.timeouts) {
					const t = this.timeouts[k];
					if (currFrame >= t.timeout) {
						delete this.timeouts[k];
						t.callback();
					}
				}
			} catch (err) {
				logger.group('CORE_WARNS', 'Ticker.timeouts error: ', err);
			}

			this.lastFrame = currFrame;
		}
	}

	timeout(callback, delay) {
		this.delays['i' + this.guid++] = {
			timeout: this.lastFrame + delay,
			callback,
		};
	}
}
