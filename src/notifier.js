/*!
 * notifier.js ver 1.1.1 (2023-03-22)
 * (c) katwat (katwat.s1005.xrea.com)
 */
/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 */
(function(definition) {
	Notifier = definition(document);
}(function(document) {
	var // notification type
		TOAST = 1, // toast
		PROGRESS = 2, // progress
		CONFIRM = 3, // confirm

		TICK_DELAY = 16,

		timeoutId = 0,
		fallbackId = 0,
		progressText = '',
		progressTextDom = null,
		rootDom = null,
		closeCallback,

		Notifier = {
			escapeText: true, // setting false is at your own risk.
			timeoutDelay: 3000, // toast display duration (ms)
			transitionDuration: 333, // fade-in/out duration (tms)
			transitionTiming: 'linear', // fade-in/out timing function
			open: function(type,text,opt) {
				var that = this,
					okButtonDom,
					cancelButtonDom,
	
				// options
				// - for all
					pos, // position: 'c','t','r','b','l','tl','tr','bl', or 'br'. use 'c' if not assign
					custom, // additional className for customizing display
					icon, // additional className for icon display
					//onclose, // callback on close
				// - for toast
					timeout, // timeout delay (ms) (default=3000), no timeout when zero or minus, then need close
				// - for confirm
					ok, // caption string for ok-button (default='OK'), no button if null or empty string
					onok, // callback on ok-button click
					cancel, // caption string for cancel-button (default='Cancel'), no button if null or empty string
					oncancel;// callback on cancel-button click
	
				this.close(true);
				text = escape(text || '');
				opt = opt || {};
				pos = ' pos-' + (opt.pos || 'c');
				custom = opt.custom ? ' ' + opt.custom  : '';
				icon = opt.icon ? '<i class="' + opt.icon + '"></i>' : '';
				closeCallback = opt.onclose;
	
				switch (type) {
				case TOAST:
					if (opt.timeout <= 0) {
						timeout = 0; // no timeout
					} else
					if (!opt.timeout) {
						timeout = this.timeoutDelay; // use default if not assign
					} else {
						timeout = opt.timeout;
					}
					/*
					<div class="toast {pos} {custom}">
						{<i class="icon-xxx"></i>}<p>{text}</p>
					</div>
					*/
					createDom('<div class="toast' + pos + custom + '">' + icon + '<p>' + text + '</p></div>');
					if (timeout > 0) {
						timeoutId = setTimeout(function() {
							timeoutId = 0;
							that.close();
						},timeout + that.transitionDuration + TICK_DELAY);
					}
					break;
				case PROGRESS:
					/*
					<div class="progress {pos} {custom}">
						{<i class="icon-xxx"></i>}<p>{text}</p>
					</div>
					*/
					progressText = text;
					createDom('<div class="progress' + pos + custom + '">' + icon + '<p>' + text + '</p></div>',true);
					progressTextDom = rootDom.querySelector('.progress p');
					break;
				case CONFIRM:
					if (opt.ok === undefined) {
						ok = 'OK'; // use default if undefined
					} else {
						ok = opt.ok; // no button if null or empty string
					}
					if (opt.cancel === undefined) {
						cancel = 'Cancel'; // use default if undefined
					} else {
						cancel = opt.cancel;  // no button if null or empty string
					}
					if (!ok && !cancel) {
						// not accept !
						return;
					}
					ok = ok ? '<button class="ok">' + escape(ok) + '</button>' : '';
					cancel = cancel ? '<button class="cancel">' + escape(cancel) + '</button>' : '';
					onok = opt.onok;
					oncancel = opt.oncancel;
					/*
					<div class="confirm {pos} {custom}">
						{<i class="icon-xxx"></i>}<p>{text}</p>
						<nav>
							<button class="cancel">{cancel}</button>
							<button class="ok">{ok}</button>
						</nav>
					</div>
					*/
					createDom('<div class="confirm' + pos + custom + '">' + icon + '<p>' + text + '</p><nav>' + cancel + ok + '</nav></div>',true);
					okButtonDom = rootDom.querySelector('.confirm .ok');
					if (okButtonDom) {
						okButtonDom.onclick = function(e) {
							this.onclick = null;
							if (onok) {
								onok(e);
							}
							that.close();
						};
					}
					cancelButtonDom = rootDom.querySelector('.confirm .cancel');
					if (cancelButtonDom) {
						cancelButtonDom.onclick = function(e) {
							this.onclick = null;
							if (oncancel) {
								oncancel(e);
							}
							that.close();
						};
					}
					break;
				default:
					return;
				}
	
				document.body.appendChild(rootDom);
				setTimeout(function() {
					rootDom.classList.add('show'); // start transition
				},TICK_DELAY);
	
				function createDom(html,modal) {
					rootDom = document.createElement('div');
					rootDom.className = 'notifier' + (modal ? ' modal' : '');
					rootDom.innerHTML = html;
					rootDom.style.transition = 'opacity ' + that.transitionDuration + 'ms ' + that.transitionTiming;
				}
			},
			close: function(force) {
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = 0;
				}
				if (force) {
					remove();
				} else {
					if (rootDom && rootDom.classList.contains('show')) {
						if (!rootDom.ontransitionend) {
							rootDom.ontransitionend = function() {
								remove();
							};

							setTimeout(function() {
								rootDom.classList.remove('show'); // start transition
							},TICK_DELAY);

							// fallback for no transition
							fallbackId = setTimeout(remove,this.transitionDuration + TICK_DELAY*6);
						}
					} else {
						remove();
					}
				}
	
				function remove() {
					if (fallbackId) {
						clearTimeout(fallbackId);
						fallbackId = 0;
					}
					if (rootDom) {
						rootDom.ontransitionend = null;
						rootDom.remove();
						rootDom = null;
						progressTextDom = null;
						if (closeCallback) {
							closeCallback();
						}
					}
				}
			},
			toast: function(text,opt) {
				this.open(TOAST,text,opt);
			},
			progress: function(text,opt) {
				if (progressTextDom) {
					text = escape(text || '');
					if (progressText !== text) {
						progressText = text;
						if (progressText) {
							progressTextDom.innerHTML = progressText; // update text
						} else {
							this.close(); // auto close if not assign text
						}
					}
				} else {
					this.open(PROGRESS,text,opt);
				}
			},
			confirm: function(text,opt) {
				this.open(CONFIRM,text,opt);
			}
		};

	return Notifier;

	function escape(t) { // htmlspecialchars
		return Notifier.escapeText ? t.replace(/["&'<>]/g,function(m) {
			return {
				'"': '&#34;', // &quot;
				'&': '&amp;',
				"'": '&#39;', // &apos;
				'<': '&lt;',
				'>': '&gt;'
			}[m];
		}) : t;
	}

}));
