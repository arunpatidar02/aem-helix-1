/**
 * Event triggered from sidekick
 * @param {object} detail details about the project
 */
const openGitHub = ({ detail }) => {
  const config = detail?.config;
  const githubUrl = `https://github.com/${config.owner}/${config.repo}`;
  window.open(githubUrl, '_blank');
};

// eslint-disable-next-line import/prefer-default-export
export function openGitHubRepo() {
  // bink event to the sidekick button
  const SIDEKICK_SELECTOR = 'aem-sidekick';
  const sk = document.querySelector(SIDEKICK_SELECTOR);
  if (sk) {
  // sidekick already loaded
    sk.addEventListener('custom:open-github', openGitHub);
  } else {
  // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      document.querySelector(SIDEKICK_SELECTOR)
        .addEventListener('custom:open-github', openGitHub);
    }, { once: true });
  }
}
