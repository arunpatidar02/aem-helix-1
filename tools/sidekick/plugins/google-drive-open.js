/**
 * Event triggered from sidekick
 * @param {object} detail details about the project
 */
const openDrive = ({ detail }) => {
  window.open(detail?.config?.mountpoint, '_blank');
};

// eslint-disable-next-line import/prefer-default-export
export function opneGoogleDrive() {
  // bink event to the sidekick button
  const SIDEKICK_SELECTOR = 'aem-sidekick';
  const sk = document.querySelector(SIDEKICK_SELECTOR);
  if (sk) {
  // sidekick already loaded
    sk.addEventListener('custom:open-drive', openDrive);
  } else {
  // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      document.querySelector(SIDEKICK_SELECTOR)
        .addEventListener('custom:open-drive', openDrive);
    }, { once: true });
  }
}
