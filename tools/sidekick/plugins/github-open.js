/**
 * Event triggered from sidekick
 * @param {object} detail details about the project
 */
const openGitHub = ({ detail }) => {
  const config = detail.data?.config;
  const githubUrl = `https://github.com/${config.innerHost.split('--')[2].split('.')[0]}/${config.repo}`;
  window.open(githubUrl, '_blank');
};

// eslint-disable-next-line import/prefer-default-export
export function openGitHubRepo() {
  // bink event to the sidekick button
  const sk = document.querySelector('helix-sidekick');
  if (sk) {
  // sidekick already loaded
    sk.addEventListener('custom:open-github', openGitHub);
  } else {
  // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      document.querySelector('helix-sidekick')
        .addEventListener('custom:open-github', openGitHub);
    }, { once: true });
  }
}
