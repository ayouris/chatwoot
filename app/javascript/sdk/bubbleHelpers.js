import { addClasses, removeClasses, toggleClass } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { isExpandedView } from './settingsHelper';
import {
  CHATWOOT_CLOSED,
  CHATWOOT_OPENED,
} from '../widget/constants/sdkEvents';
import { dispatchWindowEvent } from 'shared/helpers/CustomEventHelper';
import botIconUrl from 'shared/assets/bot.svg';

export const bubbleSVG =
  'M233.07,132.61 L237.07,143.81 L239.73,156.08 L239.73,172.88 L236.00,187.81 L230.40,200.08 L222.67,210.48 L212.27,219.55 L200.00,226.48 L187.47,231.01 L174.13,233.41 L158.40,233.41 L137.87,228.61 L96.00,209.15 L106.40,199.28 L120.00,194.75 L126.67,195.81 L145.33,204.61 L158.67,207.01 L179.20,204.61 L194.93,196.88 L202.40,189.68 L207.73,180.61 L210.13,171.81 L210.13,160.35 L207.47,149.41 L202.13,138.21 L187.73,121.41 L200.00,124.35 L198.13,98.21 L199.20,96.35 L213.60,106.21 L225.33,119.28 Z M75.20,147.01 L80.27,142.75 L87.20,141.95 L94.67,145.15 L97.87,145.41 L101.33,144.35 L104.53,141.41 L108.27,131.55 L116.00,124.08 L117.60,120.61 L116.80,114.48 L108.80,104.88 L108.53,97.95 L112.53,91.81 L116.53,89.68 L120.27,89.15 L126.93,91.55 L131.20,97.68 L130.67,105.68 L123.47,113.68 L122.13,120.35 L123.73,124.08 L131.20,131.01 L135.20,141.15 L141.07,145.15 L145.60,144.88 L152.80,141.95 L158.93,142.48 L165.07,147.81 L166.40,155.01 L164.80,159.55 L161.60,163.01 L156.53,165.15 L153.07,165.15 L149.60,164.08 L145.60,160.88 L142.40,152.88 L137.60,148.35 L132.27,147.81 L124.00,151.81 L118.40,152.35 L108.27,148.08 L104.80,147.81 L101.87,148.61 L98.40,151.55 L94.93,159.81 L92.27,162.75 L88.00,164.88 L83.47,165.15 L78.93,163.55 L75.47,160.35 L73.87,157.15 L73.33,152.35 Z M68.53,78.48 L70.67,88.08 L68.53,103.81 L64.00,110.21 L46.67,122.21 L35.73,136.08 L29.07,153.95 L28.53,170.75 L30.93,179.28 L36.00,188.08 L42.40,194.48 L51.73,200.08 L71.47,204.61 L86.40,203.55 L97.33,200.35 L88.53,209.68 L113.33,223.01 L100.27,229.68 L82.40,234.21 L63.20,234.21 L40.53,227.55 L26.93,219.55 L18.40,212.08 L9.07,200.08 L3.20,187.81 L0.00,175.01 L0.00,157.95 L2.13,147.01 L7.47,132.08 L14.93,119.28 L30.13,103.28 L66.93,77.41 Z M60.80,35.81 L70.93,24.61 L80.80,16.88 L91.73,11.01 L111.73,5.41 L126.93,5.41 L145.07,10.75 L158.67,18.75 L171.20,29.95 L184.80,50.48 L190.93,70.21 L195.47,116.08 L182.13,112.61 L171.47,103.81 L168.27,96.08 L166.13,74.75 L161.07,62.21 L148.00,45.95 L135.47,37.68 L126.13,34.75 L116.80,34.21 L106.93,36.35 L97.07,41.68 L87.47,50.48 L81.60,58.75 L76.80,68.61 L73.60,81.68 L70.67,70.75 L68.80,69.95 L47.47,84.88 L45.60,84.61 L46.67,68.35 L52.27,50.48 Z';

export const body = document.getElementsByTagName('body')[0];
export const widgetHolder = document.createElement('div');

export const bubbleHolder = document.createElement('div');
export const chatBubble = document.createElement('button');
export const closeBubble = document.createElement('button');
export const notificationBubble = document.createElement('span');

export const setBubbleText = bubbleText => {
  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.getElementById('woot-widget--expanded__text');
    textNode.innerText = bubbleText;
  }
};

export const createBubbleIcon = ({ className, target }) => {
  let bubbleClassName = `${className} woot-elements--${window.$chatwoot.position} woot-widget-bubble-center-img`;

  // Clear existing icon if any
  target.replaceChildren();

  const img = document.createElement('img');
  img.src = botIconUrl;
  img.alt = 'Open chat window';
  img.width = 72;
  img.height = 72;

  target.appendChild(img);

  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.createElement('div');
    textNode.id = 'woot-widget--expanded__text';
    textNode.innerText = '';
    target.appendChild(textNode);
    bubbleClassName += ' woot-widget--expanded';
  }

  target.className = bubbleClassName;
  target.title = 'Open chat window';
  return target;
};

export const createBubbleHolder = hideMessageBubble => {
  if (hideMessageBubble) {
    addClasses(bubbleHolder, 'woot-hidden');
  }
  addClasses(bubbleHolder, 'woot--bubble-holder');
  bubbleHolder.id = 'cw-bubble-holder';
  bubbleHolder.dataset.turboPermanent = true;
  body.appendChild(bubbleHolder);
};

const handleBubbleToggle = newIsOpen => {
  IFrameHelper.events.onBubbleToggle(newIsOpen);

  if (newIsOpen) {
    dispatchWindowEvent({ eventName: CHATWOOT_OPENED });
  } else {
    dispatchWindowEvent({ eventName: CHATWOOT_CLOSED });
    chatBubble.focus();
  }
};

export const onBubbleClick = (props = {}) => {
  const { toggleValue } = props;
  const { isOpen } = window.$chatwoot;
  if (isOpen === toggleValue) return;

  const newIsOpen = toggleValue === undefined ? !isOpen : toggleValue;
  window.$chatwoot.isOpen = newIsOpen;

  toggleClass(chatBubble, 'woot--hide');
  toggleClass(closeBubble, 'woot--hide');
  toggleClass(widgetHolder, 'woot--hide');

  handleBubbleToggle(newIsOpen);
};

export const onClickChatBubble = () => {
  bubbleHolder.addEventListener('click', onBubbleClick);
};

export const addUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  addClasses(holderEl, 'has-unread-view');
};

export const removeUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  removeClasses(holderEl, 'has-unread-view');
};
