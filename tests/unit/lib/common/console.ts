import { sandbox as Sandbox } from 'sinon';
import * as _console from 'src/lib/common/console';

const mockRequire = intern.getPlugin<mocking.MockRequire>('mockRequire');

const sandbox = Sandbox.create();
const mockConsole = {
	log: sandbox.spy(() => {}),
	warn: sandbox.spy(() => {}),
	error: sandbox.spy(() => {})
};

let console: typeof _console;
let removeMocks: () => void;

registerSuite('lib/common/console', {
	after() {
		removeMocks();
	},

	afterEach() {
		sandbox.resetHistory();
	},

	tests: {
		'console exists': {
			before() {
				return mockRequire(require, 'src/lib/common/console', {
					'@dojo/shim/global': {
						default: {
							console: mockConsole
						}
					}
				}).then(handle => {
					removeMocks = handle.remove;
					console = handle.module;
				});
			},

			tests: {
				log() {
					console.log('foo', 5);
					assert.deepEqual(mockConsole.log.args, [['foo', 5]]);
				},

				warn() {
					console.warn('foo', 5);
					assert.deepEqual(mockConsole.warn.args, [['foo', 5]]);
				},

				error() {
					console.error('foo', 5);
					assert.deepEqual(mockConsole.error.args, [['foo', 5]]);
				}
			}
		},

		'console does not exist': {
			before() {
				return mockRequire(require, 'src/lib/common/console', {
					'@dojo/shim/global': {
						default: {
							console: undefined
						}
					}
				}).then(handle => {
					removeMocks = handle.remove;
					console = handle.module;
				});
			},

			tests: {
				log() {
					assert.doesNotThrow(() => console.log('foo', 5));
					assert.equal(mockConsole.log.callCount, 0);
				},

				warn() {
					assert.doesNotThrow(() => console.warn('foo', 5));
					assert.equal(mockConsole.warn.callCount, 0);
				},

				error() {
					assert.doesNotThrow(() => console.error('foo', 5));
					assert.equal(mockConsole.error.callCount, 0);
				}
			}
		}
	}
});
