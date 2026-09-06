module.exports = ({ config }) => ({
  ...config,
  name: 'BioMind Web',
  slug: 'biomind-web',
  experiments: { ...config.experiments, baseUrl: '/app' },
});
