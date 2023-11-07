/**
 * Event triggered from sidekick
 * @param {object} detail details about the project
 */
const openDrive = ({ detail }) => {
  const sk = detail.data;
  window.open(sk?.config?.mountpoint, '_blank');
};

// eslint-disable-next-line import/prefer-default-export
export function opneGoogleDrive() {
  // bink event to the sidekick button
  const sk = document.querySelector('helix-sidekick');
  if (sk) {
  // sidekick already loaded
    sk.addEventListener('custom:open', openDrive);
  } else {
  // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      document.querySelector('helix-sidekick')
        .addEventListener('custom:open', openDrive);
    }, { once: true });
  }
}
